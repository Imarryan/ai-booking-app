'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Hotel {
  id: string
  name: string
  city: string
  rating: number
  stars: number
  amenities: string
  createdAt: string
  _count?: { rooms: number; bookings: number }
}

const navItems = [
  { href: '/admin', label: 'Overview', icon: '📊' },
  { href: '/admin/restaurants', label: 'Restaurants', icon: '🍽️' },
  { href: '/admin/hotels', label: 'Hotels', icon: '🏨' },
  { href: '/admin/bookings', label: 'Bookings', icon: '📋' },
]

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchData = () => {
    setLoading(true)
    fetch(`/api/hotels${search ? `?q=${search}` : ''}`)
      .then(r => r.json())
      .then(setHotels)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [search])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this hotel and all its rooms?')) return
    setDeleting(id)
    try {
      await fetch(`/api/hotels/${id}`, { method: 'DELETE' })
      setHotels(prev => prev.filter(h => h.id !== id))
    } catch {}
    setDeleting(null)
  }

  const renderStars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)

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
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${item.href === '/admin/hotels' ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">Hotels</h1>
              <p className="text-white/50">Manage all hotel listings and rooms</p>
            </div>
            <div className="flex gap-4">
              <Link href="/hotels"
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors">
                View Public Site
              </Link>
              <Link href="/admin/hotels/new"
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
                + Add New Hotel
              </Link>
            </div>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search hotels..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full max-w-md bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-indigo-400 transition-colors"
            />
          </div>

          <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    {['Name', 'City', 'Stars', 'Rating', 'Amenities', 'Actions'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {hotels.map(h => (
                    <tr key={h.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{h.name}</td>
                      <td className="px-6 py-4 text-white/70 text-sm">{h.city}</td>
                      <td className="px-6 py-4 text-yellow-400 text-sm">{renderStars(h.stars)}</td>
                      <td className="px-6 py-4">
                        <span className="text-yellow-400 font-semibold">★ {h.rating.toFixed(1)}</span>
                      </td>
                      <td className="px-6 py-4 text-white/50 text-xs max-w-xs truncate">
                        {h.amenities ? h.amenities.split(',').slice(0, 3).join(', ') : '–'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link href={`/admin/hotels/${h.id}/edit`}
                            className="px-3 py-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg text-xs hover:bg-indigo-500/30 transition-colors">
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(h.id)}
                            disabled={deleting === h.id}
                            className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/30 transition-colors disabled:opacity-50">
                            {deleting === h.id ? '...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {hotels.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-white/30">No hotels found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
          <p className="mt-4 text-white/30 text-sm">{hotels.length} hotel(s) total</p>
        </main>
      </div>
    </div>
  )
}
