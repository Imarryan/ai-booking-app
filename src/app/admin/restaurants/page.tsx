'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Restaurant {
  id: string
  name: string
  cuisine: string
  city: string
  rating: number
  priceRange: string
  capacity: number
  createdAt: string
}

const navItems = [
  { href: '/admin', label: 'Overview', icon: '📊' },
  { href: '/admin/restaurants', label: 'Restaurants', icon: '🍽️' },
  { href: '/admin/hotels', label: 'Hotels', icon: '🏨' },
  { href: '/admin/bookings', label: 'Bookings', icon: '📋' },
]

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchData = () => {
    setLoading(true)
    fetch(`/api/restaurants${search ? `?q=${search}` : ''}`)
      .then(r => r.json())
      .then(setRestaurants)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [search])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this restaurant?')) return
    setDeleting(id)
    try {
      await fetch(`/api/restaurants/${id}`, { method: 'DELETE' })
      setRestaurants(prev => prev.filter(r => r.id !== id))
    } catch {}
    setDeleting(null)
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
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${item.href === '/admin/restaurants' ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
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
              <h1 className="text-4xl font-bold text-white mb-1">Restaurants</h1>
              <p className="text-white/50">Manage all restaurant listings</p>
            </div>
            <div className="flex gap-4">
              <Link href="/restaurants"
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors">
                View Public Site
              </Link>
              <Link href="/admin/restaurants/new"
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
                + Add New Restaurant
              </Link>
            </div>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Search restaurants..."
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
                    {['Name', 'Cuisine', 'City', 'Rating', 'Price', 'Capacity', 'Actions'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {restaurants.map(r => (
                    <tr key={r.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{r.name}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs">{r.cuisine}</span>
                      </td>
                      <td className="px-6 py-4 text-white/70 text-sm">{r.city}</td>
                      <td className="px-6 py-4">
                        <span className="text-yellow-400 font-semibold">★ {r.rating.toFixed(1)}</span>
                      </td>
                      <td className="px-6 py-4 text-white/70 text-sm">{r.priceRange}</td>
                      <td className="px-6 py-4 text-white/70 text-sm">{r.capacity}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link href={`/admin/restaurants/${r.id}/edit`}
                            className="px-3 py-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg text-xs hover:bg-indigo-500/30 transition-colors">
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(r.id)}
                            disabled={deleting === r.id}
                            className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs hover:bg-red-500/30 transition-colors disabled:opacity-50">
                            {deleting === r.id ? '...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {restaurants.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-white/30">No restaurants found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
          <p className="mt-4 text-white/30 text-sm">{restaurants.length} restaurant(s) total</p>
        </main>
      </div>
    </div>
  )
}
