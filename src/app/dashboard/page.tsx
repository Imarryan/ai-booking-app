'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { UtensilsCrossed, Hotel, Calendar, MapPin, Loader2, XCircle } from 'lucide-react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchBookings()
    }
  }, [status, router])

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings')
      if (res.ok) {
        const data = await res.json()
        setBookings(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const cancelBooking = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return
    
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'PATCH' })
      if (res.ok) {
        fetchBookings()
      }
    } catch (error) {
      alert('Failed to cancel booking')
    }
  }

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-12 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Dashboard</h1>
            <p className="text-gray-400">Welcome back, {session?.user?.name}</p>
          </div>
          <div className="flex gap-4">
            <Link href="/restaurants" className="px-6 py-3 rounded-xl bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 font-medium transition-colors border border-indigo-500/20 hover:border-indigo-500/40">
              Book Restaurant
            </Link>
            <Link href="/hotels" className="px-6 py-3 rounded-xl bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 font-medium transition-colors border border-purple-500/20 hover:border-purple-500/40">
              Book Hotel
            </Link>
          </div>
        </div>

        <h2 className="text-xl font-bold text-white mb-6">Upcoming Reservations</h2>
        
        {bookings.length === 0 ? (
          <div className="glass-card p-12 text-center text-gray-400">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">You don't have any upcoming reservations.</p>
            <p className="mt-2 opacity-70">Start exploring to plan your next experience.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((b: any) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={b.id} 
                className="glass-card p-6 border-l-4 border-l-purple-500"
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex gap-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                      b.type === 'restaurant' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      {b.type === 'restaurant' ? <UtensilsCrossed className="w-8 h-8" /> : <Hotel className="w-8 h-8" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`px-2 py-0.5 text-xs font-bold uppercase rounded ${
                          b.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {b.status}
                        </span>
                        <span className="text-sm text-gray-400 uppercase tracking-wider font-semibold">
                          {b.type}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {b.type === 'restaurant' ? b.restaurant?.name : b.hotel?.name}
                      </h3>
                      <div className="flex flex-col sm:flex-row gap-4 text-gray-400 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {b.type === 'restaurant' ? b.restaurant?.city : b.hotel?.city}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(b.checkIn), 'MMM d, yyyy · h:mm a')} 
                          {b.checkOut && ` to ${format(new Date(b.checkOut), 'MMM d')}`}
                        </div>
                        <div className="flex items-center gap-2">
                          · {b.guests} {b.guests === 1 ? 'Guest' : 'Guests'}
                        </div>
                      </div>
                      
                      {b.roomId && b.room && (
                        <div className="mt-3 inline-block px-3 py-1 bg-white/5 rounded-lg text-sm text-gray-300 border border-white/10">
                          Room: {b.room.type} <span className="opacity-50 mx-2">|</span> Total: ${b.totalPrice}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {b.status === 'confirmed' && (
                    <div className="flex items-start justify-end">
                      <button 
                        onClick={() => cancelBooking(b.id)}
                        className="flex items-center gap-2 text-red-400 hover:text-red-300 font-medium px-4 py-2 rounded-lg hover:bg-red-900/20 transition-all border border-transparent hover:border-red-500/30"
                      >
                        <XCircle className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
