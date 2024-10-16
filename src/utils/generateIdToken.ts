'use server'
import jwt from 'jsonwebtoken'
import { auth } from '@/auth'
import { client } from '@/lib/prismaClient'
import { decrypt, encrypt } from './encrypt'

const SECRET_KEY = process.env.JWT_SECRET_KEY as string

if (!SECRET_KEY) {
  throw new Error(
    'Missing secret key. Please set the JWT_SECRET_KEY environment variable.'
  )
}

export type TokenType = 'SET_PASSWORD' | 'RESET_PASSWORD'

const generateIdToken = async (
  tokenType: TokenType
): Promise<string | null> => {
  try {
    const session = await auth()
    if (session?.user?.id) {
      const token = jwt.sign(
        {
          id: session.user.id
        },
        SECRET_KEY,
        {
          expiresIn: '1h'
        }
      )
      await client.token.deleteMany({
        where: {
          userId: session.user.id,
          type: tokenType
        }
      })

      await client.token.create({
        data: {
          userId: session.user.id,
          type: tokenType,
          token,
          isValid: true,
          expires: new Date(new Date().getTime() + 3600 * 1000)
        }
      })
      const encryptedIdToken = await encrypt({ token })
      return encryptedIdToken
    }

    return null
  } catch (error) {
    console.error('Error in generating Id Token:', error)
    throw error
  }
}

export { generateIdToken }

export const isTokenValid = async (searchParamToken: string) => {
  const decrypted = (await decrypt(searchParamToken)) as { token: string }
  if (decrypted?.token) {
    const decoded = jwt.verify(
      decrypted?.token,
      process.env.JWT_SECRET_KEY!
    ) as { id: string; iat: number; exp: number }

    const session = await auth()
    if (session?.user.id === decoded?.id) {
      return true
    }

    return false
  }
  return false
}
