'use server'
import * as z from 'zod'
import { ForgotPasswordSchema } from '@/schema'
import { AuthResponse } from '@/types/auth'
import { sendOTP } from '@/utils/sendOTP'
import { client } from '@/lib/prismaClient'

export const forgotPassword = async (
  values: z.infer<typeof ForgotPasswordSchema>
): Promise<AuthResponse> => {
  try {
    const validatedFields = ForgotPasswordSchema.safeParse(values)

    if (!validatedFields.success) {
      return { success: false, error: 'Invalid fields !' }
    }

    const { email, phone } = validatedFields.data
    const contactInfo = phone ? { phone } : { email }
    const user = await client.user.findFirst({
      where: contactInfo
    })
    if (!user) {
      return {
        success: false,
        error: 'No user is associated with this email.'
      }
    }
    await client.account.findMany({
      where: {
        userId: user?.id
      }
    })

    await sendOTP({ email, phone, name: user?.name || '' })

    return { success: true, message: 'OTP sent successfully' }
  } catch (error) {
    console.log('===>', error)
    return { success: true, message: 'Something went wrong' }
  }
}
