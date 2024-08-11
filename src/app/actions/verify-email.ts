'use server'
import * as z from 'zod'
import { VerifyEmailSchema } from '../../schemas'
import { AuthActionResponse } from '../../../types/auth'
import bcrypt from 'bcryptjs'
import { client } from '../../lib/prismaClient'
import { signIn } from '../../auth'
import { AuthError } from 'next-auth'

export const verifyEmail = async (
  values: z.infer<typeof VerifyEmailSchema>
): Promise<AuthActionResponse> => {
  const validatedFields = VerifyEmailSchema.safeParse(values)

  if (!validatedFields.success) {
    return { success: false, error: 'Invalid fields!' }
  }

  const { otp, email } = validatedFields.data

  try {
    const result = await client.otp.findFirst({
      where: {
        email,
        isValid: true
      }
    })

    if (!result || !result.token) {
      return { success: false, error: 'Invalid OTP!' }
    }

    if (result.expiredOn <= new Date()) {
      return { success: false, error: 'OTP has expired!' }
    }

    const isMatched = await bcrypt.compare(otp, result.token)

    if (!isMatched) {
      return { success: false, error: 'Invalid OTP!' }
    }

    try {
      await signIn('email_otp', {
        email,
        otp,
        redirect: false
      })
      const user = await client.user.findFirst({
        where: {
          email
        }
      })

      //verify email if not verified
      if (!user?.emailVerified) {
        await client.user.update({
          where: {
            email
          },
          data: {
            emailVerified: new Date()
          }
        })
      }
      //Make all the OTP invalid for current user
      await client.otp.deleteMany({
        where: {
          email: email
        }
      })

      return { success: true, message: 'OTP validated successfully' }
    } catch (error) {
      if (error instanceof AuthError) {
        return { success: false, error: 'Invalid credentials!' }
      }
      return { success: false, message: 'Something went wrong !' }
    }
  } catch (error) {
    return { success: false, error: 'Something went wrong!' }
  }
}
