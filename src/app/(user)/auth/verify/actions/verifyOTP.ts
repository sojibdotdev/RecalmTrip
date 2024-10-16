'use server'
import * as z from 'zod'
import { AuthResponse } from '@/types/auth'
import bcrypt from 'bcryptjs'
import { client } from '@/lib/prismaClient'
import { VerifyOTPSchema } from '@/schema'
import { signIn } from '@/auth'

export const verifyOTP = async (
  values: z.infer<typeof VerifyOTPSchema>
): Promise<AuthResponse> => {
  const validatedFields = VerifyOTPSchema.safeParse(values)

  if (!validatedFields.success) {
    return { success: false, error: 'Invalid fields!' }
  }

  const { otp, email, phone } = validatedFields.data
  const contactInfo = phone ? { phone } : { email }

  try {
    const otpEntry = await client.otp.findFirst({
      where: {
        ...contactInfo,
        isValid: true
      }
    })

    if (!otpEntry) {
      return { success: false, error: 'Invalid OTP or user information!' }
    }

    if (otpEntry.expiredOn <= new Date()) {
      return { success: false, error: 'OTP has expired!' }
    }

    const isMatched = await bcrypt.compare(otp, otpEntry.token)

    if (!isMatched) {
      return { success: false, error: 'Invalid OTP or user information!' }
    }

    const user = await client.user.findFirst({
      where: {
        ...contactInfo
      }
    })

    if (user) {
      if (phone && !user.phoneVerifiedOn) {
        await client.user.update({
          where: {
            ...contactInfo
          },
          data: {
            phoneVerifiedOn: new Date()
          }
        })
      } else if (!phone && !user.emailVerified) {
        await client.user.update({
          where: {
            email
          },
          data: {
            emailVerified: new Date()
          }
        })
      }
    }

    await client.otp.updateMany({
      where: {
        ...contactInfo
      },
      data: {
        isValid: false
      }
    })

    await signIn('verify_otp', {
      phone,
      email,
      otp,
      redirect: false
    })

    return { success: true, message: 'OTP validated successfully' }
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return { success: false, error: 'Something went wrong!' }
  }
}
