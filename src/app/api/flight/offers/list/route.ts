import { NextResponse } from 'next/server'
import { duffelClient } from '@/lib/duffelClient'

export async function GET(req: Request) {
  console.log(req.method)
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Id is required' }, { status: 400 })
    }

    const response = await duffelClient.offers.list({
      limit: 20,
      offer_request_id: id,
      sort: 'total_amount'
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'An error occurred while fetching offers' },
      { status: 500 }
    )
  }
}
