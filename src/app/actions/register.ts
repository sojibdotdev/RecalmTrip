'use server'

import * as z from 'zod'
import { RegisterSchema } from '../../schemas'
import bcrypt from 'bcryptjs'
import { getUserByEmail } from '../../query/user'
import { client } from '../../lib/prismaClient'
import { AuthActionResponse } from '../../../types/auth'
import { sendOTP } from './send-otp'
import { signIn } from '../../auth'
import { AuthError } from 'next-auth'

const register = async (
  values: z.infer<typeof RegisterSchema>
): Promise<AuthActionResponse> => {
  try {
    const validatedFields = RegisterSchema.safeParse(values)
    if (!validatedFields.success) {
      return { success: false, error: 'Invalid fields!' }
    }
    const { email, password, firstName, lastName } = validatedFields.data
    const hashedPassword = await bcrypt.hash(password, 10)

    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return { success: false, error: 'Email already in use!' }
    }

    try {
      await sendOTP({ email, firstName })
    } catch (error) {
      return { success: false, error: 'Failed to send OTP' }
    }

    try {
      await client.user.create({
        data: {
          name: `${firstName} ${lastName}`,
          password: hashedPassword,
          email
        }
      })
      await signIn('email_password', {
        email,
        password,
        redirect: false
      })
      return { success: true, message: 'Logged in successfully' }
    } catch (error) {
      if (error instanceof AuthError) {
        return { success: false, error: 'Invalid credentials!' }
      }
      return { success: false, message: 'Something went wrong !' }
    }
  } catch (error) {
    return {
      success: false,
      error: 'Something went wrong !'
    }
  }
}
export { register }
