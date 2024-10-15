// 'use client'

import { client } from '@/lib/prismaClient'
import { notFound } from 'next/navigation'
import { PayButton } from '../components/PayButton'
import { formatCurrency } from '@/utils/formatCurrency'
import { CreateOrder, Offer } from '@duffel/api/types'

// import { useState } from 'react'
// import axios from 'axios'
// import { useRouter } from 'next/navigation'
// import { useSession } from 'next-auth/react'

// type PaymentProvider = 'BKASH'

// const CheckoutPage = ({ params }: { params: { id: string } }) => {
//   const [error, setError] = useState<string | null>(null)
//   const [loading, setLoading] = useState<boolean>(false)
//   const router = useRouter()
//   const session = useSession()
//   console.log(params.id)

//   const handlePayment = async (provider: PaymentProvider) => {
//     try {
//       setLoading(true)
//       setError(null)

//       if (provider === 'BKASH') {
//       }

//       const params = {
//         mode: '0011',
//         payerReference: session.data?.user.id,
//         callbackURL: 'http://localhost:3000',
//         amount: '500',
//         currency: 'BDT',
//         intent: 'sale',
//         merchantInvoiceNumber: 'Inv0124'
//       }

//       const response = await axios.post('/api/payment/bKash/create',)
//       router.push(response.data.data.bkashURL)
//       console.log('Payment successful:', response.data.data.bkashURL)
//     } catch (error) {
//       console.error('Payment error:', error)
//       setError('Failed to process payment. Please try again.')
//     } finally {
//       setLoading(false)
//     }
//   }
//   const handleBkashPayment = () => {}

//   return (
//     <div>
//       <button onClick={() => handlePayment('BKASH')} disabled={loading}>
//         {loading ? 'Processing...' : 'Pay with bKash'}
//       </button>
//       {error && <p className="text-red-500">{error}</p>}{' '}
//       {/* Error message display */}
//     </div>
//   )
// }

// export default CheckoutPage

type BookingDetails = {
  params: CreateOrder
  details: Offer
}

const CheckoutPage = async ({ params }: { params: { id: string } }) => {
  try {
    const booking = await client.booking.findFirst()

    if (!booking) {
      return notFound()
    }
    const offerDetails =
      booking.providerOfferDetails as unknown as BookingDetails

    return (
      <div>
        <PayButton
          price={formatCurrency(
            Number(offerDetails.details?.total_amount),
            offerDetails.details?.total_currency
          )}
          bookingId={params.id}
        />
      </div>
    )
  } catch (error) {
    console.log('===>', error)
    if (error) throw new Error('Offer not found')
  }
}

export default CheckoutPage

// import { useFormStatus } from 'react-dom'
// import { createMessage } from '@/app/actions'
