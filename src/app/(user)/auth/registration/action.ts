'use server'

import { RegisterSchema } from '@/schema'
import { AuthResponse } from '@/types/auth'
import * as z from 'zod'
import bcrypt from 'bcryptjs'
import { client } from '@/lib/prismaClient'
import { signIn } from '@/auth'
import { sendOTP } from '@/utils/sendOTP'

const registrationAction = async (
  values: z.infer<typeof RegisterSchema>
): Promise<AuthResponse> => {
  try {
    //Sever side input field validation
    const validatedFields = RegisterSchema.safeParse(values)
    if (!validatedFields.success) {
      return { success: false, error: 'Invalid fields!' }
    }

    const { email, password, firstName, lastName } = validatedFields.data

    //Check if user already exists
    const user = await client.user.findFirst({
      where: {
        email
      }
    })
    if (user) {
      return { success: false, error: 'Email already in use!' }
    }

    // If user does not exists create a new user
    await client.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        password: await bcrypt.hash(password, 10),
        email
      }
    })
    await signIn('email_password', {
      email,
      password,
      redirect: false
    })
    await sendOTP({
      name: `${values.firstName} ${values.lastName}`,
      email: values.email
    })
    return { success: true, message: 'Registered' }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      error: 'Something went wrong !'
    }
  }
}
export { registrationAction }
