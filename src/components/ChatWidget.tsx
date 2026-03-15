'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageSquareHeart, X, Send, Hotel, UtensilsCrossed, ArrowRight, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  actions?: any[]
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'welcome', 
      role: 'assistant', 
      content: 'Hi! I am the BookWise AI Assistant. Tell me what kind of hotel or restaurant you are looking for today.' 
    }
  ])
  const [isTyping, setIsTyping] = useState(false)
  
  // To store fetched suggestions for dynamic cards
  const [suggestions, setSuggestions] = useState<Record<string, any[]>>({})

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, suggestions])

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const fetchSuggestions = async (actionId: string, type: 'restaurants' | 'hotels', params: any) => {
    try {
      let url = `/api/${type}`
      const searchParams = new URLSearchParams()
      if (params.q) searchParams.append('q', params.q)
      if (params.cuisine) searchParams.append('cuisine', params.cuisine)
      
      if (searchParams.toString()) url += `?${searchParams.toString()}`

      const res = await fetch(url)
      const data = await res.json()
      
      setSuggestions((prev: Record<string, any[]>) => ({ ...prev, [actionId]: data.slice(0, 3) })) // Just take top 3
    } catch (error) {
      console.error(error)
    }
  }

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || isTyping) return

    const userMsg = input.trim()
    setInput('')
    
    // Add user message
    const newMsg: Message = { id: Date.now().toString(), role: 'user', content: userMsg }
    setMessages((prev: Message[]) => [...prev, newMsg])
    
    setIsTyping(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      })

      if (res.ok) {
        const { actions } = await res.json()
        
        const assistantId = Date.now().toString()
        const assistantMsg: Message = { 
          id: assistantId, 
          role: 'assistant', 
          content: actions[0]?.content || 'Here is what I found.',
          actions: actions.slice(1) // Action cards like suggest_restaurants
        }
        
        setMessages((prev: Message[]) => [...prev, assistantMsg])

        // Fetch data for action cards if present
        assistantMsg.actions?.forEach((action: any) => {
          if (action.type === 'suggest_restaurants') {
            fetchSuggestions(`res-${assistantId}`, 'restaurants', action.data.searchParams)
          } else if (action.type === 'suggest_hotels') {
            fetchSuggestions(`hot-${assistantId}`, 'hotels', action.data.searchParams)
          }
        })
      }
    } catch (error) {
      setMessages((prev: Message[]) => [...prev, { 
        id: Date.now().toString(), 
        role: 'assistant', 
        content: 'Sorry, I am having trouble connecting to my brain right now. Try again later!' 
      }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-110 transition-transform group"
          >
            <MessageSquareHeart className="w-7 h-7" />
            <span className="absolute right-full mr-4 bg-black/80 backdrop-blur-md text-white text-sm px-4 py-2 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 shadow-xl pointer-events-none">
              Chat with AI
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] sm:w-[420px] max-w-[calc(100vw-32px)] h-[600px] max-h-[calc(100vh-100px)] flex flex-col glass-card border-white/20 shadow-2xl bg-black/80 backdrop-blur-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-purple-900/40 to-pink-900/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white">
                  <MessageSquareHeart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white leading-tight">BookWise AI</h3>
                  <span className="text-xs text-green-400 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    Online
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg: Message) => (
                <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {/* Text Bubble */}
                  <div className={`max-w-[85%] rounded-2xl p-3 shadow-lg ${
                    msg.role === 'user' 
                      ? 'bg-purple-600 text-white rounded-br-none' 
                      : 'bg-white/10 text-gray-100 border border-white/10 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>

                  {/* Action Cards (if assistant returned structured data) */}
                  {msg.actions && msg.actions.map((action: any, idx: number) => {
                    const actionId = (action.type === 'suggest_restaurants' ? 'res-' : 'hot-') + msg.id
                    const items = suggestions[actionId]

                    if (!items) return (
                      <div key={idx} className="w-full mt-2 pl-2">
                        <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                      </div>
                    )

                    return (
                      <div key={idx} className="w-full max-w-[90%] mt-3 space-y-2">
                        {items.length === 0 ? (
                          <div className="text-sm text-gray-400 italic">I couldn't find any matching options.</div>
                        ) : (
                          items.map((item: any) => (
                            <Link 
                              key={item.id} 
                              href={`/${action.type === 'suggest_restaurants' ? 'restaurants' : 'hotels'}/${item.id}`}
                              onClick={() => setIsOpen(false)}
                              className="block p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                            >
                              <div className="flex gap-3 items-center">
                                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-800">
                                  {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                                      {action.type === 'suggest_restaurants' ? <UtensilsCrossed size={20} /> : <Hotel size={20} />}
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-white text-sm truncate group-hover:text-purple-400 transition-colors">{item.name}</h4>
                                  <p className="text-xs text-gray-400 flex justify-between">
                                    <span>★ {item.rating}</span>
                                    <span>{item.city}</span>
                                  </p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-purple-400 shrink-0" />
                              </div>
                            </Link>
                          ))
                        )}
                        {items.length > 0 && (
                          <Link 
                            href={`/${action.type === 'suggest_restaurants' ? 'restaurants' : 'hotels'}`}
                            onClick={() => setIsOpen(false)}
                            className="block text-center text-xs font-medium text-purple-400 hover:text-purple-300 mt-2"
                          >
                            View more results
                          </Link>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start">
                  <div className="bg-white/10 border border-white/10 rounded-2xl rounded-tl-none p-4 shadow-lg flex gap-1 items-center">
                    <motion.div className="w-2 h-2 rounded-full bg-purple-400" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0 }} />
                    <motion.div className="w-2 h-2 rounded-full bg-purple-400" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} />
                    <motion.div className="w-2 h-2 rounded-full bg-purple-400" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-black/40">
              <form onSubmit={handleSend} className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask for reservations..."
                  className="w-full bg-white/5 border border-white/10 rounded-full pl-5 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/10 transition-all text-sm"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute inset-y-1 right-1 w-10 h-10 flex items-center justify-center rounded-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:hover:bg-purple-600 text-white transition-colors"
                >
                  <Send className="w-4 h-4 ml-1" />
                </button>
              </form>
              <div className="text-center mt-2">
                <span className="text-[10px] text-gray-500 font-medium">AI can make mistakes. Verify details before booking.</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
