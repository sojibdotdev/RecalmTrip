import { duffelClient } from '@/lib/duffelClient'
import { NextRequest, NextResponse } from 'next/server'
import { ApiResponse } from '@/types/api'

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const url = new URL(request.url)
    const after = url.searchParams.get('after')
    const before = url.searchParams.get('before')
    const limit = url.searchParams.get('limit')

    const params: { after?: string; before?: string; limit?: number } = {}
    if (after) params.after = after
    if (before) params.before = before
    if (limit) params.limit = parseInt(limit, 10)

    const offerRequests = await duffelClient.offerRequests.list(params)

    return NextResponse.json<ApiResponse<typeof offerRequests>>(
      {
        success: true,
        data: offerRequests
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching offer requests:', error)
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to fetch offer requests.'
      },
      { status: 500 }
    )
  }
}
