'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Star, MapPin, Calendar, Check, Loader2, BedDouble } from 'lucide-react'

import { use } from 'react'

export default function HotelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const id = resolvedParams.id
  const router = useRouter()
  const { data: session } = useSession()
  
  const [hotel, setHotel] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  // Booking state
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [guests, setGuests] = useState(2)
  const [specialReqs, setSpecialReqs] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(false)

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await fetch(`/api/hotels/${id}`)
        if (res.ok) {
          const data = await res.json()
          setHotel(data)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchHotel()
  }, [id])

  // Calculate days difference
  const calcDays = () => {
    if (!checkIn || !checkOut) return 0
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const days = calcDays()

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session) {
      router.push('/login')
      return
    }

    if (!checkIn || !checkOut || !selectedRoom) {
      setBookingError('Please select dates and a room')
      return
    }
    
    if (days <= 0) {
      setBookingError('Check-out date must be after check-in date')
      return
    }

    setBookingLoading(true)
    setBookingError('')

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'hotel',
          hotelId: id,
          roomId: selectedRoom.id,
          checkIn: new Date(checkIn).toISOString(),
          checkOut: new Date(checkOut).toISOString(),
          guests,
          specialReqs,
          totalPrice: selectedRoom.price * days,
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
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-400">
        Hotel not found
      </div>
    )
  }

  const amenitiesList = hotel.amenities ? hotel.amenities.split(',') : []

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Banner */}
      <div className="h-[45vh] w-full relative bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        {hotel.imageUrl && (
          <img 
            src={hotel.imageUrl} 
            alt={hotel.name} 
            className="w-full h-full object-cover" 
          />
        )}
        <div className="absolute inset-0 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="flex text-yellow-400">
              {[...Array(hotel.stars)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <span className="px-3 py-1 text-sm font-semibold glass text-white rounded-full flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              {hotel.rating}
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-4 tracking-tight"
          >
            {hotel.name}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 text-gray-300 text-lg"
          >
            <MapPin className="w-5 h-5 text-purple-400" />
            {hotel.address}, {hotel.city}
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
              <h2 className="text-2xl font-bold text-white mb-4">About the Property</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                {hotel.description}
              </p>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Premium Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenitiesList.map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 text-gray-300 bg-white/5 border border-white/10 p-4 rounded-xl">
                    <Check className="w-5 h-5 text-purple-400" />
                    {feature.trim()}
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <BedDouble className="w-6 h-6 text-purple-400" /> Select your room
              </h2>
              <div className="space-y-4">
                {hotel.rooms.map((room: any) => (
                  <div 
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                      selectedRoom?.id === room.id 
                        ? 'bg-purple-900/30 border-purple-500 shadow-lg shadow-purple-500/20' 
                        : 'glass-card border-transparent hover:border-purple-500/50'
                    }`}
                  >
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{room.type}</h3>
                      <p className="text-gray-400 text-sm">Up to {room.capacity} guests</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">${room.price}</div>
                      <div className="text-gray-400 text-sm">per night</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Booking Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="glass-card p-6 sticky top-28">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-purple-400" /> Reserve Stay
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Check-in</label>
                      <input 
                        type="date" 
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Check-out</label>
                      <input 
                        type="date" 
                        required
                        min={checkIn || new Date().toISOString().split('T')[0]}
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Guests</label>
                    <select 
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none appearance-none"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Adult' : 'Adults'}</option>
                      ))}
                    </select>
                  </div>

                  {selectedRoom ? (
                    <div className="p-4 bg-purple-900/10 border border-purple-500/30 rounded-xl">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-300">{selectedRoom.type}</span>
                        <span className="text-white">${selectedRoom.price} / night</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-white/10">
                        <span className="text-white">Total ({days > 0 ? days : 0} nights)</span>
                        <span className="text-purple-400">
                          ${selectedRoom.price * (days > 0 ? days : 0)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center text-sm text-gray-400">
                      Please select a room to see total price
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full py-4 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors disabled:opacity-70 flex items-center justify-center mt-6"
                  >
                    {bookingLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : session ? (
                      'Complete Booking'
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
