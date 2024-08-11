'use server'
import * as z from 'zod'
import { ForgotPasswordSchema } from '../../schemas'
import { AuthActionResponse } from '../../../types/auth'
import { sendOTP } from './send-otp'
import { client } from '../../lib/prismaClient'
import { OTPAlreadySentError } from '../error/OTPError'

export const forgotPassword = async (
  values: z.infer<typeof ForgotPasswordSchema>
): Promise<AuthActionResponse> => {
  const validatedFields = ForgotPasswordSchema.safeParse(values)

  if (!validatedFields.success) {
    return { success: false, error: 'Invalid fields !' }
  }

  const { email } = validatedFields.data
  const user = await client.user.findFirst({
    where: {
      email
    }
  })

  const provider = await client.account.findMany({
    where: {
      userId: user?.id
    }
  })

  if (user?.name && !provider.length) {
    try {
      await sendOTP({ email, firstName: user.name })
      return { success: true, message: 'OTP sent successfully' }
    } catch (error) {
      if (error instanceof OTPAlreadySentError) {
        return {
          success: false,
          error: error.message
        }
      }
      return { success: false, error: 'Failed to send OTP' }
    }
  } else {
    return { success: false, error: 'No user is associated with this email.' }
  }
}
