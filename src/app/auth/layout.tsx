const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="flex gap-6 max-w-md mx-auto border border-neutral-50">
        <div className="w-full p-4 bg-white rounded-lg mt-4 mb-24">
          {children}
        </div>
      </div>
      <div className="text-xs text-center text-neutral-400 py-4 max-w-sm mx-auto">
        This site is protected by reCAPTCHA and the Google{' '}
        <a className="text-blue-500" href="https://policies.google.com/privacy">
          Privacy Policy
        </a>{' '}
        and{' '}
        <a className="text-blue-500" href="https://policies.google.com/terms">
          Terms of Service
        </a>{' '}
        apply.
      </div>
    </>
  )
}

export default AuthLayout
