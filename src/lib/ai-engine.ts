/**
 * A mock AI engine that uses basic rule-based pattern matching (NLU) 
 * instead of requiring an expensive OpenAI API key.
 * It simulates an LLM parsing user intentions and returning structured tool calls.
 */

// Types of structured actions the AI can return
export type AIAction = {
  type: 'text' | 'suggest_restaurants' | 'suggest_hotels' | 'booking_action'
  content: string
  data?: any
}

// Simple intent matcher keywords
const RESTAURANT_KEYWORDS = ['restaurant', 'food', 'eat', 'dinner', 'lunch', 'dining', 'table', 'cuisine']
const HOTEL_KEYWORDS = ['hotel', 'stay', 'room', 'resort', 'accommodation', 'sleep', 'book a room']
const LOCATION_KEYWORDS = ['paris', 'tokyo', 'rome', 'new delhi', 'barcelona', 'shanghai', 'new york', 'lisbon', 'miami', 'zurich', 'kyoto']
const CUISINE_KEYWORDS = ['french', 'japanese', 'italian', 'indian', 'spanish', 'chinese', 'american', 'seafood']

export async function processChat(message: string): Promise<AIAction[]> {
  const lowerMsg = message.toLowerCase()
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms))
  
  // Simulate network/thinking delay
  await delay(1000 + Math.random() * 1000)

  // 1. Detect if looking for Hotels
  const isHotel = HOTEL_KEYWORDS.some(k => lowerMsg.includes(k))
  if (isHotel) {
    const city = LOCATION_KEYWORDS.find(c => lowerMsg.includes(c))
    
    let content = "I can certainly help you find a great place to stay!"
    if (city) content += ` Here are some top-rated hotels in ${city.charAt(0).toUpperCase() + city.slice(1)}.`
    else content += " Here are some of our most popular luxury destinations."

    return [
      { type: 'text', content },
      { 
        type: 'suggest_hotels', 
        content: 'I recommend these options:',
        data: { searchParams: city ? { q: city } : {} } 
      }
    ]
  }

  // 2. Detect if looking for Restaurants
  const isCuisine = CUISINE_KEYWORDS.find(c => lowerMsg.includes(c))
  const isRestaurant = RESTAURANT_KEYWORDS.some(k => lowerMsg.includes(k)) || !!isCuisine
  
  if (isRestaurant) {
    const city = LOCATION_KEYWORDS.find(c => lowerMsg.includes(c))
    
    let content = "I'd love to help you find a table."
    if (isCuisine) content += ` Searching for the best ${isCuisine} cuisine.`
    if (city) content += ` Looking in ${city.charAt(0).toUpperCase() + city.slice(1)}.`

    const params: any = {}
    if (isCuisine) params.cuisine = isCuisine.charAt(0).toUpperCase() + isCuisine.slice(1)
    if (city) params.q = city

    return [
      { type: 'text', content },
      { 
        type: 'suggest_restaurants', 
        content: 'Check out these highly rated restaurants:',
        data: { searchParams: params } 
      }
    ]
  }

  // 3. Greeting / Unknown intent
  if (lowerMsg.includes('hi') || lowerMsg.includes('hello') || lowerMsg.includes('hey')) {
    return [
      { type: 'text', content: "Hello! I'm your BookWise AI assistant. I can help you find and book premium restaurants and luxury hotels. What are you looking for today?" }
    ]
  }

  // Default fallback
  return [
    { type: 'text', content: "I'm not quite sure I understand. Try asking me to 'find a French restaurant in Paris' or 'book a luxury hotel in New York'." }
  ]
}
