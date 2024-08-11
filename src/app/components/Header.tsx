import Link from 'next/link'
import { signOut, auth } from '../../auth'

const Header = async () => {
  const user = await auth()

  return (
    <header className="h-[var(--header-height)]">
      {!user ? (
        <Link href="/auth/login">Login</Link>
      ) : (
        <form
          action={async () => {
            'use server'
            await signOut()
          }}
        >
          <button type="submit">Sign Out</button>
        </form>
      )}
    </header>
  )
}

export { Header }
