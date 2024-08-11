'use client'
import { Controller, useForm } from 'react-hook-form'
import { useEffect, useState, useTransition } from 'react'
import { AuthActionResponse } from '../../../../types/auth'
import { Spinner } from '../../components/Spinner'
import { MdOutlineMarkEmailUnread } from 'react-icons/md'
import OtpInput from './OtpInput'
import { useSession } from 'next-auth/react'
import { verifyEmail } from '../../actions/verify-email'
import { BiErrorCircle, BiSolidHome, BiSolidInfoCircle } from 'react-icons/bi'
import { decrypt } from '../../../utils/cryptUtils'
import { Spin } from 'antd'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { generateToken } from '../../actions/generateToken'
import { sendOTP } from '../../actions/send-otp'
import { useReCaptcha } from '../../hooks'

interface FormData {
  otp: string
}

const EmailVerifyPage = () => {
  const { handleSubmit, control, reset } = useForm<FormData>()
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState<string | null>(null)

  const [result, setResult] = useState<AuthActionResponse>({
    success: false,
    message: '',
    error: ''
  })
  const { data } = useSession()
  const router = useRouter()
  const { verifyReCaptcha } = useReCaptcha()
  const searchParams = useSearchParams()

  const handleResendOTP = async () => {
    reset()
    if (email) {
      startTransition(async () => {
        const isVerified = await verifyReCaptcha('resendOtp')
        if (isVerified) {
          try {
            await sendOTP({
              firstName: data?.user?.name || '',
              email
            })
            setResult({
              success: true,
              message: 'OTP Send successfully'
            })
          } catch (error) {
            if (error) {
              const message =
                (error as { message: string }).message || 'Failed to send OTP'
              setResult({
                success: false,
                error: message
              })
            }
          }
        } else {
          setResult({
            success: true,
            error: 'Failed to verify you are human! Contact us'
          })
        }
      })
    }
  }

  useEffect(() => {
    if (loading) {
      if (data?.user.email) {
        setEmail(data?.user.email)
        setLoading(false)
      } else {
        const fetch = async () => {
          const key = sessionStorage.getItem('key')
          if (typeof key === 'string') {
            try {
              const data = (await decrypt(key)) as {
                email?: string
                scope: 'string'
              }
              if (data?.email) {
                setEmail(data.email)
              } else {
                setEmail(null)
              }
            } catch (error) {
              console.error('Error decrypting:', error)
              setEmail(null)
            }
          } else {
            setEmail(null)
          }
          setLoading(false)
        }
        fetch()
      }
    }
  }, [data?.user, loading])

  const onSubmit = async (data: FormData) => {
    startTransition(async () => {
      if (email) {
        const result = await verifyEmail({
          email,
          otp: data.otp
        })
        setResult(result)
        if (result.success) {
          const key = sessionStorage.getItem('key')
          if (typeof key === 'string') {
            try {
              const data = (await decrypt(key)) as {
                email?: string
                scope: 'REGISTER' | 'FORGOT_PASSWORD'
              }
              if (data?.scope === 'REGISTER') {
                router.replace(searchParams.get('callbackUrl') || '/')
                router.refresh()
              } else {
                const token = await generateToken()
                if (token) {
                  router.push(`/auth/set-password?token=${token}`)
                }
              }
            } catch (error) {
              console.error('Error decrypting:', error)
              setResult({
                success: false,
                error: 'Something went wrong'
              })
            }
          } else {
            setResult({
              success: false,
              error: 'Something went wrong'
            })
          }
          sessionStorage.removeItem('key')
        }
      }
    })
  }
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spin />
      </div>
    )
  }
  if (!email) {
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
        Verify your email
      </h3>
      <div className="flex justify-center mt-12">
        <MdOutlineMarkEmailUnread className="text-primary-400 text-7xl" />
      </div>
      <div className="text-sm py-6 text-neutral-700">
        6 digit code has been sent to{' '}
        <span className="text-green-600">{email}</span> Please enter the code to
        verify your email
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center"
      >
        <Controller
          name="otp"
          control={control}
          render={() => <OtpInput control={control} name="otp" length={6} />}
        />

        <button
          disabled={isPending}
          className="w-full h-11 flex items-center justify-center gap-2 py-2.5 text-neutral-600 text-base font-semibold bg-primary-400 rounded disabled:bg-primary-100 disabled:cursor-not-allowed mt-4"
        >
          {isPending ? <Spinner /> : 'submit'}
        </button>
      </form>
      <button
        onClick={handleResendOTP}
        className="text-xs text-neutral-600 my-4"
      >
        Didn&rsquo;t received an OTP yet ?{' '}
        <span className="text-blue-600">Resend it</span>
      </button>
      {result.error && !isPending && (
        <div className="rounded bg-red-100 text-red-400 text-sm font-normal px-4 py-3 flex items-center justify-between mt-3">
          <div>{result.error}</div>
          <div>{<BiErrorCircle />}</div>
        </div>
      )}
      {result.success && !isPending && (
        <div className="rounded bg-green-100 text-green-400 text-sm font-normal px-4 py-3 flex items-center justify-between mt-3">
          <div>{result.message}</div>
        </div>
      )}
    </div>
  )
}

export default EmailVerifyPage
