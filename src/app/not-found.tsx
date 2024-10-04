import { auth } from '@/auth'
import { Header } from '@/components'
import Link from 'next/link'

const NotFound = async () => {
  const session = await auth()
  return (
    <div>
      <Header />
      <div className="container mx-auto mt-32">
        <div className="text-6xl flex items-center justify-center">
          <div className="text-tertiary-500">O</div>
          <div className="text-secondary-500">o</div>
          <div className="text-secondary-500">p</div>
          <div className="text-primary-500">s</div>
        </div>
        <div className="flex items-center flex-col mt-6 text-gray-700 gap-4">
          <div className="text-base">The page you requested not found. :)</div>

          <Link
            href={session?.user?.role === 'ADMIN' ? '/admin' : '/'}
            className="text-secondary-500 border-b border-b-secondary-500"
          >
            Go back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
export default NotFound
