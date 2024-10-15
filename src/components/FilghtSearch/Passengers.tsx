import React, { useState } from 'react'
import { Button, Dropdown, MenuProps } from 'antd'
import {
  CreateOfferRequestPassenger,
  DuffelPassengerType
} from '@duffel/api/types'
import { BiChevronDown, BiMinus, BiPlus } from 'react-icons/bi'
import { BsPeopleFill } from 'react-icons/bs'

interface PassengersProps {
  onPassengerChange: (passengers: CreateOfferRequestPassenger[]) => void
}

const Passengers: React.FC<PassengersProps> = ({ onPassengerChange }) => {
  const [passengerCounts, setPassengerCounts] = useState<
    Record<DuffelPassengerType, number>
  >({
    adult: 1,
    child: 0,
    infant_without_seat: 0
  })

  const [visible, setVisible] = useState(false)

  const totalPassengers =
    passengerCounts.adult +
    passengerCounts.child +
    passengerCounts.infant_without_seat

  const updatePassengerCounts = (type: DuffelPassengerType, change: number) => {
    // Calculate new total if we apply the change
    const newCount = passengerCounts[type] + change

    // Check if newCount is valid and won't exceed the total limit
    if (newCount < 0) return // Prevent decrementing below zero
    if (change > 0 && totalPassengers >= 9) return // Prevent incrementing if total is 9 or more

    setPassengerCounts((prevCounts) => {
      const updatedCounts = { ...prevCounts, [type]: newCount }
      const newPassengers = [
        ...Array(updatedCounts.adult).fill({ type: 'adult' }),
        ...Array(updatedCounts.child).fill({ type: 'child' }),
        ...Array(updatedCounts.infant_without_seat).fill({
          type: 'infant_without_seat'
        })
      ]

      onPassengerChange(newPassengers)
      return updatedCounts
    })
  }

  const handleOkClick = () => {
    setVisible(false)
  }

  const createMenuItems = (): MenuProps['items'] => {
    const types: DuffelPassengerType[] = [
      'adult',
      'child',
      'infant_without_seat'
    ]

    const items: MenuProps['items'] = types.map((type) => ({
      key: type,
      label: (
        <div className="flex items-center justify-between">
          <span className="capitalize text-neutral-500 text-xs mr-3">
            {type === 'infant_without_seat'
              ? 'Infant (0-2)'
              : type.replace('_', ' ')}{' '}
            {type === 'adult' ? '(18+)' : type === 'child' ? '(2-12)' : ''}
          </span>
          <div className="flex items-center gap-2">
            <Button
              onClick={(e) => {
                e.stopPropagation()
                updatePassengerCounts(type, -1)
              }}
              disabled={passengerCounts[type] === 0}
              size="small"
              shape="circle"
              type="text"
              className="min-w-8"
            >
              <BiMinus />
            </Button>
            <div className="min-w-5 font-semibold">{passengerCounts[type]}</div>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                updatePassengerCounts(type, 1)
              }}
              size="small"
              shape="circle"
              disabled={passengerCounts[type] === 9 || totalPassengers >= 9}
              type="text"
              className="min-w-8"
            >
              <BiPlus />
            </Button>
          </div>
        </div>
      )
    }))

    items.push({ type: 'divider' })
    items.push({
      key: 'ok-button',
      label: (
        <Button type="primary" block onClick={handleOkClick}>
          Okay
        </Button>
      )
    })

    return items
  }

  return (
    <div className="flex items-center">
      <Dropdown
        menu={{ items: createMenuItems() }}
        trigger={['click']}
        open={visible}
        onOpenChange={setVisible}
        className="border-none"
      >
        <button className="flex items-center font-semibold text-sm gap-2">
          <BsPeopleFill />
          <span>
            {totalPassengers} Passenger
            {totalPassengers !== 1 ? 's' : ''}
          </span>
          <BiChevronDown className="ml-2 text-neutral-400 text-2xl" />
        </button>
      </Dropdown>
    </div>
  )
}

export { Passengers }
