'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1920',
]

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Goa', 'Jaipur', 'Udaipur', 'Chennai', 'Shimla']

const FEATURES = [
  { icon: '🤖', title: 'AI Concierge', desc: 'Aria, our AI agent, talks with you 24/7 to find the perfect stay or dining experience.' },
  { icon: '📱', title: 'WhatsApp Confirmation', desc: 'Get instant booking confirmations directly on your WhatsApp.' },
  { icon: '📞', title: 'AI Voice Calls', desc: 'Our AI can call you to confirm bookings and answer questions.' },
  { icon: '🏨', title: '500+ Properties', desc: 'Top hotels and restaurants across 15 major Indian cities.' },
  { icon: '⚡', title: 'Instant Booking', desc: 'Book any hotel or restaurant in under 2 minutes.' },
  { icon: '🌟', title: '5-Star Service', desc: 'Every interaction is handled with luxury concierge standards.' },
]

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export default function HomePage() {
  const [currentImg, setCurrentImg] = useState(0)
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: '✨ Hello! I am Aria, your personal luxury concierge. I can help you find and book the perfect hotel or restaurant anywhere in India. Where would you like to go?' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [context] = useState({})
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    if (!input.trim()) return
    const userMsg = input
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const res = await fetch('/api/ai-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, sessionId: 'sess_' + Date.now(), context }),
      })
      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
      if (data.isConfirmed) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: '🎉 Your booking is confirmed! Check your WhatsApp for confirmation details.' },
        ])
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'I apologize, something went wrong. Please try again.' },
      ])
    }
    setLoading(false)
  }

  return (
    <main style={{ fontFamily: "'Inter', Georgia, serif", background: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
      {/* HERO SECTION */}
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        <AnimatePresence>
          <motion.img
            key={currentImg}
            src={HERO_IMAGES[currentImg]}
            alt="Luxury hotel"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AnimatePresence>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))' }} />

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '0 2rem' }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ fontSize: '14px', letterSpacing: '6px', color: '#d4af37', marginBottom: '1rem', textTransform: 'uppercase' }}
          >
            AI-Powered Luxury Concierge
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', fontWeight: '300', lineHeight: 1.1, marginBottom: '2rem', letterSpacing: '-2px' }}
          >
            Discover India&apos;s<br />
            <span style={{ color: '#d4af37', fontStyle: 'italic' }}>Finest Stays</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', marginBottom: '3rem', maxWidth: '600px' }}
          >
            Let our AI concierge Aria find and book the perfect hotel or restaurant for you — instantly.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#d4af37', color: '#000' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChatOpen(true)}
            style={{ padding: '1rem 3rem', background: 'transparent', border: '1px solid #d4af37', color: '#d4af37', fontSize: '1rem', letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' }}
          >
            Talk to Aria
          </motion.button>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.5)', fontSize: '12px', letterSpacing: '3px', textAlign: 'center' }}
        >
          SCROLL<br />↓
        </motion.div>
      </section>

      {/* CITIES SECTION */}
      <section style={{ padding: '6rem 2rem', background: '#0f0f0f' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <p style={{ color: '#d4af37', letterSpacing: '5px', fontSize: '12px', textTransform: 'uppercase', marginBottom: '1rem' }}>Explore</p>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: '300' }}>Top Destinations</h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
          {CITIES.map((city, i) => (
            <motion.div
              key={city}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05, borderColor: '#d4af37' }}
              style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '2rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s', borderRadius: '4px' }}
              onClick={() => {
                setChatOpen(true)
                setInput('Show me hotels in ' + city)
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏙️</div>
              <div style={{ fontSize: '1.1rem', letterSpacing: '2px' }}>{city}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section style={{ padding: '6rem 2rem', background: '#0a0a0a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ borderColor: '#d4af37' }}
              style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '4px', transition: 'all 0.3s' }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '400', marginBottom: '0.5rem', color: '#d4af37' }}>{f.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI CHAT WIDGET */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: '380px', height: '560px', background: '#111', border: '1px solid #d4af37', borderRadius: '8px', display: 'flex', flexDirection: 'column', zIndex: 1000, boxShadow: '0 0 60px rgba(212,175,55,0.2)' }}
          >
            {/* Chat header */}
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37, #a07830)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                ✨
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '15px' }}>Aria</div>
                <div style={{ fontSize: '12px', color: '#d4af37' }}>● AI Concierge — Online</div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '20px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.role === 'user' ? '#d4af37' : 'rgba(255,255,255,0.08)',
                    color: msg.role === 'user' ? '#000' : '#fff',
                    fontSize: '14px',
                    lineHeight: 1.5,
                  }}
                >
                  {msg.content}
                </motion.div>
              ))}
              {loading && (
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  style={{ alignSelf: 'flex-start', padding: '10px 14px', background: 'rgba(255,255,255,0.08)', borderRadius: '18px', fontSize: '14px', color: '#d4af37' }}
                >
                  Aria is thinking...
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '8px' }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask Aria anything..."
                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '10px 16px', color: '#fff', fontSize: '14px', outline: 'none' }}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={sendMessage}
                style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#d4af37', border: 'none', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ➤
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating chat button */}
      {!chatOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setChatOpen(true)}
          style={{ position: 'fixed', bottom: '2rem', right: '2rem', width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37, #a07830)', border: 'none', cursor: 'pointer', fontSize: '28px', zIndex: 1000, boxShadow: '0 4px 30px rgba(212,175,55,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          ✨
        </motion.button>
      )}
    </main>
  )
}
