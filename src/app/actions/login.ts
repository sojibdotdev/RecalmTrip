'use server'

import * as z from 'zod'
import { AuthError } from 'next-auth'
import { LoginSchema } from '../../schemas'
import { signIn } from '../../auth'
import { AuthActionResponse } from '../../../types/auth'

export const login = async (
  values: z.infer<typeof LoginSchema>
): Promise<AuthActionResponse> => {
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
