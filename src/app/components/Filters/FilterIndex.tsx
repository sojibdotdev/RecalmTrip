import { FilterTabs } from './FilterTabs'
import { FlightIndex } from './Flights'

function FilterIndex() {
  return (
    <div className="w-[90vw] h-auto bg-white rounded-lg left-0 right-0 mx-auto absolute top-3/4 shadow p-6">
      <div>
        <FilterTabs />
      </div>
      <div className=" pt-6">
        <FlightIndex />
      </div>
    </div>
  )
}

export { FilterIndex }
