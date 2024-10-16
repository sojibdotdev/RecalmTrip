'use server'
import jwt, { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken'
import * as z from 'zod'
import { ResetPasswordSchema } from '@/schema'
import { auth } from '@/auth'
import { AuthResponse } from '@/types/auth'
import { client } from '@/lib/prismaClient'
import bcrypt from 'bcryptjs'
import { decrypt } from '@/utils/encrypt'

export const resetPassword = async (
  values: z.infer<typeof ResetPasswordSchema>
): Promise<AuthResponse> => {
  const validatedFields = ResetPasswordSchema.safeParse(values)

  if (!validatedFields.success) {
    return { success: false, error: 'Invalid fields!' }
  }

  const { password, token } = validatedFields.data

  const session = await auth()
  const SECRET_KEY = process.env.JWT_SECRET_KEY as string

  if (!SECRET_KEY) {
    throw new Error(
      'Missing secret key. Please set the JWT_SECRET_KEY environment variable.'
    )
  }

  try {
    const decryptedToken = (await decrypt(token)) as { token: string }
    const decodedToken = await jwt.verify(
      decryptedToken?.token,
      process.env.JWT_SECRET_KEY!
    )
    if (decodedToken) {
      if (!session?.user?.id) {
        return {
          success: false,
          error: 'User not found'
        }
      }
      const hashedPassword = await bcrypt.hash(password, 10)
      await client.user.update({
        where: {
          id: session.user.id
        },
        data: {
          password: hashedPassword
        }
      })
      await client.token.deleteMany({
        where: {
          userId: session.user.id,
          type: 'SET_PASSWORD'
        }
      })
    }
    return {
      success: true,
      message: 'Password updated successfully'
    }
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return {
        success: false,
        error: 'Token expired. Please request a new password reset.'
      }
    } else if (error instanceof JsonWebTokenError) {
      return { success: false, error: 'Invalid token. Please try again.' }
    } else {
      console.error('Error resetting password:', error)
      return { success: false, error: 'Unauthorized access.' }
    }
  }
}
