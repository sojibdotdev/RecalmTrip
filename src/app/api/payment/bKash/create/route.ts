import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse } from '@/types/api'
import axios from 'axios'
import { getToken } from '../getToken'
import { client } from '@/lib/prismaClient'

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  if (request.method !== 'POST') {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Method not allowed. Use POST.'
      },
      { status: 405 }
    )
  }

  try {
    const body = await request.json()
    const {
      paymentId,
      mode,
      payerReference,
      callbackURL,
      merchantAssociationInfo,
      amount,
      currency,
      intent,
      merchantInvoiceNumber
    } = body

    if (
      !paymentId ||
      !mode ||
      !payerReference ||
      !callbackURL ||
      !amount ||
      !currency ||
      !intent ||
      !merchantInvoiceNumber
    ) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error:
            'All fields are required: paymentId, mode, payerReference, callbackURL, merchantAssociationInfo, amount, currency, intent, merchantInvoiceNumber.'
        },
        { status: 400 }
      )
    }

    const token = await getToken()
    if (!token || !token.id_token) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Unauthorized access'
        },
        { status: 401 }
      )
    }

    const params = {
      mode,
      payerReference,
      callbackURL,
      amount,
      currency,
      intent,
      merchantInvoiceNumber
    }

    const response = await axios.post(
      `${process.env.BKASH_BASE_URL}/checkout/create`,
      params,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token.id_token,
          'x-app-key': process.env.BKASH_APP_KEY
        }
      }
    )
    console.log(response)
    await client.paymentLogger.create({
      data: {
        paymentId,
        amount: Number(params.amount),
        currency: params.currency,
        details: {
          params,
          response: response.data
        }
      }
    })

    //NextResponse.redirect(response.data.bkashURL)

    return NextResponse.json<ApiResponse<typeof response.data>>(
      {
        success: true,
        data: response.data
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error processing bKash payment:')
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to process payment.'
      },
      { status: 500 }
    )
  }
}
