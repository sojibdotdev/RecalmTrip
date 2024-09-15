import { useState } from 'react'

function FlightTabs() {
  const [selectedTab, setSelectedTab] = useState('roundTrip') // Default selected tab

  const handleTabClick = (tabName: string) => {
    setSelectedTab(tabName) // Update the selected tab when clicked
  }

  return (
    <div className="flex items-center gap-3">
      {/* Round Trip Tab */}
      <div
        onClick={() => handleTabClick('roundTrip')}
        className={`p-[10px] rounded flex items-center gap-2 cursor-pointer ${
          selectedTab === 'roundTrip' ? 'bg-primary-600' : 'bg-gray-200'
        }`}
      >
        <div
          className={`h-4 w-4 border-[1.5px] rounded-full flex items-center justify-center ${
            selectedTab === 'roundTrip' ? 'border-white' : 'border-gray-400'
          }`}
        >
          {selectedTab === 'roundTrip' && (
            <span className="h-2 w-2 bg-white rounded-full"></span>
          )}
        </div>
        <div
          className={`${
            selectedTab === 'roundTrip' ? 'text-white' : 'text-gray-600'
          } text-xs mt-[3px] font-medium`}
        >
          Round Trip
        </div>
      </div>

      {/* One Way Tab */}
      <div
        onClick={() => handleTabClick('oneWay')}
        className={`p-[10px] rounded flex items-center gap-2 cursor-pointer ${
          selectedTab === 'oneWay' ? 'bg-primary-600' : 'bg-gray-200'
        }`}
      >
        <div
          className={`h-4 w-4 border-[1.5px] rounded-full flex items-center justify-center ${
            selectedTab === 'oneWay' ? 'border-white' : 'border-gray-400'
          }`}
        >
          {selectedTab === 'oneWay' && (
            <span className="h-2 w-2 bg-white rounded-full"></span>
          )}
        </div>
        <div
          className={`${
            selectedTab === 'oneWay' ? 'text-white' : 'text-gray-600'
          } text-xs mt-[3px] font-medium`}
        >
          One Way
        </div>
      </div>

      {/* Multi City Tab */}
      <div
        onClick={() => handleTabClick('multiCity')}
        className={`p-[10px] rounded flex items-center gap-2 cursor-pointer ${
          selectedTab === 'multiCity' ? 'bg-primary-600' : 'bg-gray-200'
        }`}
      >
        <div
          className={`h-4 w-4 border-[1.5px] rounded-full flex items-center justify-center ${
            selectedTab === 'multiCity' ? 'border-white' : 'border-gray-400'
          }`}
        >
          {selectedTab === 'multiCity' && (
            <span className="h-2 w-2 bg-white rounded-full"></span>
          )}
        </div>
        <div
          className={`${
            selectedTab === 'multiCity' ? 'text-white' : 'text-gray-600'
          } text-xs mt-[3px] font-medium`}
        >
          Multi City
        </div>
      </div>
    </div>
  )
}

export default FlightTabs
