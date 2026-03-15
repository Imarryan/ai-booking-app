'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/Card'
import SearchBar from '@/components/SearchBar'
import { Hotel, Loader2 } from 'lucide-react'

export default function HotelsPage() {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchHotels = async () => {
    setLoading(true)
    try {
      let url = '/api/hotels'
      if (searchQuery) {
        url += `?q=${encodeURIComponent(searchQuery)}`
      }
      const res = await fetch(url)
      const data = await res.json()
      setHotels(data)
    } catch (error) {
      console.error('Failed to fetch hotels')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHotels()
  }, [])

  const handleSearch = () => {
    fetchHotels()
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-gradient-to-b from-purple-900/40 to-black/0 pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/20 text-purple-400 mb-2">
            <Hotel className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Luxury Stays Worldwide
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Find the perfect accommodation for your next getaway, from boutique hotels to 5-star resorts.
          </p>
          
          <div className="mt-8">
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              placeholder="Search by hotel name or city..."
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : hotels.length > 0 ? (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {hotels.map((h: any) => (
              <motion.div variants={item} key={h.id}>
                <Card item={h} type="hotel" />
                <div className="mt-2 text-right text-sm text-gray-400 pr-2">
                  From <span className="text-white font-bold text-lg">${h.minPrice}</span> / night
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 glass-card max-w-md mx-auto">
            <Hotel className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No hotels found</h3>
            <p className="text-gray-400">Try adjusting your search query.</p>
          </div>
        )}
      </div>
    </div>
  )
}
