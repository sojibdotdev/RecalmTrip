'use server'

import * as z from 'zod'
import { AuthError } from 'next-auth'
import { LoginSchema } from '@/schema'
import { signIn } from '@/auth'
import { AuthResponse } from '@/types/auth'

export const login = async (
  values: z.infer<typeof LoginSchema>
): Promise<AuthResponse> => {
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) {
    return { success: false, error: 'Invalid fields !' }
  }

  const { email, password } = validatedFields.data

  try {
    await signIn('email_password', {
      email,
      password,
      redirect: false
    })

    return { success: true, message: 'Logged in success fully' }
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: 'Invalid credentials!' }
    }
    return { success: false, message: 'Something went wrong !' }
  }
}
