'use server'

import { auth } from '@/auth'
import { duffelClient } from '@/lib/duffelClient'
import { client } from '@/lib/prismaClient'
import { DuffelError } from '@duffel/api'
import axios from 'axios'
import { omit } from 'lodash'
import { redirect } from 'next/navigation'

export const createPayment = async (formData: FormData) => {
  const session = await auth()
  if (!session?.user.id) {
    return {
      success: false,
      message: 'Not authenticated'
    }
  }

  const bookingId = formData.get('bookingId') as string
  if (!bookingId) {
    return {
      success: false,
      message: 'Booking Id not provided'
    }
  }

  const params = await getParams(bookingId, session?.user?.id)

  if (!params.data) {
    return {
      success: false,
      message: params.message
    }
  }

  const token = await getToken()
  if (!token) {
    return {
      success: false,
      message: 'Not authorized'
    }
  }
  const bKashRedirectUrl = await getBKashRedirectUrl(params.data)

  if (bKashRedirectUrl) {
    redirect(bKashRedirectUrl)
    return {
      success: true,
      message: 'Redirecting to bKash'
    }
  } else {
    return {
      success: false,
      message: 'Not authorized'
    }
  }
}

const getToken = async () => {
  try {
    const response = await axios.post(
      `${process.env.BKASH_BASE_URL}/checkout/token/grant`,
      {
        app_key: process.env.BKASH_APP_KEY,
        app_secret: process.env.BKASH_APP_SECRET
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          username: process.env.BKASH_USERNAME,
          password: process.env.BKASH_PASSWORD
        }
      }
    )

    return response.data?.id_token
  } catch (error) {
    console.log(error)
    return null
  }
}

type BKashCreatePaymentParams = {
  mode: string
  payerReference: string
  callbackURL: string
  amount: string
  currency: string
  intent: string
  merchantInvoiceNumber: string
}

const getParams = async (
  bookingId: string,
  userId: string
): Promise<{
  data: null | (BKashCreatePaymentParams & { paymentId: string })
  message: string
  success: boolean
}> => {
  try {
    const booking = await client.booking.findFirst({
      where: { id: bookingId },
      include: {
        payment: true
      }
    })

    if (!booking) {
      return {
        success: false,
        message: 'Booking not found',
        data: null
      }
    }

    const offer = await duffelClient.offers.get(booking.providerOfferId)
    if (!offer) {
      return {
        success: false,
        message: 'Offer not found',
        data: null
      }
    }

    let paymentId = booking.payment?.id
    if (!paymentId) {
      const data = await client.payment.create({
        data: {
          bookingId,
          amount: Number(offer.data.total_amount),
          currency: 'BDT',
          paymentStatus: 'PENDING',
          paymentProvider: 'BKASH'
        }
      })
      paymentId = data.id
    }
    const params: BKashCreatePaymentParams = {
      mode: '0011',
      payerReference: userId,
      callbackURL: `http://localhost:3000/flights/confirmation`,
      amount: offer.data.total_amount,
      currency: 'BDT',
      intent: 'sale',
      merchantInvoiceNumber: `${bookingId}#${offer.data.id}#${paymentId}`
    }

    return {
      success: true,
      message: 'Params successfully generated',
      data: { ...params, paymentId }
    }
  } catch (error) {
    if (error instanceof DuffelError) {
      const offerUnavailableError = error.errors.find(
        (node) => node.code === 'offer_no_longer_available'
      )
      if (offerUnavailableError) {
        return {
          success: false,
          message: offerUnavailableError.message,
          data: null
        }
      }
    }
    console.log('ERROR', error)
    return {
      success: false,
      message: 'Something went wrong',
      data: null
    }
  }
}

const getBKashRedirectUrl = async (
  params: BKashCreatePaymentParams & { paymentId: string }
): Promise<string | null> => {
  try {
    const token = await getToken()
    if (token) {
      const response = await axios.post(
        `${process.env.BKASH_BASE_URL}/checkout/create`,
        omit(params, 'paymentId'),
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: token,
            'x-app-key': process.env.BKASH_APP_KEY
          }
        }
      )

      await client.paymentLogger.create({
        data: {
          paymentId: params.paymentId,
          amount: Number(params.amount),
          currency: params.currency,
          details: {
            params,
            response: response.data
          }
        }
      })
      if (response.data.bkashURL) {
        return response.data.bkashURL
      }
    } else {
      return null
    }
    return null
  } catch (error: any) {
    console.log(error)

    await client.paymentLogger.create({
      data: {
        paymentId: params.paymentId,
        amount: Number(params.amount),
        currency: params.currency,
        details: {
          params,
          error: { status: error.status }
        }
      }
    })
    return null
  }
}
