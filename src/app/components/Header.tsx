'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import logo from '../../../public/images/logo/logo-full.png'
// import { signOut, auth } from '../../auth'

const Header = async () => {
  // const user = await auth()
  const pathName = usePathname()

  const navItems = [
    { id: 1, item: 'Home', link: '/' },
    { id: 2, item: 'Destination', link: '/destination' },
    { id: 3, item: 'About Us', link: '/about' },
    { id: 4, item: 'Contact', link: '/contact' }
  ]

  return (
    <header className="px-5">
      <div className="bg-white">
        <nav className=" max-w-screen-xl mx-auto flex items-center justify-between gap-5 py-3">
          <div>
            <Image
              src={logo}
              alt="RecalmTrip"
              width={130}
              className="cursor-pointer"
            />
          </div>
          <div className="flex gap-5 items-center">
            <ul className="flex gap-2 relative">
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.link}
                    className=" px-5 py-3 text-sm flex flex-col leading-none group"
                  >
                    <span>{item.item}</span>
                    <span
                      className={`h-[1.5px] scale-0 bg-black group-hover:scale-100 transition-all ease-linear duration-300 ${
                        pathName === item.link && 'scale-100'
                      }`}
                    ></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-sm font-medium">
            <Link href="/sign-in" className=" px-5 py-3 rounded-lg ">
              Log in
            </Link>
            <Link
              href="/sign-in"
              className="bg-primary-600 px-5 py-3 rounded-lg text-white "
            >
              Sign up
            </Link>
          </div>
        </nav>
        {/* {!user ? (
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
      )} */}
      </div>
    </header>
  )
}

export { Header }
