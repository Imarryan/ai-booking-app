import Link from 'next/link'
import { Hotel, Facebook, Twitter, Instagram, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 text-gray-400 mt-24">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0 max-w-sm">
            <Link href="/" className="flex items-center space-x-2 group mb-4">
              <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-2 rounded-xl">
                <Hotel className="w-5 h-5" />
              </div>
              <span className="self-center text-2xl font-bold whitespace-nowrap text-white">
                BookWise
              </span>
            </Link>
            <p className="text-sm">
              Your intelligent companion for booking the perfect stay and dining experience worldwide.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-white uppercase">Resources</h2>
              <ul className="font-medium space-y-4">
                <li><Link href="/restaurants" className="hover:text-purple-400">Restaurants</Link></li>
                <li><Link href="/hotels" className="hover:text-purple-400">Hotels</Link></li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-white uppercase">Legal</h2>
              <ul className="font-medium space-y-4">
                <li><Link href="#" className="hover:text-purple-400">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-purple-400">Terms &amp; Conditions</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-800 sm:mx-auto lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm sm:text-center">
            © {new Date().getFullYear()} <Link href="/" className="hover:text-purple-400">BookWise™</Link>. All Rights Reserved.
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0 space-x-5">
            <Link href="#" className="hover:text-white"><Facebook className="w-4 h-4" /></Link>
            <Link href="#" className="hover:text-white"><Twitter className="w-4 h-4" /></Link>
            <Link href="#" className="hover:text-white"><Instagram className="w-4 h-4" /></Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
