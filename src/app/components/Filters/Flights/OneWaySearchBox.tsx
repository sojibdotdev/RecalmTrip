import { FaCalendarDays, FaUserLarge } from 'react-icons/fa6'
import { HiMiniArrowsRightLeft } from 'react-icons/hi2'
import { FilterSearchBox } from '../../ReuseableComponents'

function OneWaySearchBox() {
  return (
    <>
      <section className="w-full flex gap-2  items-center leading-none">
        <div className="w-[46%] flex gap-4 items-center relative">
          <div className=" before:content-[''] absolute right-0 left-0 mx-auto max-w-max bg-white text-gray-400 border-[1.5px] border-[#b9bac3] rounded-full p-2">
            <HiMiniArrowsRightLeft />
          </div>
          <FilterSearchBox />
          <FilterSearchBox />
        </div>
        <div className=" w-[23%] h-12 flex items-center gap-4 border-[1.5px] border-[#b9bac3] rounded-lg pr-3 py-1">
          <div className="text-primary-600 border-r-[1.5px] py-1 px-2 border-[#b9bac3]">
            <FaCalendarDays />
          </div>
          <div>
            <span className="text-xs font-medium">Dates</span>
            <p className=" text-gray-600 text-sm">Sep 28</p>
          </div>
        </div>
        <div className=" w-[23%] h-12 flex items-center gap-4 border-[1.5px] border-[#b9bac3] rounded-lg pr-3 py-1">
          <div className="text-primary-600 border-r-[1.5px] py-1 px-2 border-[#b9bac3]">
            <FaUserLarge />
          </div>
          <div>
            <span className=" text-xs font-medium">Travelers</span>
            <p className="text-sm text-gray-600">2 Travelers</p>
          </div>
        </div>
        <div className=" bg-primary-600 text-white rounded-full px-4 leading-none py-3 cursor-pointer">
          Search
        </div>
      </section>
    </>
  )
}

export { OneWaySearchBox }
