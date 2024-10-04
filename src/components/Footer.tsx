import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="pt-10">
      <div className="text-center text-sm text-gray-700 border-t py-4 ">
        Copyright &copy;{new Date().getFullYear()}{' '}
        <Link
          href="www.recalmtrip.com"
          className="text-primary-500 border-b border-b-primary-500 font-semibold"
        >
          www.recalmtrip.com
        </Link>
      </div>
    </footer>
  )
}

export { Footer }
