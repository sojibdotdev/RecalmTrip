'use client'
import { Controller, useForm } from 'react-hook-form'
import { useState, useTransition } from 'react'
import { AuthResponse } from '@/types/auth'
import { Spinner } from '@/components/Spinner'
import OtpInput from './OTPInput'
import { verifyEmail } from './actions/verifyEmail'
import { BiErrorCircle } from 'react-icons/bi'
import { redirect } from 'next/navigation'
import { sendOTP } from './actions/sendOTP'
import { useReCaptcha } from '@/hooks/useRecaptcha'
import { generateToken } from './actions/generateToken'
import { decrypt } from '@/utils/encrypt'

interface FormData {
  otp: string
}
//TODO: RESET INPUT FIELD AFTER SUBMIT
const VerifyOTPForm = ({ email, name }: { email: string; name: string }) => {
  const { handleSubmit, control, reset } = useForm<FormData>({
    defaultValues: {
      otp: ''
    }
  })
  const [isPending, startTransition] = useTransition()

  const [result, setResult] = useState<AuthResponse>({
    success: false,
    message: '',
    error: ''
  })

  const { verifyReCaptcha } = useReCaptcha()

  const handleResendOTP = async () => {
    reset()
    if (email) {
      startTransition(async () => {
        const isVerified = await verifyReCaptcha('resendOtp')
        if (isVerified) {
          const result = await sendOTP({
            name,
            email
          })
          setResult(result)
        }
      })
    }
  }

  const onSubmit = async (data: FormData) => {
    startTransition(async () => {
      if (email) {
        const result = await verifyEmail({
          email,
          otp: data.otp
        })
        setResult(result)
        if (result.success) {
          const token = (await generateToken()) as string
          console.log(await decrypt(token))
          redirect(`/auth/set-password?token=${encodeURIComponent(token)}`)
        }
      }
    })
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center"
      >
        <Controller
          name="otp"
          control={control}
          render={({ field }) => (
            <OtpInput {...field} control={control} name="otp" length={6} />
          )}
        />
        <button
          disabled={isPending}
          className="disabled:bg-neutral-400 mt-4 w-full h-11 flex items-center justify-center gap-2 py-2.5 text-neutral-600 text-base font-semibold bg-primary-500 rounded disabled:bg-primary-100 disabled:cursor-not-allowed"
        >
          {isPending ? <Spinner /> : 'Submit'}
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
          <div>
            <BiErrorCircle />
          </div>
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

export { VerifyOTPForm }
