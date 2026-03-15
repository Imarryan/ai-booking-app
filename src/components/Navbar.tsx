import Link from 'next/link'
import { UtensilsCrossed, Building2, User, Menu, X, Hotel } from 'lucide-react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import ClientNav from './ClientNav'

export default async function Navbar() {
  const session = await getServerSession(authOptions)

  return (
    <nav className="fixed w-full z-50 top-0 start-0 border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-2 rounded-xl group-hover:scale-105 transition-transform">
            <Hotel className="w-5 h-5" />
          </div>
          <span className="self-center text-2xl font-bold whitespace-nowrap text-white">
            BookWise
          </span>
        </Link>
        <ClientNav session={session} />
      </div>
    </nav>
  )
}
