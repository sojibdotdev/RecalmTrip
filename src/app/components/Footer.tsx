import Image from 'next/image'
import Logo from '../../../public/images/logo/logo-full.png'

const Footer = () => {
  return (
    <footer className=" border-t">
      <div className="max-w-screen-xl mx-auto px-5">
        <div className="flex justify-between py-5 gap-3 flex-wrap">
          <div>
            {/* product */}
            <h2 className=" font-medium">Product</h2>
            <ul className="mt-3 text-gray-600">
              <li>Overview</li>
              <li>Feature</li>
              <li>Solution</li>
              <li>Pricing</li>
              <li>Releases</li>
            </ul>
          </div>
          <div>
            {/* company */}
            <h2 className=" font-medium">Company</h2>
            <ul className="mt-3 text-gray-600">
              <li>About us</li>
              <li>Careers</li>
              <li>Press</li>
              <li>News</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            {/* resources */}
            <h2 className=" font-medium">Resources</h2>
            <ul className="mt-3 text-gray-600">
              <li>Newsletter</li>
              <li>Events</li>
              <li>Help center</li>
              <li>Suport</li>
            </ul>
          </div>
          <div>
            {/* social */}
            <h2 className=" font-medium">Social</h2>
            <ul className="mt-3 text-gray-600">
              <li>Twitter</li>
              <li>Linkedin</li>
              <li>Facebook</li>
              <li>Github</li>
              <li>AngelList</li>
              <li>Dribble</li>
            </ul>
          </div>
          <div>
            {/* legal */}
            <h2 className=" font-medium">Legal</h2>
            <ul className="mt-3 text-gray-600">
              <li>Terms</li>
              <li>Privacy</li>
              <li>Cookies</li>
              <li>Licenses</li>
              <li>Settings</li>
            </ul>
          </div>
        </div>
      </div>
      <div
        className=" flex items-center justify-between py-2 
        "
      >
        <div>
          <Image src={Logo} alt="logo" width={100} height={30} />
        </div>
        <div className=" text-sm text-gray-700">
          copyright &copy;2024 <span>ReclamTrip</span>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
