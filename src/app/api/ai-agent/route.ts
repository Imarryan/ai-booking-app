import OpenAI from 'openai'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY || '' })
}

export async function POST(req: Request) {
  try {
    const { message, sessionId, context } = await req.json()

    const hotels = await prisma.hotel.findMany({
      take: 15,
      include: { rooms: true },
    })
    const restaurants = await prisma.restaurant.findMany({ take: 15 })

    const systemPrompt = `You are Aria, a luxury AI concierge for India's finest hotels and restaurants booking platform. You are charming, knowledgeable, persuasive and helpful.

Your job:
- Help customers find and book the perfect hotel or restaurant in India
- Persuade customers by highlighting unique features, deals, and experiences
- Collect: name, phone number, email, check-in/out dates, number of guests
- Once you have all details, confirm the booking and include the text BOOKING_CONFIRMED in your response
- Be warm, elegant and conversational like a 5-star concierge

Available Hotels: ${JSON.stringify(hotels.map(h => ({ name: h.name, city: h.city, rating: h.rating, stars: h.stars, rooms: h.rooms.map(r => ({ type: r.type, price: r.price })) })))}
Available Restaurants: ${JSON.stringify(restaurants.map(r => ({ name: r.name, city: r.city, cuisine: r.cuisine, rating: r.rating, priceRange: r.priceRange })))}

Current booking context: ${JSON.stringify(context || {})}`

    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      temperature: 0.8,
      max_tokens: 500,
    })

    const reply = completion.choices[0].message.content
    const isConfirmed = reply?.includes('BOOKING_CONFIRMED') || false

    return NextResponse.json({ reply, isConfirmed })
  } catch (error: unknown) {
    console.error('AI Agent error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { reply: 'I apologize, I\'m having a moment. Could you please try again?', isConfirmed: false, error: errorMessage },
      { status: 500 }
    )
  }
}
