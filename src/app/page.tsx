'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'

const IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920',
  'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1920',
  'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1920',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1920',
]

const CITIES = ['Mumbai', 'Delhi', 'Goa', 'Jaipur', 'Bangalore', 'Udaipur', 'Chennai', 'Hyderabad', 'Agra', 'Varanasi']

const STATS = [
  { n: '500+', l: 'Luxury Properties' },
  { n: '15', l: 'Cities' },
  { n: '24/7', l: 'AI Concierge' },
  { n: '98%', l: 'Happy Guests' },
]

const FEATURES = [
  { icon: '🤖', t: 'AI Concierge Aria', d: 'GPT-4 powered agent that talks, persuades and books 24/7 like a real concierge.' },
  { icon: '📱', t: 'WhatsApp Confirmation', d: 'Instant booking confirmations sent directly to your WhatsApp after every booking.' },
  { icon: '🗺️', t: 'Google Maps Verified', d: 'Every property verified with real addresses, photos and location data.' },
  { icon: '⚡', t: '2-Minute Booking', d: 'From search to confirmed booking in under 2 minutes with AI assistance.' },
  { icon: '🌟', t: '500+ Properties', d: 'Curated luxury hotels and restaurants across 15 major Indian cities.' },
  { icon: '🔒', t: 'Secure & Trusted', d: 'Bank-grade security for all your bookings and personal information.' },
]

