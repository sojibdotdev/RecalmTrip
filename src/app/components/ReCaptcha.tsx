'use client'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import React from 'react'

const ReCaptcha = ({ children }: { children: React.ReactNode }) => {
  const key: string | undefined = process?.env?.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  return (
    <GoogleReCaptchaProvider reCaptchaKey={key ?? 'NOT DEFINED'}>
      {children}
    </GoogleReCaptchaProvider>
  )
}
export { ReCaptcha }
