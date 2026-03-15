'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Star, MapPin, Clock, Users, Calendar, Loader2 } from 'lucide-react'

import { use } from 'react'

export default function RestaurantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const id = resolvedParams.id
  const router = useRouter()
  const { data: session } = useSession()
  
  const [restaurant, setRestaurant] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  // Booking state
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [guests, setGuests] = useState(2)
  const [specialReqs, setSpecialReqs] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(false)

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await fetch(`/api/restaurants/${id}`)
        if (res.ok) {
          const data = await res.json()
          setRestaurant(data)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchRestaurant()
  }, [id])

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session) {
      router.push('/login')
      return
    }

    if (!date || !time) {
      setBookingError('Please select a date and time')
      return
    }

    setBookingLoading(true)
    setBookingError('')

    try {
      // Create combined datetime
      const checkIn = new Date(`${date}T${time}`)

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'restaurant',
          restaurantId: id,
          checkIn: checkIn.toISOString(),
          guests,
          specialReqs,
        }),
      })

      if (res.ok) {
        setBookingSuccess(true)
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        const data = await res.json()
        setBookingError(data.error || 'Booking failed')
      }
    } catch (error) {
      setBookingError('An error occurred. Please try again.')
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-400">
        Restaurant not found
      </div>
    )
  }

  // Generate time slots based on open/close times (simplified)
  const generateTimeSlots = () => {
    const slots = []
    const start = parseInt(restaurant.openTime.split(':')[0])
    const end = parseInt(restaurant.closeTime.split(':')[0])
    
    for (let i = start; i < end; i++) {
      slots.push(`${i.toString().padStart(2, '0')}:00`)
      slots.push(`${i.toString().padStart(2, '0')}:30`)
    }
    return slots
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Banner */}
      <div className="h-[40vh] w-full relative bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        {restaurant.imageUrl && (
          <img 
            src={restaurant.imageUrl} 
            alt={restaurant.name} 
            className="w-full h-full object-cover" 
          />
        )}
        <div className="absolute inset-0 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="px-3 py-1 text-sm font-semibold bg-indigo-500 text-white rounded-full">
              {restaurant.cuisine}
            </span>
            <span className="px-3 py-1 text-sm font-semibold glass text-white rounded-full flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              {restaurant.rating}
            </span>
            <span className="px-3 py-1 text-sm font-semibold glass text-white rounded-full">
              {restaurant.priceRange}
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4"
          >
            {restaurant.name}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-6 text-gray-300"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-400" />
              {restaurant.address}, {restaurant.city}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              {restaurant.openTime} - {restaurant.closeTime}
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              Up to {restaurant.capacity} guests
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">About the Restaurant</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                {restaurant.description}
              </p>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass p-8 rounded-2xl"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Location & Hours</h2>
              <div className="grid sm:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-gray-400 mb-2">Address</h3>
                  <p className="text-white text-lg">{restaurant.address}<br/>{restaurant.city}</p>
                </div>
                <div>
                  <h3 className="text-gray-400 mb-2">Opening Hours</h3>
                  <p className="text-white text-lg">Everyday: {restaurant.openTime} - {restaurant.closeTime}</p>
                </div>
              </div>
            </motion.section>
          </div>

          {/* Booking Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="glass-card p-6 sticky top-28">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" /> Make a Reservation
              </h3>

              {bookingSuccess ? (
                <div className="bg-green-500/20 border border-green-500/50 text-green-300 p-4 rounded-xl text-center">
                  <div className="text-2xl mb-2">🎉</div>
                  <h4 className="font-bold mb-1">Reservation Confirmed!</h4>
                  <p className="text-sm opacity-90">Redirecting to dashboard...</p>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="space-y-5">
                  {bookingError && (
                    <div className="p-3 text-sm text-red-400 bg-red-900/20 border border-red-500/20 rounded-lg">
                      {bookingError}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                    <input 
                      type="date" 
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                      {generateTimeSlots().map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTime(t)}
                          className={`py-2 px-1 text-sm rounded-lg border transition-all ${
                            time === t 
                              ? 'bg-indigo-600 border-indigo-500 text-white' 
                              : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Guests</label>
                    <select 
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Special Requests (Optional)</label>
                    <textarea 
                      value={specialReqs}
                      onChange={(e) => setSpecialReqs(e.target.value)}
                      rows={3}
                      className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                      placeholder="e.g. Anniversary dinner, allergies..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full py-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors disabled:opacity-70 flex items-center justify-center"
                  >
                    {bookingLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : session ? (
                      'Confirm Reservation'
                    ) : (
                      'Sign in to reserve'
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