const FALLBACK_HOTELS = [
  { name: 'Taj Mahal Palace', city: 'Mumbai', stars: 5, rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', rooms: [{ price: 25000 }] },
  { name: 'Oberoi New Delhi', city: 'Delhi', stars: 5, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', rooms: [{ price: 26000 }] },
  { name: 'Taj Exotica Goa', city: 'Goa', stars: 5, rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800', rooms: [{ price: 35000 }] },
  { name: 'Rambagh Palace', city: 'Jaipur', stars: 5, rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800', rooms: [{ price: 45000 }] },
  { name: 'Four Seasons Mumbai', city: 'Mumbai', stars: 5, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800', rooms: [{ price: 23000 }] },
  { name: 'W Goa', city: 'Goa', stars: 5, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', rooms: [{ price: 30000 }] },
]

const FALLBACK_RESTAURANTS = [
  { name: 'Wasabi by Morimoto', cuisine: 'Japanese', city: 'Mumbai', rating: 4.8, priceRange: '₹₹₹₹', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800' },
  { name: 'Trishna', cuisine: 'Seafood', city: 'Mumbai', rating: 4.8, priceRange: '₹₹₹', imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800' },
  { name: 'Bombay Canteen', cuisine: 'Modern Indian', city: 'Mumbai', rating: 4.7, priceRange: '₹₹₹', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800' },
  { name: 'The Table', cuisine: 'European', city: 'Mumbai', rating: 4.7, priceRange: '₹₹₹₹', imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800' },
  { name: 'Khyber', cuisine: 'Mughlai', city: 'Mumbai', rating: 4.6, priceRange: '₹₹₹', imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800' },
  { name: 'Bastian', cuisine: 'Seafood & Grill', city: 'Mumbai', rating: 4.6, priceRange: '₹₹₹', imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800' },
]

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HotelData = any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RestaurantData = any

const gold = '#d4af37'

export default function Home() {
  const [img, setImg] = useState(0)
  const [chat, setChat] = useState(false)
  const [msgs, setMsgs] = useState<ChatMessage[]>([
    { role: 'assistant', content: '✨ Namaste! I am Aria, your personal luxury concierge. I can find and book the perfect hotel or restaurant anywhere in India — just tell me where you want to go and when!' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [ctx] = useState({})
  const [hotels, setHotels] = useState<HotelData[]>([])
  const [restaurants, setRestaurants] = useState<RestaurantData[]>([])
  const endRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 600], [0, 200])

  useEffect(() => {
    const t = setInterval(() => setImg((p) => (p + 1) % IMAGES.length), 5000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs])

  useEffect(() => {
    fetch('/api/hotels').then((r) => r.json()).then((d) => { if (Array.isArray(d)) setHotels(d.slice(0, 6)) }).catch(() => {})
    fetch('/api/restaurants').then((r) => r.json()).then((d) => { if (Array.isArray(d)) setRestaurants(d.slice(0, 6)) }).catch(() => {})
  }, [])

  async function send() {
    if (!input.trim() || loading) return
    const text = input
    setInput('')
    setLoading(true)
    const newMsgs: ChatMessage[] = [...msgs, { role: 'user', content: text }]
    setMsgs(newMsgs)
    try {
      const res = await fetch('/api/ai-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMsgs.map((m) => ({ role: m.role, content: m.content })),
          context: ctx,
        }),
      })
      const data = await res.json()
      setMsgs((p) => [...p, { role: 'assistant', content: data.reply }])
      if (data.isConfirmed) {
        setMsgs((p) => [
          ...p,
          { role: 'assistant', content: '🎉 Booking confirmed! Check your WhatsApp for confirmation details. Our concierge will call you within 30 minutes.' },
        ])
      }
    } catch {
      setMsgs((p) => [...p, { role: 'assistant', content: 'Sorry, I had trouble connecting. Please try again.' }])
    }
    setLoading(false)
  }

  const displayHotels = hotels.length ? hotels : FALLBACK_HOTELS
  const displayRestaurants = restaurants.length ? restaurants : FALLBACK_RESTAURANTS

  return (
    <div style={{ background: '#080808', color: '#fff', fontFamily: 'Georgia, serif', overflowX: 'hidden' }}>

      {/* ========== HERO ========== */}
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        <motion.div style={{ y: heroY, position: 'absolute', inset: 0 }}>
          <AnimatePresence mode="sync">
            <motion.img
              key={img}
              src={IMAGES[img]}
              alt="Luxury hotel"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8 }}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </AnimatePresence>
        </motion.div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.6) 100%)' }} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 1.5rem' }}
        >
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ fontSize: '11px', letterSpacing: '8px', color: gold, marginBottom: '1.5rem', textTransform: 'uppercase' }}>
            AI-Powered Luxury Travel Concierge
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            style={{ fontSize: 'clamp(2.5rem, 9vw, 8rem)', fontWeight: 300, lineHeight: 1.05, marginBottom: '1.5rem', letterSpacing: '-2px' }}
          >
            India&apos;s Finest<br />
            <span style={{ color: gold, fontStyle: 'italic' }}>Hotels &amp; Dining</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            style={{ fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', color: 'rgba(255,255,255,0.75)', maxWidth: '600px', lineHeight: 1.7, marginBottom: '3rem' }}
          >
            Let Aria, our AI concierge, find your perfect stay or dining experience — and book it instantly.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <motion.button whileHover={{ scale: 1.05, background: gold, color: '#000' }} whileTap={{ scale: 0.95 }} onClick={() => setChat(true)} style={{ padding: '1rem 2.5rem', background: 'transparent', border: `1px solid ${gold}`, color: gold, fontSize: '0.85rem', letterSpacing: '4px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' }}>
              Talk to Aria
            </motion.button>
            <motion.button whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.15)' }} whileTap={{ scale: 0.95 }} onClick={() => document.getElementById('hotels')?.scrollIntoView({ behavior: 'smooth' })} style={{ padding: '1rem 2.5rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.85rem', letterSpacing: '4px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' }}>
              Explore
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 1.8 }} style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '11px', letterSpacing: '4px' }}>
          SCROLL ↓
        </motion.div>
        <div style={{ position: 'absolute', bottom: '3rem', right: '2rem', display: 'flex', gap: '6px' }}>
          {IMAGES.map((_, i) => (
            <motion.div key={i} animate={{ width: i === img ? 24 : 6, background: i === img ? gold : 'rgba(255,255,255,0.4)' }} style={{ height: 6, borderRadius: 3, cursor: 'pointer' }} onClick={() => setImg(i)} />
          ))}
        </div>
      </section>

      {/* ========== STATS ========== */}
      <section style={{ padding: '5rem 2rem', background: '#0d0d0d', borderTop: `1px solid rgba(212,175,55,0.2)` }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          {STATS.map((s, i) => (
            <motion.div key={s.l} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300, color: gold, marginBottom: '0.5rem' }}>{s.n}</div>
              <div style={{ fontSize: '12px', letterSpacing: '3px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>{s.l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========== CITIES ========== */}
      <section style={{ padding: '6rem 2rem', background: '#080808' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{ fontSize: '11px', letterSpacing: '6px', color: gold, textTransform: 'uppercase', marginBottom: '1rem' }}>Destinations</p>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300 }}>Top Indian Cities</h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', maxWidth: '1100px', margin: '0 auto' }}>
          {CITIES.map((city, i) => (
            <motion.div key={city} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} whileHover={{ scale: 1.05, borderColor: gold, background: 'rgba(212,175,55,0.08)' }} onClick={() => { setChat(true); setInput('Show hotels in ' + city) }} style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '2rem 1rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🏙️</div>
              <div style={{ fontSize: '1rem', letterSpacing: '2px', color: 'rgba(255,255,255,0.85)' }}>{city}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========== HOTELS ========== */}
      <section id="hotels" style={{ padding: '6rem 2rem', background: '#0d0d0d' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{ fontSize: '11px', letterSpacing: '6px', color: gold, textTransform: 'uppercase', marginBottom: '1rem' }}>Featured</p>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300 }}>Luxury Hotels</h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
          {displayHotels.map((h: HotelData, i: number) => {
            const lowestPrice = h.rooms?.[0]?.price || 20000
            return (
              <motion.div key={h.name} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.02 }} style={{ overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.08)' }} onClick={() => { setChat(true); setInput('I want to book ' + h.name) }}>
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                  <motion.img whileHover={{ scale: 1.08 }} transition={{ duration: 0.6 }} src={h.imageUrl || h.image} alt={h.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: gold, color: '#000', padding: '4px 10px', fontSize: '12px', fontFamily: 'sans-serif' }}>
                    {'⭐'.repeat(Math.min(h.stars || 5, 5))}
                  </div>
                </div>
                <div style={{ padding: '1.5rem', background: '#111' }}>
                  <div style={{ fontSize: '11px', color: gold, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{h.city}</div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 400, marginBottom: '0.75rem' }}>{h.name}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: gold, fontSize: '1.1rem' }}>
                      ₹{lowestPrice.toLocaleString()}
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontFamily: 'sans-serif' }}>/night</span>
                    </span>
                    <span style={{ fontSize: '13px', fontFamily: 'sans-serif', color: 'rgba(255,255,255,0.6)' }}>★ {h.rating || 4.8}</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ========== RESTAURANTS ========== */}
      <section style={{ padding: '6rem 2rem', background: '#080808' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{ fontSize: '11px', letterSpacing: '6px', color: gold, textTransform: 'uppercase', marginBottom: '1rem' }}>Culinary Experiences</p>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300 }}>Finest Restaurants</h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
          {displayRestaurants.map((r: RestaurantData, i: number) => (
            <motion.div key={r.name} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.02 }} style={{ overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.08)' }} onClick={() => { setChat(true); setInput('I want to book a table at ' + r.name) }}>
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                <motion.img whileHover={{ scale: 1.08 }} transition={{ duration: 0.6 }} src={r.imageUrl || r.image} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: '1.5rem 1rem 0.75rem' }}>
                  <div style={{ fontSize: '11px', color: gold, letterSpacing: '2px', textTransform: 'uppercase' }}>{r.cuisine}</div>
                </div>
              </div>
              <div style={{ padding: '1.25rem', background: '#111' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 400, marginBottom: '0.5rem' }}>{r.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'sans-serif', fontSize: '13px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>{r.city}</span>
                  <span style={{ color: gold }}>★ {r.rating} · {r.priceRange}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section style={{ padding: '6rem 2rem', background: 'linear-gradient(135deg, #0d0d0d, #111)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {FEATURES.map((f, i) => (
            <motion.div key={f.t} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ borderColor: gold, background: 'rgba(212,175,55,0.05)' }} style={{ border: '1px solid rgba(255,255,255,0.08)', padding: '2rem', transition: 'all 0.3s' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{f.icon}</div>
              <h3 style={{ color: gold, fontSize: '1rem', letterSpacing: '1px', marginBottom: '0.75rem', fontFamily: 'sans-serif', fontWeight: 500 }}>{f.t}</h3>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', fontFamily: 'sans-serif', lineHeight: 1.7 }}>{f.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer style={{ padding: '3rem 2rem', borderTop: `1px solid rgba(212,175,55,0.2)`, textAlign: 'center', background: '#050505' }}>
        <div style={{ color: gold, fontSize: '1.5rem', letterSpacing: '4px', marginBottom: '1rem' }}>LUXSTAY INDIA</div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', fontFamily: 'sans-serif' }}>AI-Powered Luxury Travel · India&apos;s finest hotels and restaurants</p>
      </footer>

      {/* ========== CHAT WIDGET ========== */}
      <AnimatePresence>
        {chat && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', damping: 25 }}
            style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: '380px', maxWidth: 'calc(100vw - 2rem)', height: '580px', background: '#0f0f0f', border: `1px solid ${gold}`, display: 'flex', flexDirection: 'column', zIndex: 1000, boxShadow: '0 20px 80px rgba(212,175,55,0.15)' }}
          >
            {/* Header */}
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <motion.div
                animate={{ boxShadow: ['0 0 0px rgba(212,175,55,0.4)', '0 0 20px rgba(212,175,55,0.4)', '0 0 0px rgba(212,175,55,0.4)'] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{ width: '38px', height: '38px', borderRadius: '50%', background: `linear-gradient(135deg, ${gold}, #8b6914)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}
              >
                ✨
              </motion.div>
              <div>
                <div style={{ fontWeight: 500, fontSize: '14px', fontFamily: 'sans-serif' }}>Aria</div>
                <div style={{ fontSize: '11px', color: gold, fontFamily: 'sans-serif' }}>● AI Concierge · Online 24/7</div>
              </div>
              <button onClick={() => setChat(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '22px', cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {msgs.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '82%',
                    padding: '10px 14px',
                    borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: m.role === 'user' ? gold : 'rgba(255,255,255,0.07)',
                    color: m.role === 'user' ? '#000' : '#fff',
                    fontSize: '13px',
                    fontFamily: 'sans-serif',
                    lineHeight: 1.55,
                  }}
                >
                  {m.content}
                </motion.div>
              ))}
              {loading && (
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  style={{ alignSelf: 'flex-start', padding: '10px 14px', background: 'rgba(255,255,255,0.07)', borderRadius: '18px', fontSize: '13px', color: gold, fontFamily: 'sans-serif' }}
                >
                  Aria is thinking...
                </motion.div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '8px' }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Ask Aria anything..."
                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 14px', color: '#fff', fontSize: '13px', fontFamily: 'sans-serif', outline: 'none', borderRadius: '24px' }}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={send}
                style={{ width: '40px', height: '40px', borderRadius: '50%', background: gold, border: 'none', cursor: 'pointer', fontSize: '16px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ➤
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating chat button */}
      {!chat && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setChat(true)}
          style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: '62px', height: '62px', borderRadius: '50%', background: `linear-gradient(135deg, ${gold}, #8b6914)`, border: 'none', cursor: 'pointer', fontSize: '26px', zIndex: 999, boxShadow: '0 4px 30px rgba(212,175,55,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          ✨
        </motion.button>
      )}
    </div>
  )
}
