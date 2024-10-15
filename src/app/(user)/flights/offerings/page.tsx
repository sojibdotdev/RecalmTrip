'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import FlightOfferList from './Flights/OfferCard'
import { Offer } from '@duffel/api/types'

const FlightsPage = () => {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('id')

  const [offers, setOffers] = useState<{
    loading: boolean
    error: Error | null
    data: Offer[] | null
  }>({
    loading: false,
    error: null,
    data: null
  })

  useEffect(() => {
    ;(async () => {
      if (orderId) {
        setOffers((prev) => ({ ...prev, loading: true, error: null }))
        try {
          const response = await axios.get(
            `/api/flight/offers/list?id=${orderId}`
          )
          console.log(response)
          if (response.data) {
            setOffers({
              loading: false,
              error: null,
              data: response.data.data
            })
          }
        } catch (error) {
          setOffers({
            loading: false,
            error:
              error instanceof Error ? error : new Error('An error occurred'),
            data: null
          })
        }
      } else {
        setOffers({
          loading: false,
          error: null,
          data: null
        })
      }
    })()
  }, [orderId])

  if (offers.loading) {
    return <p>Loading...</p>
  }

  if (offers.error) {
    return <p>Error: {offers.error.message}</p>
  }

  if (offers.data) {
    return (
      <div>
        <FlightOfferList offers={offers.data} />
      </div>
    )
  }

  return <p>No offers available</p>
}

export default FlightsPage
