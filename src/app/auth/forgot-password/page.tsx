'use client'
import Link from 'next/link'
import { FaGithub } from 'react-icons/fa6'
import { FcGoogle } from 'react-icons/fc'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CSSTransition } from 'react-transition-group'
import { BiCheckCircle, BiErrorCircle } from 'react-icons/bi'
import { useState, useTransition } from 'react'
import { ForgotPasswordSchema } from '../../../schemas'
import { AuthActionResponse } from '../../../../types/auth'
import { Spinner } from '../../components/Spinner'
import { signIn } from 'next-auth/react'
import clsx from 'clsx'
import { BsArrowLeftCircle } from 'react-icons/bs'
import { forgotPassword } from '../../actions/forgot-password'
import { useRouter } from 'next/navigation'
import { encrypt } from '../../../utils/cryptUtils'
import { useReCaptcha } from '../../hooks'

const ForgotPasswordPage = () => {
  const {
    formState: { errors },
    register,
    handleSubmit
  } = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  })
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { verifyReCaptcha } = useReCaptcha()

  const [result, setResult] = useState<AuthActionResponse>({
    success: false,
    message: '',
    error: ''
  })

  const onSubmit = async (values: z.infer<typeof ForgotPasswordSchema>) => {
    startTransition(async () => {
      const isVerified = await verifyReCaptcha('forgotPassword')
      if (isVerified) {
        const result = await forgotPassword(values)
        setResult(result)
        const key = await encrypt({
          email: values.email,
          scope: 'FORGOT_PASSWORD'
        })
        sessionStorage.setItem('key', key)
        if (result.success) {
          router.push(`/auth/verify-email`)
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
    name: keyof z.infer<typeof ForgotPasswordSchema>
    placeholder: string
    type: string
  }> = [
    {
      id: 2,
      name: 'email',
      placeholder: 'Email',
      type: 'text'
    }
  ]

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-center flex items-center justify-center gap-2">
        Forgot password ?
      </h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-5">
          {inputFields.map(({ id, placeholder, name }) => {
            return (
              <div key={id} className="relative">
                <input
                  {...register(name)}
                  placeholder={placeholder}
                  type="text"
                  className={clsx(
                    'w-full border border-gray-100 text-sm p-4 focus:outline-none focus:ring-1 focus:ring-primary-500 rounded',
                    errors[name] &&
                      'outline outline-red-200 outline-1 focus:ring-red-300'
                  )}
                />

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
            className="w-full h-11 flex items-center justify-center gap-2 py-2.5 text-neutral-600 text-base font-semibold bg-primary-400 rounded disabled:bg-primary-100 disabled:cursor-not-allowed"
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

      <div className="flex items-center gap-4 text-gray-300 my-4 text-sm">
        <div className="w-full border border-gray-100"></div>
        <span className="text-red-500 text-xs">or</span>
        <div className="w-full border border-gray-100"></div>
      </div>
      <div className="text-2xl flex items-center justify-center my-8 gap-4">
        <button onClick={() => signIn('google')}>
          <FcGoogle />
        </button>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
