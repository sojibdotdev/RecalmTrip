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
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { LoginSchema } from '../../../schemas'
import { AuthActionResponse } from '../../../../types/auth'
import { Spinner } from '../../components/Spinner'
import { signIn } from 'next-auth/react'
import clsx from 'clsx'
import { login } from '../../actions/login'
import { useReCaptcha } from '../../hooks'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

const LoginPage = () => {
  const {
    formState: { errors },
    register,
    handleSubmit,
    reset
  } = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })
  const [isPending, startTransition] = useTransition()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const [result, setResult] = useState<AuthActionResponse>({
    success: false,
    message: '',
    error: ''
  })
  const searchParams = useSearchParams()
  const router = useRouter()
  const { verifyReCaptcha } = useReCaptcha()

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    startTransition(async () => {
      const isVerified = await verifyReCaptcha('login')
      if (isVerified) {
        const result = await login(values)
        setResult(result)
        if (result?.success) {
          router.replace(searchParams.get('callbackUrl') || '/')
          router.refresh()
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

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-center flex items-center justify-center gap-2">
        Login
      </h3>
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
            disabled={isPending}
            className="w-full h-11 flex items-center justify-center gap-2 py-2.5 text-neutral-600 text-base font-semibold bg-primary-400 rounded disabled:bg-primary-100 disabled:cursor-not-allowed"
          >
            {isPending ? <Spinner /> : 'Login'}
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
        className="block text-blue-600 w-full mt-2 mb-12 font-semibold text-xs"
        href="/auth/forgot-password"
      >
        Forgotten password ?
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
      <div className="text-xs mt-3 text-gray-400 font-semibold text-center">
        Don&rsquo;t have an account ?
        <Link href="/auth/register" className="text-primary-500">
          &nbsp; Register
        </Link>
      </div>
    </div>
  )
}

export default LoginPage
