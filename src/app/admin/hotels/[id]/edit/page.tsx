'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { use } from 'react'

export default function EditHotelPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const id = resolvedParams.id
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    rating: 0,
    stars: 3,
    amenities: '',
    imageUrl: '',
  })

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await fetch(`/api/hotels/${id}`)
        if (res.ok) {
          const data = await res.json()
          setFormData({
            name: data.name || '',
            description: data.description || '',
            address: data.address || '',
            city: data.city || '',
            rating: data.rating || 0,
            stars: data.stars || 3,
            amenities: data.amenities || '',
            imageUrl: data.imageUrl || '',
          })
        } else {
          setError('Hotel not found')
        }
      } catch (err) {
        setError('Failed to load hotel data')
      } finally {
        setLoading(false)
      }
    }
    fetchHotel()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const res = await fetch(`/api/hotels/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push('/admin/hotels')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to update hotel')
      }
    } catch (err) {
      setError('An error occurred while updating the hotel')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0c29] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0c29] text-white p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/admin/hotels" className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-8 w-fit transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Hotels
        </Link>

        <h1 className="text-3xl font-bold mb-8">Edit Hotel</h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange}
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
              <label className="block text-sm font-medium text-gray-300 mb-2">Rating (0-5)</label>
              <input type="number" step="0.1" name="rating" value={formData.rating} onChange={handleChange} min="0" max="5"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Stars (1-5)</label>
              <input type="number" name="stars" value={formData.stars} onChange={handleChange} min="1" max="5"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Amenities (comma separated)</label>
              <input type="text" name="amenities" value={formData.amenities} onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
              <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-4">
            <Link href="/admin/hotels" className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors">
              Cancel
            </Link>
            <button type="submit" disabled={saving}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2">
              {saving && <Loader2 className="w-5 h-5 animate-spin" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
