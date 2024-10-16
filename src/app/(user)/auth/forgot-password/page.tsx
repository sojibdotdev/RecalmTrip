'use client'
import Link from 'next/link'
import { FcGoogle } from 'react-icons/fc'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CSSTransition } from 'react-transition-group'
import { BiCheckCircle, BiErrorCircle } from 'react-icons/bi'
import React, { useState, useTransition } from 'react'
import { ForgotPasswordSchema } from '@/schema'
import { AuthResponse } from '@/types/auth'
import { Spinner } from '@/components'
import { signIn } from 'next-auth/react'
import clsx from 'clsx'
import { BsArrowLeftCircle } from 'react-icons/bs'
import { forgotPassword } from './action'
import { redirect } from 'next/navigation'
import { useReCaptcha } from '@/hooks/useRecaptcha'
import { encrypt } from '@/utils/encrypt'
import { FaEnvelope, FaFacebook, FaPhone } from 'react-icons/fa6'
import { PhoneInput } from '@/components/PhoneNumberInput'

const ForgotPasswordPage = () => {
  const {
    formState: { errors },
    register,
    reset,
    handleSubmit,
    control
  } = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: '',
      phone: ''
    }
  })
  const [isPending, startTransition] = useTransition()
  const { verifyReCaptcha } = useReCaptcha()
  const [isLoginByPhone, setIsLoginByPhone] = useState(true)

  const [result, setResult] = useState<AuthResponse>({
    success: false,
    message: '',
    error: ''
  })
  const inputFields: Array<{
    id: number
    name: keyof z.infer<typeof ForgotPasswordSchema>
    placeholder: string
    type: string
  }> = [
    {
      id: 1,
      name: 'phone',
      placeholder: 'Phone',
      type: 'text'
    },
    {
      id: 2,
      name: 'email',
      placeholder: 'Email',
      type: 'text'
    }
  ]

  const fields = React.useMemo(() => {
    return isLoginByPhone
      ? inputFields.filter((field) => field.name !== 'email')
      : inputFields.filter((field) => field.name !== 'phone')
  }, [isLoginByPhone])

  const onSubmit = async (values: z.infer<typeof ForgotPasswordSchema>) => {
    startTransition(async () => {
      const isVerified = await verifyReCaptcha('forgotPassword')
      if (isVerified) {
        const response = await forgotPassword(values)
        setResult(response)
        if (response.success) {
          const token = await encrypt({
            email: values.email,
            phone: values.phone,
            scope: 'FORGOT_PASSWORD'
          })
          redirect(`/auth/verify?token=${encodeURIComponent(token)}`)
        }
      } else {
        setResult({
          success: false,
          error:
            'Something went wrong. Please try again. If you continue to experience issues, please contact our support team for assistance.'
        })
      }
    })
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-center flex items-center justify-center gap-2">
        Forgot password ?
      </h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-5">
          {fields.map(({ id, type, placeholder, name }) => (
            <CSSTransition
              key={id}
              in
              appear
              timeout={200}
              classNames={{
                enter: 'animate__animated animate__fadeIn',
                exit: 'animate__animated animate__fadeOut animate__fadeOutLeft'
              }}
              unmountOnExit
            >
              <div className="relative">
                {name === 'phone' ? (
                  <Controller
                    name="phone"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => <PhoneInput {...field} />}
                  />
                ) : (
                  <input
                    {...register(name)}
                    placeholder={placeholder}
                    type={type}
                    className={clsx(
                      'w-full border border-gray-100 text-sm p-4 focus:outline-none focus:ring-1 focus:ring-primary-500 rounded',
                      errors[name] &&
                        'outline outline-red-200 outline-1 focus:ring-red-300'
                    )}
                  />
                )}

                <CSSTransition
                  in={Boolean(errors[name]?.message)}
                  timeout={200}
                  classNames={{
                    enter: 'animate__animated animate__fadeIn',
                    exit: 'animate__animated animate__fadeOut'
                  }}
                  unmountOnExit
                >
                  <div className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <BiErrorCircle />
                    {errors[name]?.message}
                  </div>
                </CSSTransition>
              </div>
            </CSSTransition>
          ))}
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-11 flex items-center justify-center gap-2 py-2.5 text-neutral-600 text-base font-semibold bg-primary-500 rounded disabled:bg-primary-100 disabled:cursor-not-allowed"
          >
            {isPending ? <Spinner /> : 'Send code'}
          </button>

          {result?.error && (
            <div className="rounded bg-red-100 text-red-400 text-sm font-semibold px-4 py-3 flex items-center justify-between">
              <div>{result.error}</div>
              <div>{<BiErrorCircle />}</div>
            </div>
          )}
          {result?.success && (
            <div className="rounded bg-green-100 text-green-400 text-sm font-semibold px-4 py-3 flex items-center justify-between">
              <div>{result.message}</div>
              <div>{<BiCheckCircle />}</div>
            </div>
          )}
        </div>
      </form>
      <Link
        className="text-blue-600 w-full my-12 mb-12 font-semibold text-sm text-center flex items-start gap-1 justify-center"
        href="/auth/login"
      >
        <BsArrowLeftCircle />
        <span className="translate-y-[-4px]"> Go back to login </span>
      </Link>
      <button
        className="flex items-center justify-center w-full mt-2 mb-12 py-2 px-4 text-neutral-500 text-sm  border-neutral-100 rounded-lg"
        onClick={() => {
          reset()
          setIsLoginByPhone(!isLoginByPhone)
        }}
      >
        {isLoginByPhone ? (
          <FaEnvelope className="mr-2" />
        ) : (
          <FaPhone className="mr-2" />
        )}
        {isLoginByPhone ? 'Login with email' : 'Login with phone number'}
      </button>
      <div className="flex items-center gap-4 text-gray-300 my-4 text-sm">
        <div className="w-full border border-gray-100"></div>
        <span className="text-red-500 text-xs">or</span>
        <div className="w-full border border-gray-100"></div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <button onClick={() => signIn('google')}>
          <FcGoogle />
        </button>
        <button onClick={() => signIn('facebook')}>
          <FaFacebook className="text-blue-400" />
        </button>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
