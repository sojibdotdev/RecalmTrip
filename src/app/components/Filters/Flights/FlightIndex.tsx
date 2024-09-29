'use client'
import { useState } from 'react'
import { DropDown } from '../../ReuseableComponents'
import { FlightTabs } from './FlightTabs'
import { MultiCitySearchBox } from './MultiCitySearchBox'
import { OneWaySearchBox } from './OneWaySearchBox'
import { RoundTripSearchBox } from './RoundTripSearchBox'

function FlightIndex() {
  const [selectedTab, setSelectedTab] = useState('roundTrip')

  const handleTabChange = (tabName: string) => {
    setSelectedTab(tabName)
    console.log(tabName)
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <FlightTabs handleTabChange={handleTabChange} />
        <DropDown />
      </div>

      <div className="pt-3">
        {selectedTab === 'roundTrip' && <RoundTripSearchBox />}
        {selectedTab === 'oneWay' && <OneWaySearchBox />}
        {selectedTab === 'multiCity' && <MultiCitySearchBox />}
      </div>
    </>
  )
}

export { FlightIndex }
