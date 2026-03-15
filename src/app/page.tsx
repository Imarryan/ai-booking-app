'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, UtensilsCrossed, Hotel, MessageSquareHeart } from 'lucide-react'

export default function Home() {
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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl text-center mt-20"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-purple-300 mb-8 blur-0">
          <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
          AI-Powered Bookings are here
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Book your perfect stay.<br />
          <span className="text-gradient">Simply by asking.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          BookWise combines premium curations with an intelligent AI assistant that understands exactly what you're looking for. Try it today.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/restaurants" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-bold text-base hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
            Explore Restaurants
          </Link>
          <Link href="/hotels" className="w-full sm:w-auto px-8 py-4 rounded-full glass font-bold text-base hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
            Browse Hotels
          </Link>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid md:grid-cols-3 gap-6 max-w-6xl w-full mt-32 mb-20"
      >
        <motion.div variants={item} className="glass-card p-8 group">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-white">Fine Dining</h3>
          <p className="text-gray-400 leading-relaxed mb-6">
            Discover Michelin-starred restaurants, hidden gems, and exclusive culinary experiences reserved for our members.
          </p>
          <Link href="/restaurants" className="text-indigo-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            Find tables <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <motion.div variants={item} className="glass-card p-8 group">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Hotel className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-white">Luxury Stays</h3>
          <p className="text-gray-400 leading-relaxed mb-6">
            From beachfront villas to urban penthouses. View real-time availability and secure your luxury accommodation instantly.
          </p>
          <Link href="/hotels" className="text-purple-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            Find rooms <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <motion.div variants={item} className="glass-card p-8 group">
          <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <MessageSquareHeart className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-3 text-white">AI Assistant</h3>
          <p className="text-gray-400 leading-relaxed mb-6">
            Don't want to browse? Just click the chat bubble and tell our AI what you want. "Find me a romantic Italian place for two at 8PM."
          </p>
          <button className="text-pink-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
            Try chat <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}
