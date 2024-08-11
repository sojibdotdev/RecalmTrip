import NextAuth, { Session, User } from 'next-auth'
import Github from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { UserRole } from '@prisma/client'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { client } from './lib/prismaClient'
import { LoginSchema, VerifyEmailSchema } from './schemas'
import { getUserByEmail, getUserById } from './query/user'
import bcrypt from 'bcryptjs'

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error'
  },
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole
        session.user.emailVerified =
          token.emailVerified as Session['user']['emailVerified']
        session.user.provider = token.provider as Session['user']['provider']
      }

      return session
    },
    async jwt({ token }) {
      if (!token.sub) return token
      if (token.sub) {
        const user = await getUserById(token.sub)
        if (user) {
          const provider = await client.account.findFirst({
            where: {
              user: {
                email: user.email
              }
            }
          })
          token.name = user.name
          token.role = user.role
          token.email = user.email
          token.emailVerified = user.emailVerified
          if (provider) {
            token.provider = provider.provider
          }
        }
      }
      return token
    }
  },
  debug: process.env.NODE_ENV === 'development' || false,
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true
    }),
    Credentials({
      id: 'email_password',
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials)
        if (validatedFields.success) {
          const { email, password } = validatedFields.data
          const user = await getUserByEmail(email)

          if (!user || !user.password) return null
          const passwordsMatch = await bcrypt.compare(password, user.password)
          if (passwordsMatch) return user
          return null
        }
        return null
      }
    }),
    Credentials({
      id: 'email_otp',
      async authorize(credentials) {
        const validatedFields = VerifyEmailSchema.safeParse(credentials)
        if (validatedFields.success) {
          const { email, otp } = validatedFields.data
          const userOtp = await client.otp.findFirst({
            where: {
              email,
              isValid: true
            }
          })

          if (!userOtp || !userOtp.token) return null
          const isMatched = await bcrypt.compare(otp, userOtp.token)
          if (isMatched) {
            const user = getUserByEmail(email)
            return user
          }
          return null
        }
        return null
      }
    })
  ],
  adapter: PrismaAdapter(client),
  session: { strategy: 'jwt' }
})
