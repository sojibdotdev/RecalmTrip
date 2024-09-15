import { FaLocationDot } from 'react-icons/fa6'

function FillterSearchBox() {
  return (
    <>
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
    </>
  )
}

export default FillterSearchBox
