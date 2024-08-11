'use server'
import crypto from 'crypto'
import { hash } from 'bcryptjs'
import { client } from '../../lib/prismaClient'
import { sendEmail } from '../../utils/sendEmail'
import { otpTemplate } from '../../email-templates/otp-template'
import { OTPAlreadySentError } from '../error/OTPError'

interface GenerateOTPParams {
  firstName: string
  email?: string
  phone?: string
}

export const sendOTP = async ({
  firstName,
  email,
  phone
}: GenerateOTPParams): Promise<void> => {
  if (!email && !phone) {
    throw new Error('Either email or phone must be provided')
  }
  const token = crypto.randomInt(100_000, 1000_000).toString()

  const prevOTP = await client.otp.findMany({
    where: {
      email
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })

  if (prevOTP.length >= 1) {
    const t1 = new Date(prevOTP[0].createdAt).getTime()
    if (new Date().getTime() / 1000 - t1 / 1000 <= 120) {
      throw new OTPAlreadySentError()
    }
  }

  try {
    //Make all the OTP invalid for current user
    await client.otp.updateMany({
      where: {
        email: email
      },
      data: {
        isValid: false
      }
    })
    await client.otp.create({
      data: {
        token: await hash(token, 10),
        isValid: true,
        email: email,
        phone: phone,
        expiredOn: new Date(new Date().getTime() + 3600 * 1000)
      }
    })
    if (email) {
      await sendEmail({
        from: {
          email: '"noreply" <noreply@foysal.dev>',
          name: 'noreply'
        },
        to: {
          email: email,
          name: firstName || ''
        },
        subject: 'OTP',
        htmlbody: otpTemplate({ name: firstName || '', otp: token })
      })
    }
  } catch (error) {
    console.log(error)
    throw new Error('Failed to send OTP')
  }
}
