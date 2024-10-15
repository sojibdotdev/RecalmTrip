import { duffelClient } from '@/lib/duffelClient'
import { DuffelError } from '@duffel/api'
import { notFound } from 'next/navigation'
import OfferCards from './components/OfferCards'

const FlightsPage = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return notFound()

  try {
    const response = await duffelClient.offers.list({
      limit: 20,
      offer_request_id: params.id,
      sort: 'total_amount'
    })

    return (
      <div>
        <OfferCards offers={response.data} />
      </div>
    )
  } catch (error) {
    console.log(error instanceof DuffelError)
    if (error instanceof DuffelError) {
      if (error.errors.some((err) => err.code.includes('not_found'))) {
        return notFound()
      }
      return <div>Error fetching flights: {error.message}</div>
    }

    return <div>Something went wrong: </div>
  }
}

export default FlightsPage
