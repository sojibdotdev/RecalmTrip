import { parsePhoneNumberFromString } from 'libphonenumber-js'
import * as z from 'zod'

export const LoginSchema = z
  .object({
    phone: z
      .string()
      .refine(
        (value) => {
          if (!value) return true
          const phoneNumber = parsePhoneNumberFromString(value)
          return phoneNumber?.isValid()
        },
        {
          message: 'Invalid phone number'
        }
      )
      .optional(),
    email: z
      .string()
      .optional()
      .refine(
        (value) => !value || z.string().email().safeParse(value).success,
        {
          message: 'Invalid email'
        }
      ),
    password: z.string().min(1, {
      message: 'Password is required'
    })
  })
  .superRefine((data, ctx) => {
    if (!data.email && !data.phone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Either email or phone number is required',
        path: ['email']
      })
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Either email or phone number is required',
        path: ['phone']
      })
    }
  })

export default LoginSchema

export const RegisterSchema = z
  .object({
    email: z
      .string()
      .email({
        message: 'Email is not valid'
      })
      .optional(),
    phone: z
      .string()
      .refine(
        (value) => {
          if (!value) return true
          const phoneNumber = parsePhoneNumberFromString(value)
          return phoneNumber?.isValid()
        },
        {
          message: 'Invalid phone number'
        }
      )
      .optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[0-9]/, 'Password must contain at least one number'),

    firstName: z.string().min(1, {
      message: 'First name is required'
    }),
    lastName: z.string().min(1, {
      message: 'Last name is required'
    })
  })
  .refine((data) => data.email || data.phone, {
    message: 'Either email or phone number is required',
    path: ['email', 'phone']
  })

export const VerifyEmailSchema = z.object({
  email: z.string().email({
    message: 'Email is required'
  }),
  otp: z.string().length(6, {
    message: 'OTP is not valid'
  })
})

export const _VerifyOTPSchema = z
  .object({
    email: z
      .string()
      .email({
        message: 'Invalid email address'
      })
      .optional(),
    phone: z
      .string()
      .refine(
        (value) => {
          if (!value) return true
          const phoneNumber = parsePhoneNumberFromString(value)
          return phoneNumber?.isValid()
        },
        {
          message: 'Invalid phone number'
        }
      )
      .optional(),
    otp: z.string().length(6, {
      message: 'OTP must be exactly 6 digits'
    })
  })
  .refine((data) => data.email || data.phone, {
    message: 'Either email or phone number is required',
    path: ['email', 'phone']
  })

export const VerifyOTPSchema = z
  .object({
    phone: z
      .string()
      .refine(
        (value) => {
          if (!value) return true
          const phoneNumber = parsePhoneNumberFromString(value)
          return phoneNumber?.isValid()
        },
        {
          message: 'Invalid phone number'
        }
      )
      .optional(),
    email: z
      .string()
      .optional()
      .refine(
        (value) => !value || z.string().email().safeParse(value).success,
        {
          message: 'Invalid email'
        }
      ),
    otp: z.string().length(6, {
      message: 'OTP must be exactly 6 digits'
    })
  })
  .superRefine((data, ctx) => {
    if (!data.email && !data.phone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Either email or phone number is required',
        path: ['email']
      })
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Either email or phone number is required',
        path: ['phone']
      })
    }
  })

export const ForgotPasswordSchema = z
  .object({
    phone: z
      .string()
      .refine(
        (value) => {
          if (!value) return true
          const phoneNumber = parsePhoneNumberFromString(value)
          return phoneNumber?.isValid()
        },
        {
          message: 'Invalid phone number'
        }
      )
      .optional(),
    email: z
      .string()
      .optional()
      .refine(
        (value) => !value || z.string().email().safeParse(value).success,
        {
          message: 'Invalid email'
        }
      )
  })
  .superRefine((data, ctx) => {
    if (!data.email && !data.phone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Either email or phone number is required',
        path: ['email']
      })
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Either email or phone number is required',
        path: ['phone']
      })
    }
  })

export const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    token: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })
