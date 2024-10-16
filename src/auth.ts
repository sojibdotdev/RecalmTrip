import NextAuth, { Session, User, NextAuthConfig } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'

import Credentials from 'next-auth/providers/credentials'
import { UserRole } from '@prisma/client'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { client } from './lib/prismaClient'
import { LoginSchema, VerifyEmailSchema, VerifyOTPSchema } from '@/schema'
import { getUserByEmail, getUserById, getUserByPhone } from '@/query/user'
import bcrypt from 'bcryptjs'

const authConfig: NextAuthConfig = {
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
          token.phone = user.phone
          token.emailVerified = user.emailVerified
          token.phoneVerifiedOn = user.phoneVerifiedOn
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
    FacebookProvider({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
      allowDangerousEmailAccountLinking: true
    }),
    Credentials({
      id: 'email_password',
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials)
        if (validatedFields.success) {
          const { email, password } = validatedFields.data
          if (email) {
            const user = await getUserByEmail(email)
            if (!user || !user.password) return null
            const passwordsMatch = await bcrypt.compare(password, user.password)
            if (passwordsMatch) return user
          }

          return null
        }
        return null
      }
    }),
    Credentials({
      id: 'phone_password',
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials)
        if (validatedFields.success) {
          const { phone, password } = validatedFields.data
          if (phone) {
            const user = await getUserByPhone(phone)
            if (!user || !user.password) return null
            const passwordsMatch = await bcrypt.compare(password, user.password)
            if (passwordsMatch) return user
          }
          return null
        }
        return null
      }
    }),
    Credentials({
      id: 'verify_otp',
      async authorize(credentials) {
        const validatedFields = VerifyOTPSchema.safeParse(credentials)
        if (validatedFields.success) {
          const { email, phone } = validatedFields.data
          const user = phone
            ? await getUserByPhone(phone)
            : email
            ? await getUserByEmail(email)
            : null
          if (user) {
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
}

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig)
