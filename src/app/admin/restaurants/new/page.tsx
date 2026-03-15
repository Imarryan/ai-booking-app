'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'

export default function NewRestaurantPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    cuisine: '',
    description: '',
    address: '',
    city: '',
    priceRange: '$$',
    capacity: 50,
    openTime: '10:00',
    closeTime: '22:00',
    imageUrl: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push('/admin/restaurants')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to create restaurant')
      }
    } catch (err) {
      setError('An error occurred while creating the restaurant')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0c29] text-white p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/admin/restaurants" className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-8 w-fit transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Restaurants
        </Link>

        <h1 className="text-3xl font-bold mb-8">Add New Restaurant</h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Cuisine Type *</label>
              <input required type="text" name="cuisine" value={formData.cuisine} onChange={handleChange} placeholder="e.g. Italian, Japanese"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
              <textarea required name="description" value={formData.description} onChange={handleChange} rows={3}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Address *</label>
              <input required type="text" name="address" value={formData.address} onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">City *</label>
              <input required type="text" name="city" value={formData.city} onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Price Range</label>
              <select name="priceRange" value={formData.priceRange} onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors appearance-none">
                <option value="$">$ (Budget)</option>
                <option value="$$">$$ (Moderate)</option>
                <option value="$$$">$$$ (Expensive)</option>
                <option value="$$$$">$$$$ (Luxury)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Capacity (Guests)</label>
              <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} min="1"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Open Time</label>
              <input type="time" name="openTime" value={formData.openTime} onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Close Time</label>
              <input type="time" name="closeTime" value={formData.closeTime} onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
              <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="/images/restaurant-1.jpg"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" disabled={loading}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2">
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? 'Creating...' : 'Create Restaurant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
