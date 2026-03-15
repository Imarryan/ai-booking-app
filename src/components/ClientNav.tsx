'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, LogIn, LogOut, LayoutDashboard, Search } from 'lucide-react'
import { signOut } from 'next-auth/react'

export default function ClientNav({ session }: { session: any }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)

  const navLinks = [
    { name: 'Restaurants', href: '/restaurants', icon: Search },
    { name: 'Hotels', href: '/hotels', icon: Search },
  ]

  return (
    <>
      <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
        {session ? (
          <div className="flex items-center gap-4">
            <Link 
              href={session.user.role === 'admin' ? '/admin' : '/dashboard'}
              className="text-white hover:text-purple-400 transition-colors hidden md:flex items-center gap-2 font-medium"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-white hover:text-red-400 transition-colors hidden md:flex items-center gap-2 font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
            <Link href="/profile" className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold hidden md:flex hover:scale-105 transition-transform shadow-lg shadow-purple-500/20">
              {session.user?.name?.charAt(0) || 'U'}
            </Link>
          </div>
        ) : (
          <Link
            href="/login"
            className="text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            Sign in
          </Link>
        )}
        <button
          onClick={toggle}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg md:hidden hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600"
          aria-controls="navbar-sticky"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isOpen ? 'block' : 'hidden'}`}>
        <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-800 rounded-lg bg-black/60 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className="block py-2 px-3 text-gray-300 rounded hover:bg-gray-800 md:hover:bg-transparent md:hover:text-purple-400 md:p-0 transition-colors"
              >
                {link.name}
              </Link>
            </li>
          ))}
          {session && (
            <>
              <li className="md:hidden">
                <Link
                  href={session.user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="block py-2 px-3 text-gray-300 rounded hover:bg-gray-800 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li className="md:hidden">
                <Link
                  href="/profile"
                  className="block py-2 px-3 text-gray-300 rounded hover:bg-gray-800 transition-colors"
                >
                  Profile
                </Link>
              </li>
            </>
          )}
          {session && (
            <li className="md:hidden">
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="block w-full text-left py-2 px-3 text-red-400 rounded hover:bg-red-900/20 transition-colors"
              >
                Sign out
              </button>
            </li>
          )}
        </ul>
      </div>
    </>
  )
}
