import { FaCalendarDays, FaUserLarge } from 'react-icons/fa6'
import { HiMiniArrowsRightLeft } from 'react-icons/hi2'
import { FilterSearchBox } from '../../ReuseableComponents'

function RoundTripSearchBox() {
  return (
    <>
      {/* input fields  */}
      <section className="grid grid-cols-[1fr_1fr_auto] content-center gap-3 justify-center items-center leading-none">
        <div className="w-full flex gap-4 items-center relative">
          <FilterSearchBox />
          <div className="before:content-[''] absolute right-0 left-0 mx-auto max-w-max bg-white text-gray-400 border-[1.5px] border-[#b9bac3] rounded-full p-2">
            <HiMiniArrowsRightLeft />
          </div>
          <FilterSearchBox />
        </div>
        <div className="flex w-full items-center gap-3 relative">
          <div className=" w-full h-12 flex items-center gap-4 border-[1.5px] overflow-hidden border-[#b9bac3] rounded-lg pr-3 py-1">
            <div className="text-primary-600 border-r-[1.5px] py-1 px-2 border-[#b9bac3]">
              <FaCalendarDays />
            </div>
            <div>
              <span className="text-xs font-medium">Dates</span>
              <p className=" text-gray-600 text-sm">Sep 20 - Sep 28</p>
            </div>
          </div>
          <div className=" w-full h-12 flex items-center gap-4 border-[1.5px] relative overflow-hidden border-[#b9bac3] rounded-lg pr-3 py-1">
            <div className="text-primary-600 border-r-[1.5px] py-1 px-2 border-[#b9bac3]">
              <FaUserLarge />
            </div>
            <div>
              <span className=" text-xs font-medium">Travelers</span>
              <p className="text-sm text-gray-600">2 Travelers</p>
            </div>
            {/* <div className=" absolute w-20 h-40 bg-white z-50 top-2 ">
              this dropdown
            </div> */}
          </div>
        </div>
        <div className=" bg-primary-600 text-white rounded-full px-4 leading-none py-3 cursor-pointer">
          Search
        </div>
      </section>
    </>
  )
}

export { RoundTripSearchBox }
