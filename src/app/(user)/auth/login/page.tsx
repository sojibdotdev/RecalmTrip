'use client'
import Link from 'next/link'
import { FcGoogle } from 'react-icons/fc'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CSSTransition } from 'react-transition-group'
import { BiCheckCircle, BiErrorCircle } from 'react-icons/bi'
import React, { useState, useTransition } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { LoginSchema } from '@/schema'
import { AuthResponse } from '@/types/auth'
import { Spinner } from '@/components'
import { signIn } from 'next-auth/react'
import clsx from 'clsx'
import { login } from './action'
import { useReCaptcha } from '@/hooks/useRecaptcha'
import { redirect, useSearchParams } from 'next/navigation'
import { FaEnvelope, FaFacebook, FaPhone } from 'react-icons/fa6'
import { PhoneInput } from '@/components/PhoneNumberInput'

const LoginPage = () => {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/'
  console.log(callbackUrl)

  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
    control
  } = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
      phone: ''
    }
  })
  const [isPending, startTransition] = useTransition()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isLoginByPhone, setIsLoginByPhone] = useState(true)
  const [result, setResult] = useState<AuthResponse>({
    success: false,
    message: '',
    error: ''
  })
  const { verifyReCaptcha } = useReCaptcha()

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    startTransition(async () => {
      const isVerified = await verifyReCaptcha('login')
      if (isVerified) {
        const result = await login(values)
        setResult(result)
        if (result?.success) {
          redirect(callbackUrl)
        } else {
          reset()
        }
      } else {
        setResult({
          success: false,
          error:
            'We’re sorry, but we couldn’t verify that you are a human. Please try again. If you continue to experience issues, please contact our support team for assistance.'
        })
      }
    })
  }

  const inputFields: Array<{
    id: number
    name: keyof z.infer<typeof LoginSchema>
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
    },
    {
      id: 3,
      name: 'password',
      placeholder: 'Password',
      type: 'password'
    }
  ]

  const fields = React.useMemo(() => {
    return isLoginByPhone
      ? inputFields.filter((field) => field.name !== 'email')
      : inputFields.filter((field) => field.name !== 'phone')
  }, [isLoginByPhone])

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-center flex items-center justify-center gap-2">
        Login
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
                    type={
                      type === 'password'
                        ? isPasswordVisible
                          ? 'text'
                          : 'password'
                        : type
                    }
                    className={clsx(
                      'w-full border border-gray-100 text-sm p-4 focus:outline-none focus:ring-1 focus:ring-primary-500 rounded',
                      errors[name] &&
                        'outline outline-red-200 outline-1 focus:ring-red-300'
                    )}
                  />
                )}

                {type === 'password' && (
                  <div
                    onClick={() => setIsPasswordVisible((prev) => !prev)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  >
                    {isPasswordVisible ? (
                      <FiEye className="text-neutral-400 text-base" />
                    ) : (
                      <FiEyeOff className="text-neutral-400 text-base" />
                    )}
                  </div>
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
            disabled={isPending}
            className="w-full h-11 flex items-center justify-center gap-2 py-2.5 text-neutral-600 text-base font-semibold bg-primary-500 rounded disabled:bg-neutral-200 disabled:cursor-not-allowed"
          >
            {isPending ? <Spinner /> : 'Login'}
          </button>
          {/* Render error/success messages */}
          {result.error && (
            <div className="rounded bg-red-100 text-red-400 text-sm font-semibold px-4 py-3 flex items-center justify-between">
              <div>{result.error}</div>
              <BiErrorCircle />
            </div>
          )}
          {result.success && (
            <div className="rounded bg-green-100 text-green-400 text-sm font-semibold px-4 py-3 flex items-center justify-between">
              <div>{result.message}</div>
              <BiCheckCircle />
            </div>
          )}
        </div>
      </form>
      {/* Link and Social Login Buttons */}
      <Link
        className="block text-blue-600 w-full mt-2 mb-12 font-semibold text-xs"
        href={`/auth/forgot-password?callbackUrl=${encodeURIComponent(
          callbackUrl
        )}`}
      >
        Forgotten password?
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
      <div className="text-xs mt-3 text-gray-400 font-semibold text-center">
        Don’t have an account?{' '}
        <Link
          href={`/auth/registration?callbackUrl=${encodeURIComponent(
            callbackUrl
          )}`}
          className="text-primary-500"
        >
          Register
        </Link>
      </div>
    </div>
  )
}

export default LoginPage
