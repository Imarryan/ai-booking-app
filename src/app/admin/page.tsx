'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Stats {
  totalBookings: number
  totalRevenue: number
  totalRestaurants: number
  totalHotels: number
  totalUsers: number
  recentBookings: Booking[]
}

interface Booking {
  id: string
  type: string
  status: string
  checkIn: string
  totalPrice: number
  guests: number
  user: { name: string; email: string }
  restaurant?: { name: string }
  hotel?: { name: string }
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const statCards = [
    { label: 'Total Bookings', value: stats?.totalBookings ?? 0, icon: '📋', color: 'from-indigo-500 to-purple-600' },
    { label: 'Total Revenue', value: `$${(stats?.totalRevenue ?? 0).toFixed(0)}`, icon: '💰', color: 'from-green-500 to-emerald-600' },
    { label: 'Restaurants', value: stats?.totalRestaurants ?? 0, icon: '🍽️', color: 'from-orange-500 to-red-600' },
    { label: 'Hotels', value: stats?.totalHotels ?? 0, icon: '🏨', color: 'from-blue-500 to-cyan-600' },
    { label: 'Registered Users', value: stats?.totalUsers ?? 0, icon: '👥', color: 'from-purple-500 to-pink-600' },
  ]

  const navItems = [
    { href: '/admin', label: 'Overview', icon: '📊' },
    { href: '/admin/restaurants', label: 'Restaurants', icon: '🍽️' },
    { href: '/admin/hotels', label: 'Hotels', icon: '🏨' },
    { href: '/admin/bookings', label: 'Bookings', icon: '📋' },
  ]

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen border-r border-white/10 bg-black/30 backdrop-blur-xl p-6 flex flex-col gap-2">
          <div className="mb-8">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Admin Panel
            </span>
          </div>
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
          <div className="mt-auto">
            <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-white/80 transition-all">
              <span>←</span>
              <span className="text-sm">Back to Site</span>
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard Overview</h1>
            <p className="text-white/50">Welcome to the AI Booking Platform admin area</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
            </div>
          ) : (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
                {statCards.map(card => (
                  <div key={card.label} className="rounded-2xl p-5 bg-white/5 backdrop-blur border border-white/10 hover:border-white/20 transition-all">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${card.color} mb-3 text-2xl`}>
                      {card.icon}
                    </div>
                    <p className="text-3xl font-bold text-white">{card.value}</p>
                    <p className="text-white/50 text-sm mt-1">{card.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent Bookings */}
              <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">Recent Bookings</h2>
                  <Link href="/admin/bookings" className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
                    View all →
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        {['Customer', 'Type', 'Venue', 'Date', 'Guests', 'Price', 'Status'].map(h => (
                          <th key={h} className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {(stats?.recentBookings ?? []).map(b => (
                        <tr key={b.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <p className="text-white text-sm font-medium">{b.user.name}</p>
                            <p className="text-white/40 text-xs">{b.user.email}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${b.type === 'restaurant' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                              {b.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-white/70 text-sm">
                            {b.restaurant?.name ?? b.hotel?.name ?? '–'}
                          </td>
                          <td className="px-6 py-4 text-white/70 text-sm">
                            {new Date(b.checkIn).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-white/70 text-sm">{b.guests}</td>
                          <td className="px-6 py-4 text-white text-sm font-medium">${b.totalPrice.toFixed(0)}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              b.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                              b.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {(stats?.recentBookings ?? []).length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-6 py-10 text-center text-white/30">No bookings yet</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
