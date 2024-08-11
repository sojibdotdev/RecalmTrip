'use server'
import jwt, { Secret, TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken'
import * as z from 'zod'
import { ResetPasswordSchema } from '../../schemas'
import { auth } from '../../auth'
import { AuthActionResponse } from '../../../types/auth'
import { client } from '../../lib/prismaClient'
import bcrypt from 'bcryptjs'

export const resetPassword = async (
  values: z.infer<typeof ResetPasswordSchema>
): Promise<AuthActionResponse> => {
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
    jwt.verify(token, SECRET_KEY as Secret)
    if (!session?.user?.id) {
      throw new Error('User session not found')
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
