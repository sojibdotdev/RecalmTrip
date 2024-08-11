'use client'
import Link from 'next/link'
import { FaGithub } from 'react-icons/fa6'
import { FcGoogle } from 'react-icons/fc'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { CSSTransition } from 'react-transition-group'
import { BiCheckCircle, BiErrorCircle } from 'react-icons/bi'
import { useState, useTransition } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { RegisterSchema } from '../../../schemas'
import { register as registration } from '../../actions/register'
import { AuthActionResponse } from '../../../../types/auth'
import { Spinner } from '../../components/Spinner'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { encrypt } from '../../../utils/cryptUtils'
import { useReCaptcha } from '../../hooks'

const RegistrationPage = () => {
  const router = useRouter()
  const {
    formState: { errors },
    register,
    handleSubmit
  } = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: ''
    }
  })
  const [isPending, startTransition] = useTransition()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const { verifyReCaptcha } = useReCaptcha()

  const [result, setResult] = useState<AuthActionResponse>({
    success: false,
    message: '',
    error: ''
  })

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    startTransition(async () => {
      setResult({
        success: false,
        message: '',
        error: ''
      })
      const isVerified = await verifyReCaptcha('register')
      if (isVerified) {
        const key = await encrypt({ email: values.email, scope: 'REGISTER' })
        sessionStorage.setItem('key', key)
        const result = await registration(values)
        if (result) {
          setResult(result)
          if (result.success) {
            router.push('/auth/verify-email')
            router.refresh()
          }
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
    name: keyof z.infer<typeof RegisterSchema>
    placeholder: string
    type: string
  }> = [
    {
      id: 0,
      name: 'firstName',
      placeholder: 'First Name',
      type: 'text'
    },
    {
      id: 1,
      name: 'lastName',
      placeholder: 'Last Name',
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

  return (
    <div>
      <h3 className="text-xl font-bold mb-8 text-center flex items-center justify-center gap-2">
        Registration
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
            {isPending ? <Spinner /> : 'Register'}
          </button>
          <div className="text-xs text-neutral-500 tracking-wide">
            By clicking on Register or signing in using a social login, you
            agree to our{' '}
            <Link className="text-blue-500" href="#">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link className="text-blue-500" href="#">
              Privacy Policy.
            </Link>
          </div>

          {result.error && !isPending && (
            <div className="rounded bg-red-100 text-red-400 text-sm font-semibold px-4 py-3 flex items-center justify-between">
              <div>{result.error}</div>
              <div>{<BiErrorCircle />}</div>
            </div>
          )}
          {result.success && !isPending && (
            <div className="rounded bg-green-100 text-green-400 text-sm font-semibold px-4 py-3 flex items-center justify-between">
              <div>{result.message}</div>
              <div>{<BiCheckCircle />}</div>
            </div>
          )}
        </div>
      </form>

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
        Already have an account ?
        <Link href="/auth/login" className="text-primary-500">
          &nbsp;Login
        </Link>
      </div>
    </div>
  )
}

export default RegistrationPage
