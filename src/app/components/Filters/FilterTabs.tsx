import Umrah from '../../../../public/images/Fillter//Umrah.svg'
import Flight from '../../../../public/images/Fillter/flight.svg'
import Hotel from '../../../../public/images/Fillter/Hotel.svg'
import Tour from '../../../../public/images/Fillter/Tour.svg'
import Visa from '../../../../public/images/Fillter/Visa.svg'
import { Tab } from '../ReuseableComponents'

function FilterTabs() {
  const tabItems = [
    {
      id: 1,
      key: 'Flight',
      label: 'Flight',
      icon: Flight.src
    },
    {
      id: 2,
      key: 'Stays',
      label: 'Stays',
      icon: Hotel.src
    },
    {
      id: 3,
      key: 'Tour',
      label: 'Tour',
      icon: Tour.src
    },
    {
      id: 4,
      key: 'Umrah',
      label: 'Umrah',
      icon: Umrah.src
    },
    {
      id: 5,
      key: 'Visa',
      label: 'Visa',
      icon: Visa.src
    }
  ]

  return (
    <div>
      <Tab tabItems={tabItems} />
    </div>
  )
}

export { FilterTabs }
