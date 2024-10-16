'use client'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CSSTransition } from 'react-transition-group'
import { BiCheckCircle, BiErrorCircle } from 'react-icons/bi'
import { useState, useTransition } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { ResetPasswordSchema } from '@/schema'
import { AuthResponse } from '@/types/auth'
import { Spinner } from '@/components'
import clsx from 'clsx'
import { redirect, useSearchParams } from 'next/navigation'
import { resetPassword } from './action'
import { useReCaptcha } from '@/hooks/useRecaptcha'

const SetPasswordForm = () => {
  const {
    formState: { errors },
    register,
    handleSubmit,
    reset
  } = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      confirmPassword: '',
      password: '',
      token: ''
    }
  })

  const [isPending, startTransition] = useTransition()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const [result, setResult] = useState<AuthResponse>({
    success: false,
    message: '',
    error: ''
  })

  const search = useSearchParams()
  const callbackUrl = search.get('callbackUrl') ?? '/'
  console.log(callbackUrl)

  const { verifyReCaptcha } = useReCaptcha()
  const token = search.get('token')

  const onSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {
    startTransition(async () => {
      const isVerified = await verifyReCaptcha('set_pass')
      console.log(isVerified)
      if (isVerified) {
        if (token) {
          const result = await resetPassword({
            password: values.password,
            confirmPassword: values.confirmPassword,
            token
          })
          setResult(result)
          if (result?.success) {
            redirect(callbackUrl)
          } else {
            reset()
          }
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
  const inputFields: Array<{
    id: number
    name: keyof z.infer<typeof ResetPasswordSchema>
    placeholder: string
    type: string
  }> = [
    {
      id: 3,
      name: 'password',
      placeholder: 'Password',
      type: 'password'
    },
    {
      id: 4,
      name: 'confirmPassword',
      placeholder: 'Confirm Password',
      type: 'password'
    }
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-5">
        {inputFields.map(({ id, type, placeholder, name }) => {
          return (
            <div key={id} className="relative">
              <input
                {...register(name)}
                placeholder={placeholder}
                type={
                  type === 'password'
                    ? isPasswordVisible
                      ? 'text'
                      : 'password'
                    : 'text'
                }
                className={clsx(
                  'w-full border border-gray-100 text-sm p-4 focus:outline-none focus:ring-1 focus:ring-primary-500 rounded',
                  errors[name] &&
                    'outline outline-red-200 outline-1 focus:ring-red-300'
                )}
              />
              {type === 'password' && (
                <div
                  onClick={() => setIsPasswordVisible((prev) => !prev)}
                  className="absolute right-4 top-1/2 translate-y-[-50%]"
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
                  enter: 'animate__animated',
                  enterActive: 'animate__fadeIn',
                  appear: 'animate__animated',
                  appearActive: 'animate__fadeIn',
                  exit: 'animate__animated',
                  exitActive: 'animate__fadeOut'
                }}
                unmountOnExit
              >
                <div className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  {errors[name]?.message && <BiErrorCircle />}
                  {errors[name]?.message}
                </div>
              </CSSTransition>
            </div>
          )
        })}
        <button
          type="submit"
          disabled={isPending}
          className="w-full h-11 flex items-center justify-center gap-2 py-2.5 text-neutral-600 text-base font-semibold bg-primary-500 rounded disabled:bg-primary-100 disabled:cursor-not-allowed"
        >
          {isPending ? <Spinner /> : 'Update password'}
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
  )
}

export default SetPasswordForm
