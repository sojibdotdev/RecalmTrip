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
    const validatedFields = RegisterSchema.safeParse(values)
    if (!validatedFields.success) {
      return { success: false, error: 'Invalid fields!' }
    }

    const { email, password, firstName, lastName, phone } = validatedFields.data
    const user = await client.user.findFirst({
      where: {
        OR: [{ email }, { phone }]
      }
    })

    if (user) {
      if (user.phone) {
        return { success: false, error: 'Phone number already exists!' }
      } else {
        return { success: false, error: 'Email already in use!' }
      }
    }

    const cratedUser = await client.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        password: await bcrypt.hash(password, 10),
        ...(email && { email }),
        ...(phone && { phone })
      }
    })
    if (cratedUser.phone) {
      await signIn('phone_password', {
        phone,
        password,
        redirect: false
      })
    } else if (cratedUser.email) {
      await signIn('email_password', {
        email,
        password,
        redirect: false
      })
    }

    await sendOTP({
      name: `${values.firstName} ${values.lastName}`,
      email: values.email,
      phone: values.phone
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
