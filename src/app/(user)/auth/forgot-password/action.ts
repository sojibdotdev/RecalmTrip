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

    const { email } = validatedFields.data
    const user = await client.user.findFirst({
      where: {
        email
      }
    })
    console.log('====>', email, user)

    const provider = await client.account.findMany({
      where: {
        userId: user?.id
      }
    })

    if (!user?.name) {
      return { success: false, error: 'No user is associated with this email.' }
    }
    await sendOTP({ email, name: user.name })

    return { success: true, message: 'OTP sent successfully' }
  } catch (error) {
    console.log('===>', error)
    return { success: true, message: 'Something went wrong' }
  }
}
