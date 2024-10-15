'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { createPayment } from '../actions'

const PayButton = ({
  price,
  bookingId
}: {
  price: string
  bookingId: string
}) => {
  const { pending } = useFormStatus()
  const [response, setResponse] = useState<{
    success: boolean
    message: string
  }>({ success: false, message: '' })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData()
    formData.append('bookingId', bookingId)

    try {
      const result = await createPayment(formData)

      setResponse(result)
    } catch (error) {
      setResponse({ success: false, message: 'Payment failed' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-2">
      <input name="bookingId" type="text" hidden defaultValue={bookingId} />
      <button disabled={pending} type="submit" className="border">
        {pending ? 'Creating ...' : `Pay ${price}`}
      </button>
      {!response?.success && response?.message && <p>{response?.message}</p>}
    </form>
  )
}

export { PayButton }
