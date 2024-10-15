import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse } from '@/types/api'
import { client } from '@/lib/prismaClient'
import { auth } from '@/auth'

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
    const { type, selected_offers, payments, passengers } = body.params
    if (!type || !selected_offers || !payments || !passengers) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error:
            'Users, type, services, selected_offers, payments, and passengers are required.'
        },
        { status: 400 }
      )
    }

    const session = await auth()
    if (!session?.user.id) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false
        },
        { status: 401 }
      )
    }

    const data = await client.booking.create({
      data: {
        userId: session?.user?.id,
        providerOfferId: body.offer.id,
        providerOfferDetails: {
          params: body.params,
          details: body.offer
        },
        provider: 'DUFFEL',
        history: [body]
      }
    })

    return NextResponse.json<ApiResponse<{ bookingId: string }>>(
      {
        success: true,
        data: {
          bookingId: data.id
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to create order.'
      },
      { status: 500 }
    )
  }
}
