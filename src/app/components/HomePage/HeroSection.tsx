'use client'

import { FaCalendarDays, FaLocationDot, FaUserLarge } from 'react-icons/fa6'
import { HiMiniArrowsRightLeft } from 'react-icons/hi2'
import FillterTabs from '../Filters/FillterTabs'
import FlightTabs from '../Filters/Flights/FlightTabs'
import DropDown from '../ReuseableComponents/DropDown'

function HeroSeaction() {
  return (
    <div className=" bg-[url('https://scontent.fdac20-1.fna.fbcdn.net/v/t39.30808-6/407424918_257961673953967_1245350113519659552_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=86c6b0&_nc_ohc=4fuMrtmp8DQQ7kNvgEbKJD2&_nc_ht=scontent.fdac20-1.fna&oh=00_AYAW8Hk8Bdqfzs2td__G4y4guQ5EtHH6YhbtrQpW-YqIng&oe=66E328E5')] bg-cover bg-no-repeat bg-bottom h-[60vh] w-full rounded-lg  mx-auto relative">
      <div className="w-[90vw] bg-white rounded-lg left-0 right-0 mx-auto px-5 absolute -bottom-1/4 shadow-md py-8">
        <div className="">
          <FillterTabs />
        </div>
        <div>
          <div className=" flex items-center gap-3">
            <FlightTabs />
            <div>
              <DropDown />
            </div>
          </div>
          <div className=" w-full">
            {/* input fields  */}
            <div className="w-full flex gap-2 pt-5 items-center leading-none">
              <div className="w-[46%] flex gap-4 items-center relative">
                <div className=" before:content-[''] absolute right-0 left-0 mx-auto max-w-max bg-white text-gray-400 border-[1.5px] border-gray-300 rounded-full p-2">
                  <HiMiniArrowsRightLeft />
                </div>
                <div className=" w-full flex items-center gap-2 border-[1.5px] pr-2 border-gray-300 rounded-lg py-1">
                  <div className="text-primary-600 border-r-[1.5px] py-1 px-2 border-gray-300">
                    <FaLocationDot />
                  </div>

                  <div>
                    <span className=" text-xs">From</span>
                    <p className=" text-xs text-gray-500 truncate">
                      <span>Bangladesh, Hazrat Shahjalal...</span>
                    </p>
                  </div>
                </div>
                <div className=" w-full flex items-center gap-2 border-[1.5px] pr-2 border-gray-300 rounded-lg py-1">
                  <div className="text-primary-600 border-r-[1.5px] py-1 px-2 border-gray-300">
                    <FaLocationDot />
                  </div>
                  <div>
                    <span className=" text-xs">To</span>
                    <p className=" text-xs text-gray-500 truncate">
                      <span>Bangladesh, Cox's Bazar Ai...</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className=" w-[23%] flex items-center gap-4 border-[1.5px] border-gray-300 rounded-lg pr-3 py-1">
                <div className="text-primary-600 border-r-[1.5px] py-1 px-2 border-gray-300">
                  <FaCalendarDays />
                </div>
                <div>
                  <span className="text-xs">Dates</span>
                  <p>Sep 20 - Sep 28</p>
                </div>
              </div>
              <div className=" w-[23%]  flex items-center gap-4 border-[1.5px] border-gray-300 rounded-lg pr-3 py-1">
                <div className="text-primary-600 border-r-[1.5px] py-1 px-2 border-gray-300">
                  <FaUserLarge />
                </div>
                <div>
                  <span className=" text-xs">Travelers</span>
                  <p>2 Travelers</p>
                </div>
              </div>
              <div className=" bg-primary-600 text-white rounded-full px-4 leading-none py-3 cursor-pointer">
                Search
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSeaction
