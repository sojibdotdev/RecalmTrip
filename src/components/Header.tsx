import clsx from 'clsx'
import Link from 'next/link'
import { auth } from '@/auth'
import { BsCart3 } from 'react-icons/bs'
import { logout } from '@/actions/logout'
import Image from 'next/image'
import { Avatar, Badge, Dropdown, Tooltip, MenuProps } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { IoMdLogOut } from 'react-icons/io'
import { Session } from 'next-auth'
import { AiOutlineUnorderedList } from 'react-icons/ai'

const userRoutes = [
  { id: 3, url: '/contact', title: 'Contact' },
  { id: 4, url: '/about', title: 'About' }
]

const Header = async () => {
  const session: Session | null = await auth()

  return (
    <header className="h-[var(--header-height)]  w-screen z-50 bg-white relative shadow-sm">
      <div className="max-w-screen-xl px-3 mx-auto flex items-center justify-between h-full">
        <div className="flex items-center">
          <Link href="/">
            <div className="hidden md:flex h-12 items-center">
              <Image
                src="/logo-full.png"
                alt="Logo"
                width={300}
                height={80}
                className="h-full w-auto"
              />
            </div>
            <div className="flex md:hidden h-12 items-center">
              <Image
                src="/logo.png"
                alt="Logo"
                width={80}
                height={80}
                className="h-full w-auto"
              />
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-2 text-gray-700 tracking-wider relative h-full">
          <div className="hidden md:block">
            <NavigationMenu />
          </div>
          <div className="flex items-center gap-4 md:gap-6 md:ml-16">
            <Badge className="cursor-pointer" count={10} overflowCount={999}>
              <BsCart3 className="text-2xl" />
            </Badge>
            <AuthMenu session={session} />
            <Dropdown
              trigger={['click', 'hover']}
              placement="bottomRight"
              className="md:hidden flex"
              menu={{
                items: userRoutes.map((node) => ({
                  key: node.id,
                  label: (
                    <Link
                      className={clsx(
                        'cursor-pointer text-sm relative z-10 h-full flex items-center px-3 hover:border-b hover:border-b-primary-500 transition-all'
                      )}
                      href={node.url}
                    >
                      <span>{node.title}</span>
                    </Link>
                  )
                }))
              }}
            >
              <AiOutlineUnorderedList className="text-2xl cursor-pointer" />
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  )
}

export { Header }

const NavigationMenu = () => {
  return (
    <div className="hidden md:flex">
      {userRoutes.map(({ id, title, url }) => {
        return (
          <Link
            key={id}
            className={clsx(
              'cursor-pointer text-sm relative z-10 h-full flex items-center px-3 hover:border-b hover:border-b-primary-500 transition-all'
            )}
            href={url}
          >
            <span>{title}</span>
          </Link>
        )
      })}
    </div>
  )
}

interface AuthMenuProps {
  session: Session | null
}

const AuthMenu = ({ session }: AuthMenuProps) => {
  return (
    <div>
      {session?.user ? (
        <Dropdown
          trigger={['click', 'hover']}
          placement="bottomRight"
          menu={{
            items: [
              {
                key: '1',
                icon: <UserOutlined />,
                label: <Link href="/account/profile">Account</Link>
              },
              {
                key: '2',
                icon: <IoMdLogOut className="text-red-400" />,
                label: (
                  <form action={logout}>
                    <button className="text-red-400" type="submit">
                      Sign out
                    </button>
                  </form>
                )
              }
            ] as MenuProps['items']
          }}
        >
          <Avatar
            style={{ backgroundColor: '#619fb4', cursor: 'pointer' }}
            shape="circle"
          >
            {session?.user?.name?.slice(0, 1)}
          </Avatar>
        </Dropdown>
      ) : (
        <Link
          className="border md:border bg-transparent md:bg-neutral-100  transition-all text-tertiary-500 rounded-sm flex items-center  justify-center px-4 py-1.5 md:py-2.5 md:text-sm hover:bg-neutral-100 active:bg-primary-500 active:text-white"
          href="/auth/login"
        >
          Login
        </Link>
      )}
    </div>
  )
}
