import { duffelClient } from '@/lib/duffelClient'
import { client } from '@/lib/prismaClient'
import { getToken } from '@/utils/getToken'
import { CreateOrder } from '@duffel/api/types'
import axios from 'axios'

const OrderConfirmation = async ({ searchParams }: any) => {
  try {
    const bkashPaymentId = searchParams.paymentID
    if (!bkashPaymentId) {
      throw new Error('Payment Id not found')
    }
    const token = await getToken()
    if (!token) {
      throw new Error('Something went wrong while generating token')
    }
    const { data } = await axios.post(
      `${process.env.BKASH_BASE_URL}/checkout/execute`,
      { paymentID: bkashPaymentId },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token,
          'x-app-key': process.env.BKASH_APP_KEY
        }
      }
    )

    if (data.transactionStatus === 'Completed') {
      const [bookingId, providerOfferId, paymentId] =
        data.merchantInvoiceNumber.split('#')
      // Payment successful
      await client.payment.update({
        where: {
          id: paymentId
        },
        data: {
          paymentStatus: 'COMPLETED'
        }
      })

      //Booking flight
      const booking = await client.booking.findFirst({
        where: {
          id: bookingId
        },
        include: {
          payment: true
        }
      })
      if (booking) {
        const response = await duffelClient.orders.create(
          (booking.providerOfferDetails as unknown as { params: CreateOrder })
            .params
        )
        if (response.data.id) {
          await client.booking.update({
            where: {
              id: bookingId
            },
            data: {
              bookingSataus: 'COMPLETED'
            }
          })
        } else {
          await client.booking.update({
            where: {
              id: bookingId
            },
            data: {
              bookingSataus: 'COMPLETED'
            }
          })
        }
      }
    }

    return <div>hello</div>
  } catch (error) {
    throw new Error('Something went wrong')
  }
}

export default OrderConfirmation
