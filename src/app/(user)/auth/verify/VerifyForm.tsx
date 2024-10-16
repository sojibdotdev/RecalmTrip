'use client'
import { useForm } from 'react-hook-form'
import { useState, useTransition } from 'react'
import { AuthResponse } from '@/types/auth'
import { Spinner } from '@/components/Spinner'
import { BiErrorCircle } from 'react-icons/bi'
import { redirect } from 'next/navigation'
import { useReCaptcha } from '@/hooks/useRecaptcha'
import { verifyOTP } from './actions/verifyOTP'
import { generateIdToken } from '@/utils/generateIdToken'
import { sendOTP } from '@/utils/sendOTP'
import clsx from 'clsx'
import { CSSTransition } from 'react-transition-group'

interface FormData {
  otp: string
}

const VerifyOTPForm = ({
  phone,
  email,
  name
}: {
  phone: string
  email: string
  name: string
}) => {
  const {
    formState: { errors },
    handleSubmit,
    reset,
    register
  } = useForm<FormData>({
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
    if (phone || email) {
      startTransition(async () => {
        const isVerified = await verifyReCaptcha('resendOtp')
        reset({ otp: '' })
        if (isVerified) {
          const resendResult = await sendOTP({
            name,
            phone,
            email
          })
          setResult(resendResult)
        }
      })
    }
  }

  const onSubmit = async (data: FormData) => {
    startTransition(async () => {
      if (phone || email) {
        const verifyResult = await verifyOTP({
          phone,
          email,
          otp: data.otp
        })
        setResult(verifyResult)
        reset({ otp: '' })
        if (verifyResult.success) {
          const idToken = await generateIdToken('SET_PASSWORD')
          if (idToken) {
            redirect(`/auth/set-password?token=${encodeURIComponent(idToken)}`)
          }
        }
      }
    })
  }

  console.log(errors)

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center"
      >
        <div className="w-full">
          <input
            {...register('otp', {
              required: 'OTP is required',
              pattern: {
                value: /^[0-9]{6}$/,
                message: 'OTP must be 6 digits'
              }
            })}
            placeholder="Enter 6 digit OTP"
            type="text"
            className={clsx(
              'w-full border border-neutral-400 text-sm p-4 focus:outline-none rounded',
              errors.otp &&
                'outline outline-red-200 outline-1 focus:ring-red-300'
            )}
          />
        </div>
        <CSSTransition
          in={Boolean(errors.otp?.message)}
          timeout={200}
          classNames={{
            enter: 'animate__animated animate__fadeIn',
            exit: 'animate__animated animate__fadeOut'
          }}
          unmountOnExit
        >
          <div className="text-red-400 text-xs justify-start items-center mt-1 flex gap-1 w-full">
            <BiErrorCircle />
            {errors.otp?.message}
          </div>
        </CSSTransition>

        <button
          type="submit"
          disabled={isPending}
          className="disabled:bg-neutral-400 mt-4 w-full h-11 flex items-center justify-center gap-2 py-2.5 text-neutral-600 text-base font-semibold bg-primary-500 rounded disabled:cursor-not-allowed"
        >
          {isPending ? <Spinner /> : 'Submit'}
        </button>
      </form>
      <button
        onClick={handleResendOTP}
        className="text-xs text-neutral-600 my-4"
      >
        Didn’t receive an OTP yet?{' '}
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
