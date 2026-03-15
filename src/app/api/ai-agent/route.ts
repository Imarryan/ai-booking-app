import OpenAI from 'openai'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' })
}

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json()

    const hotels = await prisma.hotel.findMany({ take: 40, include: { rooms: true } })
    const restaurants = await prisma.restaurant.findMany({ take: 20 })

    const systemPrompt = `You are Aria, the world's most charming AI luxury travel concierge for India's finest hotels and restaurants. You speak with warmth, sophistication and genuine enthusiasm.

YOUR PERSONALITY:
- Elegant, persuasive, knowledgeable like a 5-star concierge
- You remember everything the customer tells you
- You proactively suggest upgrades and special experiences
- You create urgency naturally ("Only 2 rooms left this weekend!")
- You paint vivid pictures of experiences ("Imagine waking up to the Arabian Sea...")

YOUR GOALS:
1. Understand what the customer wants (city, dates, budget, occasion)
2. Recommend the PERFECT hotel or restaurant with enthusiasm
3. Collect: full name, phone number, email, dates, guests count
4. Once you have ALL details → confirm booking → say [BOOKING_CONFIRMED]
5. Tell them WhatsApp confirmation is being sent

AVAILABLE HOTELS: ${JSON.stringify(hotels.map(h => ({
  name: h.name, city: h.city, stars: h.stars, rating: h.rating, amenities: h.amenities,
  rooms: h.rooms.map(r => ({ type: r.type, price: r.price }))
})))}

AVAILABLE RESTAURANTS: ${JSON.stringify(restaurants.map(r => ({
  name: r.name, city: r.city, cuisine: r.cuisine, rating: r.rating, priceRange: r.priceRange
})))}

BOOKING CONTEXT SO FAR: ${JSON.stringify(context || {})}

RULES:
- Never be robotic. Always be conversational and warm.
- Use emojis sparingly but effectively
- If they seem hesitant, address their concerns and persuade gently
- Always confirm the booking summary before finalizing
- When showing prices, always show room types and their per-night prices`

    const chatMessages = Array.isArray(messages)
      ? [{ role: 'system' as const, content: systemPrompt }, ...messages]
      : [{ role: 'system' as const, content: systemPrompt }, { role: 'user' as const, content: String(messages || '') }]

    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4',
      messages: chatMessages,
      temperature: 0.85,
      max_tokens: 600,
    })

    const reply = completion.choices[0].message.content || ''
    const isConfirmed = reply.includes('[BOOKING_CONFIRMED]')

    return NextResponse.json({
      reply: reply.replace('[BOOKING_CONFIRMED]', ''),
      isConfirmed,
    })
  } catch (error: unknown) {
    console.error('AI Agent error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { reply: 'I apologize, I\'m having a moment. Could you please try again?', isConfirmed: false, error: errorMessage },
      { status: 500 }
    )
  }
}
