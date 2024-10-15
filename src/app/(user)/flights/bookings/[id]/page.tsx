import { duffelClient } from '@/lib/duffelClient'
import FlightTicket from './components/FlightTicket'
import BillingDetails from './components/BillingDetails'
import TravelerDetails from './components/TravelerDetails'

const FlightBookingPage = async ({ params }: { params: { id: string } }) => {
  try {
    const res = await duffelClient.offers.get(params.id)
    return (
      <div className="flex items-start gap-5 max-w-screen-xl mx-auto p-4">
        <div className="space-y-4 w-full">
          <div>
            <div>
              <div className="font-medium text-neutral-700 text-xl border-b pb-2 mb-8  border-b-neutral-100 flex items-center">
                <div>1. &nbsp;</div> Review you flight
              </div>
            </div>
            <FlightTicket offer={res.data} />
          </div>
          <TravelerDetails offer={res.data} />
        </div>
        <BillingDetails offer={res.data} />
      </div>
    )
  } catch (error) {
    console.log(error)
    if (error) throw new Error('Offer not found')
  }
}
export default FlightBookingPage
