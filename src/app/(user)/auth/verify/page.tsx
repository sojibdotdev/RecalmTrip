import { decrypt } from '@/utils/encrypt'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { BiSolidHome, BiSolidInfoCircle } from 'react-icons/bi'
import { MdOutlineMarkEmailUnread } from 'react-icons/md'
import { VerifyOTPForm } from './VerifyForm'

const VerifyPage = async ({
  searchParams
}: {
  searchParams: { [key: string]: string | undefined }
}) => {
  if (!searchParams.token) {
    redirect('/auth/login')
  }

  const token = decodeURIComponent(searchParams.token)

  let decoded
  try {
    decoded = (await decrypt(token)) as {
      phone: string
      email: string
      name: string
    }
  } catch (error) {
    console.error('Decryption failed:', error)
    return (
      <div className="flex items-center flex-col gap-8 justify-center h-full px-14">
        <BiSolidInfoCircle className="text-red-500 text-5xl" />
        <div className="text-sm text-center text-neutral-700">
          Something went wrong. Please make sure you have access to this page.
        </div>
        <Link
          className="text-blue-600 flex items-center gap-1 text-sm"
          href="/"
        >
          <BiSolidHome /> Home
        </Link>
      </div>
    )
  }

  if (!decoded || (!decoded.email && !decoded.phone)) {
    return (
      <div className="flex items-center flex-col gap-8 justify-center h-full px-14">
        <BiSolidInfoCircle className="text-red-500 text-5xl" />
        <div className="text-sm text-center text-neutral-700">
          Something went wrong. Please make sure you have access to this page.
        </div>
        <Link
          className="text-blue-600 flex items-center gap-1 text-sm"
          href="/"
        >
          <BiSolidHome /> Home
        </Link>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h3 className="text-xl font-bold mb-4 text-center flex items-center justify-center gap-2">
        Verify your {decoded.phone ? 'Phone number' : 'Email'}
      </h3>
      <div className="flex justify-center mt-12">
        <MdOutlineMarkEmailUnread className="text-primary-400 text-7xl" />
      </div>

      <div className="text-sm py-6 text-neutral-700">
        6 digit code has been sent to{' '}
        <span className="text-green-600">
          {decoded.phone ? decoded.phone : decoded.email}
        </span>{' '}
        Please enter the code to verify your{' '}
        {decoded.phone ? 'Phone number' : 'Email'}
      </div>
      <VerifyOTPForm
        name={decoded.name || ''}
        phone={decoded.phone}
        email={decoded.email}
      />
    </div>
  )
}

export default VerifyPage
