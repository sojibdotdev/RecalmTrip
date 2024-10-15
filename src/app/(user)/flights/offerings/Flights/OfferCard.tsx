import React, { useState } from 'react'
import { FaArrowRight, FaChevronDown, FaChevronUp } from 'react-icons/fa6'
import { Offer } from '@duffel/api/types'
import Image from 'next/image'
import Link from 'next/link'

interface FlightOfferCardProps {
  offer: Offer
}

const FlightOfferCard: React.FC<FlightOfferCardProps> = ({ offer }) => {
  const [showDetails, setShowDetails] = useState(false)
  const {
    total_amount,
    total_currency,
    slices,
    owner,
    passengers,
    conditions,
    payment_requirements
  } = offer

  const toggleDetails = () => setShowDetails(!showDetails)

  const formatDateTime = (dateTimeString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }
    const date = new Date(dateTimeString)
    return date.toLocaleDateString('en-US', options)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-center mb-4">
        <Image
          src={owner?.logo_symbol_url as string}
          alt={`${owner?.name || 'Airline'} logo`}
          className="h-8"
          width={32}
          height={32}
        />
        <span className="font-bold text-lg text-blue-600">
          {total_amount} {total_currency}
        </span>
      </div>
      {slices && slices.length > 0 ? (
        slices.map((slice, index) => (
          <div
            key={slice.id}
            className={`${
              index > 0 ? 'mt-4 pt-4 border-t border-gray-200' : ''
            }`}
          >
            {slice.segments && slice.segments.length > 0 ? (
              slice.segments.map((segment) => (
                <div
                  key={segment.id}
                  className="flex items-center justify-between mb-2"
                >
                  <div className="flex items-center">
                    <div className="text-right mr-3">
                      <p className="font-semibold">
                        {segment.origin?.iata_code || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {segment.departing_at
                          ? formatDateTime(segment.departing_at)
                          : 'N/A'}
                      </p>
                    </div>
                    <FaArrowRight className="text-gray-400 mx-2" />
                    <div className="text-left ml-3">
                      <p className="font-semibold">
                        {segment.destination?.iata_code || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {segment.arriving_at
                          ? formatDateTime(segment.arriving_at)
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                  {/* Airline and Flight Number */}
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {segment.marketing_carrier?.name || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {segment.marketing_carrier_flight_number || 'N/A'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No segment information available</p>
            )}

            <div className="mt-2 flex items-center text-sm text-gray-600">
              <span>{slice.duration || 'Duration not available'} flight</span>
            </div>

            {showDetails && (
              <div className="mt-4">
                <div>
                  <h3 className="font-semibold mb-2">Passenger details:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {passengers.map((passenger) => (
                      <li key={passenger.id}>
                        {passenger.type}: {passenger.given_name || 'N/A'}{' '}
                        {passenger.family_name || 'N/A'}
                      </li>
                    ))}
                  </ul>
                </div>

                {conditions && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Conditions:</h3>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {conditions.change_before_departure && (
                        <li>
                          Change before departure:{' '}
                          {conditions.change_before_departure.allowed
                            ? 'Allowed'
                            : 'Not allowed'}
                        </li>
                      )}
                      {conditions.refund_before_departure && (
                        <li>
                          Refund before departure:{' '}
                          {conditions.refund_before_departure.allowed
                            ? 'Allowed'
                            : 'Not allowed'}
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Payment requirements:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {payment_requirements.payment_required_by && (
                      <li>
                        Payment required by:{' '}
                        {formatDateTime(
                          payment_requirements.payment_required_by
                        )}
                      </li>
                    )}
                    {payment_requirements.price_guarantee_expires_at && (
                      <li>
                        Price guarantee expires at:{' '}
                        {formatDateTime(
                          payment_requirements.price_guarantee_expires_at
                        )}
                      </li>
                    )}
                    <li>
                      Instant payment required:{' '}
                      {payment_requirements.requires_instant_payment
                        ? 'Yes'
                        : 'No'}
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No flight information available</p>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
        <button
          className="text-blue-600 hover:text-blue-800 flex items-center"
          onClick={toggleDetails}
        >
          {showDetails ? 'Hide details' : 'View details'}
          {showDetails ? (
            <FaChevronUp className="h-4 w-4 ml-1" />
          ) : (
            <FaChevronDown className="h-4 w-4 ml-1" />
          )}
        </button>
        <Link
          href={`/flights/bookings/${offer.id}`}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
        >
          Select
        </Link>
      </div>
    </div>
  )
}

interface FlightOfferListProps {
  offers: Offer[]
}

const FlightOfferList: React.FC<FlightOfferListProps> = ({ offers }) => {
  return (
    <div className="container mx-auto">
      {offers && offers.length > 0 ? (
        offers.map((offer) => <FlightOfferCard key={offer.id} offer={offer} />)
      ) : (
        <p className="col-span-2 text-center text-gray-500">
          No flight offers available
        </p>
      )}
    </div>
  )
}

export default FlightOfferList
