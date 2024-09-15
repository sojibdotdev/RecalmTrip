import Umrah from '../../../../public/images/Fillter//Umrah.svg'
import Flight from '../../../../public/images/Fillter/flight.svg'
import Hotel from '../../../../public/images/Fillter/Hotel.svg'
import Tour from '../../../../public/images/Fillter/Tour.svg'
import Visa from '../../../../public/images/Fillter/Visa.svg'
import Tab from '../ReuseableComponents/Tab'

function FillterTabs() {
  const tabItems = [
    {
      id: 1,
      value: 'Flight',
      name: 'Flight',
      icon: Flight.src
    },
    {
      id: 2,
      value: 'Stays',
      name: 'Stays',
      icon: Hotel.src
    },
    {
      id: 3,
      value: 'Tour',
      name: 'Tour',
      icon: Tour.src
    },
    {
      id: 4,
      value: 'Umrah',
      name: 'Umrah',
      icon: Umrah.src
    },
    {
      id: 5,
      value: 'Visa',
      name: 'Visa',
      icon: Visa.src
    }
  ]

  return (
    <div className="mb-6">
      <Tab tabItems={tabItems} />
    </div>
  )
}

export default FillterTabs
