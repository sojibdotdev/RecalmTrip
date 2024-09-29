'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import logo from '../../../public/images/logo/logo-full.png'
import Discovery from '../../../public/images/NavBar/Discovery.svg'
import Home from '../../../public/images/NavBar/home.svg'
import User from '../../../public/images/NavBar/user.svg'
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
          <div className="min-[900px]:flex gap-5 items-center hidden ">
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
          <div className="text-sm font-medium flex items-center gap-2 ">
            <Link
              href="/sign-in"
              className="bg-primary-500 px-5 py-3 rounded-lg text-white "
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
      <div className=" min-[900px]:hidden block absolute bottom-0 shadow-[0px_-1px_2px_0px_#e5e7eb] z-50 bg-white w-full left-0 right-0 px-10">
        <ul className=" flex items-center justify-between py-3">
          <li className=" flex flex-col items-center cursor-pointer px-5 ">
            <Image
              src={Discovery}
              alt="Discovery"
              width={25}
              height={20}
              className="grayscale"
            />
            <span className=" text-sm font-medium text-gray-400">Explore</span>
          </li>
          <li className=" flex flex-col items-center cursor-pointer  px-5">
            <Image src={Home} alt="Home" width={25} height={20} />
            <span className=" text-sm font-medium text-primary-500">Home</span>
          </li>
          <li className=" flex flex-col items-center cursor-pointer px-5">
            <Image
              src={User}
              alt="User"
              width={25}
              height={20}
              className=" grayscale"
            />
            <span className=" text-sm font-medium text-gray-400">Account</span>
          </li>
        </ul>
      </div>
    </header>
  )
}

export { Header }
