'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Booking {
  id: string
  type: string
  status: string
  checkIn: string
  checkOut: string | null
  guests: number
  totalPrice: number
  specialReqs: string
  createdAt: string
  user: { name: string; email: string }
  restaurant?: { name: string; city: string }
  hotel?: { name: string; city: string }
  room?: { type: string; price: number }
}

const navItems = [
  { href: '/admin', label: 'Overview', icon: '📊' },
  { href: '/admin/restaurants', label: 'Restaurants', icon: '🍽️' },
  { href: '/admin/hotels', label: 'Hotels', icon: '🏨' },
  { href: '/admin/bookings', label: 'Bookings', icon: '📋' },
]

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'restaurant' | 'hotel'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'cancelled' | 'pending'>('all')

  useEffect(() => {
    setLoading(true)
    fetch('/api/admin/bookings')
      .then(r => r.json())
      .then(setBookings)
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = bookings.filter(b => {
    if (filter !== 'all' && b.type !== filter) return false
    if (statusFilter !== 'all' && b.status !== statusFilter) return false
    return true
  })

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this booking?')) return
    try {
      await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      })
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b))
    } catch {}
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>
      <div className="flex">
        <aside className="w-64 min-h-screen border-r border-white/10 bg-black/30 backdrop-blur-xl p-6 flex flex-col gap-2">
          <div className="mb-8">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Admin Panel
            </span>
          </div>
          {navItems.map(item => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${item.href === '/admin/bookings' ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
          <div className="mt-auto">
            <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-white/80 transition-all">
              <span>←</span><span className="text-sm">Back to Site</span>
            </Link>
          </div>
        </aside>

        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-1">All Bookings</h1>
            <p className="text-white/50">Manage and monitor all platform bookings</p>
          </div>

          {/* Filters */}
          <div className="flex gap-3 mb-6 flex-wrap">
            <div className="flex gap-2">
              {(['all', 'restaurant', 'hotel'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-indigo-500 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {(['all', 'confirmed', 'cancelled', 'pending'] as const).map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${statusFilter === s ? 'bg-purple-500 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      {['Customer', 'Type', 'Venue', 'Check-in', 'Check-out', 'Guests', 'Price', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filtered.map(b => (
                      <tr key={b.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-4">
                          <p className="text-white text-sm font-medium">{b.user.name}</p>
                          <p className="text-white/40 text-xs">{b.user.email}</p>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${b.type === 'restaurant' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                            {b.type}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-white/70 text-sm">
                          <p>{b.restaurant?.name ?? b.hotel?.name ?? '–'}</p>
                          <p className="text-white/30 text-xs">{b.restaurant?.city ?? b.hotel?.city ?? ''}</p>
                        </td>
                        <td className="px-4 py-4 text-white/70 text-sm whitespace-nowrap">
                          {new Date(b.checkIn).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 text-white/70 text-sm whitespace-nowrap">
                          {b.checkOut ? new Date(b.checkOut).toLocaleDateString() : '–'}
                        </td>
                        <td className="px-4 py-4 text-white/70 text-sm">{b.guests}</td>
                        <td className="px-4 py-4 text-white font-semibold text-sm">${b.totalPrice.toFixed(0)}</td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            b.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                            b.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          {b.status === 'confirmed' && (
                            <button onClick={() => handleCancel(b.id)}
                              className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/30 transition-colors whitespace-nowrap">
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={9} className="px-6 py-10 text-center text-white/30">No bookings found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <p className="mt-4 text-white/30 text-sm">{filtered.length} of {bookings.length} booking(s)</p>
        </main>
      </div>
    </div>
  )
}
