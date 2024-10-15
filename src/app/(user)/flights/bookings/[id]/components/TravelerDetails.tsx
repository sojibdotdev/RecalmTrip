'use client'
import React from 'react'
import {
  CreateOrder,
  DuffelPassengerType,
  Offer,
  OfferPassenger
} from '@duffel/api/types'
import { TravelerDetailsForm, FormField } from './TravelerDetailsForm'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const TravelerDetails = ({ offer }: { offer: Offer }) => {
  const user = useSession()
  const router = useRouter()
  console.log(offer)
  console.log(user.data?.user.email)
  const getFormData = (): FormField[] => {
    const passportRequired = offer.passenger_identity_documents_required

    const fields: FormField[] = [
      {
        name: 'title',
        label: 'Title',
        type: 'radio',
        options: [
          { value: 'mr', label: 'Mr.' },
          { value: 'ms', label: 'Ms.' },
          { value: 'mrs', label: 'Mrs.' },
          { value: 'miss', label: 'Miss.' }
        ],
        rules: [{ required: true, message: 'Please select a valid title!' }],
        fullWidth: false,
        order: 1,
        defaultValue: 'mr'
      },
      {
        name: 'gender',
        label: 'Gender',
        type: 'radio',
        options: [
          { value: 'f', label: 'Female' },
          { value: 'm', label: 'Male' }
        ],
        rules: [{ required: true, message: 'Please select passenger gender' }],
        fullWidth: false,
        order: 2,
        defaultValue: 'm'
      },
      {
        name: 'family_name',
        label: 'First name (according to passport)',
        type: 'text',
        rules: [{ required: true, message: 'Please enter your first name' }],
        fullWidth: false,
        order: 3
      },
      {
        name: 'given_name',
        label: 'Last name (according to passport)',
        type: 'text',
        rules: [{ required: true, message: 'Please enter your last name' }],
        fullWidth: false,
        order: 4
      },
      {
        name: 'born_on',
        label: 'Date of birth',
        type: 'date',
        rules: [{ required: true, message: 'Please enter your date of birth' }],
        fullWidth: false,
        order: 5
      },
      {
        name: 'passport_number',
        label: `Passport number${!passportRequired ? ' (optional)' : ''}`,
        type: 'text',
        rules: passportRequired
          ? [{ required: true, message: 'Passport number is required!' }]
          : [],
        fullWidth: false,
        order: 6
      },
      {
        name: 'passport_unique_issuing_country_code',
        label: 'Country (Passport issuing country)',
        type: 'country',
        rules: passportRequired
          ? [
              {
                required: true,
                message: 'Passport issuing country is required!'
              }
            ]
          : [],
        fullWidth: false,
        order: 7,
        defaultValue: 'BD'
      },
      {
        name: 'passport_expires_on',
        label: `Passport expiry date${!passportRequired ? ' (optional)' : ''}`,
        type: 'date',
        rules: passportRequired
          ? [{ required: true, message: 'Passport expiry date is required!' }]
          : [],
        fullWidth: false,
        order: 8
      }
    ]

    return fields
  }

  const handleFinish = async (values: any) => {
    try {
      const createOfferParams = getCreateOfferParams(
        offer,
        values as OfferPassenger
      )
      const params = {
        offer,
        params: createOfferParams
      }
      const res = await axios.post('/api/flight/order/create', params)

      if (res.status === 201) {
        router.replace(`/flights/checkout/${res.data.data.bookingId}`)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="min-w-2xl w-full mx-auto rounded-md">
      <div className="font-medium text-neutral-700 text-xl border-b pb-2 pt-12 mb-8 border-b-neutral-100 flex items-center">
        <div>2.&nbsp;</div>Add traveler(s) information (
        {offer.passengers.length})
      </div>
      <div className="py-2">
        <TravelerDetailsForm
          onFinish={handleFinish}
          fieldsData={[
            ...offer.passengers
              .sort(
                (a, b) =>
                  passengersOrderMap[a.type || 'adult'] -
                  passengersOrderMap[b.type || 'adult']
              )
              .map((passenger, i) => ({
                title: `2.${i + 1}. Traveler - ${
                  i + 1
                } (${passenger.type?.replaceAll('_', ' ')})`,
                data: getFormData(),
                passenger: passenger
              })),
            {
              title: 'Contact',
              passenger: null,
              data: [
                {
                  name: 'email',
                  label: 'Email',
                  type: 'text',
                  rules: [
                    { required: true, message: 'Please input your email!' }
                  ],
                  fullWidth: false,
                  order: 1,
                  defaultValue: user.data?.user.email
                },
                {
                  name: 'phone_number',
                  label: 'Phone',
                  type: 'phone',
                  rules: [
                    {
                      required: true,
                      message: 'Please input your phone number!'
                    },
                    {
                      validator: (_, value) => {
                        if (!value)
                          return Promise.reject(
                            'Please enter a valid phone number!'
                          )
                        const phoneNumber = parsePhoneNumberFromString(
                          value,
                          'BD'
                        )
                        return phoneNumber && phoneNumber.isValid()
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error('Please enter a valid phone number!')
                            )
                      }
                    }
                  ],
                  fullWidth: false,
                  order: 2
                }
              ]
            }
          ]}
        />
      </div>
    </div>
  )
}

export default TravelerDetails

const passengersOrderMap: { [key in DuffelPassengerType]: number } = {
  adult: 1,
  child: 2,
  infant_without_seat: 3
}

const getCreateOfferParams = (offer: Offer, passengers: any): CreateOrder => {
  return {
    type: 'instant',
    passengers,
    selected_offers: [offer.id],
    payments: [
      {
        type: 'balance',
        amount: offer.total_amount,
        currency: offer.total_currency
      }
    ]
  }
}
