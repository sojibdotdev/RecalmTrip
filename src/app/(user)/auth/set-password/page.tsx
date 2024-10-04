import { auth } from '@/auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { BiSolidHome, BiSolidInfoCircle } from 'react-icons/bi'
import SetPasswordForm from './SetPasswordForm'

const SetPasswordPage = async ({
  searchParams
}: {
  searchParams: { [key: string]: string | undefined }
}) => {
  const authUser = await auth()
  if (!authUser?.user) {
    redirect('/auth/login')
  }
  if (!searchParams.token) {
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
    <div>
      <SetPasswordForm />
    </div>
  )
}

export default SetPasswordPage
