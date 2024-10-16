'use server'
import crypto from 'crypto'
import { client } from '@/lib/prismaClient'
import { sendEmail } from '@/utils/sendEmail'
import { emailOTP } from '@/templates/emailOTP'
import { AuthResponse } from '@/types/auth'
import { sendMessage } from './sendMessage'
import { phoneOTP } from '@/templates/phoneOTP'
import { hash } from 'bcryptjs'

interface GenerateOTPParams {
  name: string
  email?: string
  phone?: string
}

/**
 * Sends an OTP to the specified email or phone number.
 *
 * @param {GenerateOTPParams} params - The parameters for OTP generation and sending.
 * @returns {Promise<AuthResponse>} The response indicating the success or failure of the operation.
 */
export const sendOTP = async ({
  name,
  email,
  phone
}: GenerateOTPParams): Promise<AuthResponse> => {
  if (!email && !phone) {
    return { success: false, error: 'Either email or phone must be provided' }
  }

  const token = crypto.randomInt(100_000, 1_000_000).toString()
  const contactInfo = phone ? { phone } : { email }

  const prevOTP = await client.otp.findMany({
    where: contactInfo,
    orderBy: { updatedAt: 'desc' }
  })

  if (prevOTP.length >= 1) {
    const lastSentAt = new Date(prevOTP[0].createdAt).getTime()
    if (Date.now() - lastSentAt <= 120 * 1000) {
      return { success: false, error: 'Already sent!' }
    }
  }

  try {
    await client.otp.updateMany({
      where: contactInfo,
      data: { isValid: false }
    })

    await client.otp.create({
      data: {
        token: await hash(token, 10),
        isValid: true,
        ...contactInfo,
        expiredOn: new Date(Date.now() + 3600 * 1000)
      }
    })

    if (phone) {
      await sendMessage({
        phone,
        message: phoneOTP(token)
      })
    } else if (email) {
      await sendEmail({
        from: {
          email: process.env.NO_REPLY_EMAIL!,
          name: 'noreply'
        },
        to: {
          email,
          name
        },
        subject: 'Your OTP Code',
        htmlbody: emailOTP({ name, otp: token })
      })
    }

    return {
      success: true,
      message: 'OTP sent successfully'
    }
  } catch (error) {
    console.error('Error sending OTP:', error)
    return {
      success: false,
      error: 'Something went wrong while sending OTP.'
    }
  }
}
