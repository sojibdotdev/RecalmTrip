import { duffelClient } from '@/lib/duffelClient'
import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse } from '@/types/api'

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
      return_offers,
      supplier_timeout,
      slices,
      private_fares,
      passengers,
      max_connections,
      cabin_class
    } = body

    if (!slices || !passengers || !cabin_class) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Slices, passengers, and cabin class are required.'
        },
        { status: 400 }
      )
    }

    const offerRequest = await duffelClient.offerRequests.create({
      return_offers,
      supplier_timeout,
      slices,
      private_fares,
      passengers,
      max_connections,
      cabin_class
    })

    return NextResponse.json<ApiResponse<typeof offerRequest>>(
      {
        success: true,
        data: offerRequest
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating offer request:', error)
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to create offer request.'
      },
      { status: 500 }
    )
  }
}
