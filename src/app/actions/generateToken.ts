'use server'
import jwt from 'jsonwebtoken'
import { auth } from '../../auth'
import { client } from '../../lib/prismaClient'

const SECRET_KEY = process.env.JWT_SECRET_KEY as string

if (!SECRET_KEY) {
  throw new Error(
    'Missing secret key. Please set the JWT_SECRET_KEY environment variable.'
  )
}

const generateToken = async (): Promise<string | null> => {
  try {
    const session = await auth()
    if (session?.user?.id && session?.user.email) {
      const token = jwt.sign(
        {
          id: session.user.id
        },
        SECRET_KEY,
        {
          expiresIn: '1h'
        }
      )

      // Remove previous tokens
      await client.token.deleteMany({
        where: {
          email: session.user.email,
          type: 'PASSWORD_RESET_TOKEN'
        }
      })

      await client.token.create({
        data: {
          email: session.user.email,
          type: 'PASSWORD_RESET_TOKEN',
          token,
          isValid: true,
          expires: new Date(new Date().getTime() + 3600 * 1000)
        }
      })

      return token
    }

    return null
  } catch (error) {
    console.error('Error in generateToken:', error)
    throw error
  }
}

export { generateToken }
