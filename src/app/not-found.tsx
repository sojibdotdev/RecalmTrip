import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa6'

const NotFound = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <div className="text-5xl text-center mb-2 text-gray-800 font-extrabold">
          404
        </div>
        <div className="text-center text-lg text-neutral-500">
          Opps page not found !
        </div>
        <Link
          href="/"
          className="text-neutral-600  mt-8 text-base  flex items-center gap-2 rounded-sm px-4 py-2"
        >
          <FaArrowLeft className="text-neutral-900" />
          Home page
        </Link>
      </div>
    </div>
  )
}

export default NotFound
