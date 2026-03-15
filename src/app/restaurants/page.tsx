'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/Card'
import SearchBar from '@/components/SearchBar'
import { UtensilsCrossed, Loader2 } from 'lucide-react'

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCuisine, setSelectedCuisine] = useState('')

  const cuisines = ['All', 'French', 'Japanese', 'Italian', 'Indian', 'Spanish', 'Chinese', 'American', 'Seafood']

  const fetchRestaurants = async () => {
    setLoading(true)
    try {
      let url = '/api/restaurants'
      const params = new URLSearchParams()
      if (searchQuery) params.append('q', searchQuery)
      if (selectedCuisine && selectedCuisine !== 'All') params.append('cuisine', selectedCuisine)
      
      if (params.toString()) url += `?${params.toString()}`

      const res = await fetch(url)
      const data = await res.json()
      setRestaurants(data)
    } catch (error) {
      console.error('Failed to fetch restaurants')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRestaurants()
  }, [selectedCuisine]) // Refetch when cuisine changes

  const handleSearch = () => {
    fetchRestaurants()
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
      {/* Header */}
      <div className="bg-gradient-to-b from-indigo-900/40 to-black/0 pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 mb-2">
            <UtensilsCrossed className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Curated Dining Experiences
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Discover and book tables at the city's most exclusive and highly-rated restaurants.
          </p>
          
          <div className="mt-8">
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              placeholder="Search by restaurant name or city..."
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {cuisines.map(c => (
              <button
                key={c}
                onClick={() => setSelectedCuisine(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  (selectedCuisine === c || (c === 'All' && !selectedCuisine))
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : restaurants.length > 0 ? (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {restaurants.map((r: any) => (
              <motion.div variants={item} key={r.id}>
                <Card item={r} type="restaurant" />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 glass-card max-w-md mx-auto">
            <UtensilsCrossed className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No restaurants found</h3>
            <p className="text-gray-400">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  )
}
