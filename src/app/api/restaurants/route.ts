import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const FALLBACK_RESTAURANTS = [
  { id: "r1", name: "Wasabi by Morimoto", city: "Mumbai", cuisine: "Japanese", rating: 4.8, priceRange: "₹₹₹₹", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800", description: "Iron Chef Morimoto's authentic Japanese cuisine.", address: "Taj Mahal Palace, Colaba, Mumbai", phone: "+91-22-6665-3366", openHours: "12:30PM–11:45PM", mapUrl: "https://maps.google.com/?q=Wasabi+Morimoto+Mumbai" },
  { id: "r2", name: "Trishna", city: "Mumbai", cuisine: "Coastal Seafood", rating: 4.8, priceRange: "₹₹₹", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800", description: "Mumbai's most celebrated seafood restaurant since 1981.", address: "Kala Ghoda, Fort, Mumbai", phone: "+91-22-2270-3213", openHours: "12PM–11:45PM", mapUrl: "https://maps.google.com/?q=Trishna+Mumbai" },
  { id: "r3", name: "Indian Accent", city: "Delhi", cuisine: "Contemporary Indian", rating: 4.9, priceRange: "₹₹₹₹", image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800", description: "Asia's best restaurant — redefining Indian cuisine.", address: "The Lodhi Hotel, Lodhi Road, Delhi", phone: "+91-11-2436-3636", openHours: "12:30PM–10:30PM", mapUrl: "https://maps.google.com/?q=Indian+Accent+Delhi" },
  { id: "r4", name: "Bukhara", city: "Delhi", cuisine: "North West Frontier", rating: 4.9, priceRange: "₹₹₹₹", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800", description: "Where US Presidents dine — legendary dal Bukhara since 1977.", address: "ITC Maurya, Sardar Patel Marg, Delhi", phone: "+91-11-2611-2233", openHours: "12:30PM–11:45PM", mapUrl: "https://maps.google.com/?q=Bukhara+Delhi" },
  { id: "r5", name: "Bombay Canteen", city: "Mumbai", cuisine: "Modern Indian", rating: 4.7, priceRange: "₹₹₹", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800", description: "A love letter to India's regional cuisines, reimagined.", address: "Kamala Mills, Lower Parel, Mumbai", phone: "+91-22-4966-6666", openHours: "12PM–1AM", mapUrl: "https://maps.google.com/?q=Bombay+Canteen+Mumbai" },
  { id: "r6", name: "The Table", city: "Mumbai", cuisine: "European", rating: 4.7, priceRange: "₹₹₹₹", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800", description: "Farm-to-table European cuisine in Colaba.", address: "Apollo Bunder, Colaba, Mumbai", phone: "+91-22-2282-5000", openHours: "12:30PM–11PM", mapUrl: "https://maps.google.com/?q=The+Table+Mumbai" },
  { id: "r7", name: "Karavalli", city: "Bangalore", cuisine: "Coastal Karnataka", rating: 4.8, priceRange: "₹₹₹", image: "https://images.unsplash.com/photo-1552566626-52f8b828329f?w=800", description: "Award-winning coastal cuisine in heritage bungalow.", address: "Gateway Hotel, Residency Road, Bangalore", phone: "+91-80-6660-4545", openHours: "12:30PM–11PM", mapUrl: "https://maps.google.com/?q=Karavalli+Bangalore" },
  { id: "r8", name: "Avartana", city: "Chennai", cuisine: "Contemporary South Indian", rating: 4.9, priceRange: "₹₹₹₹", image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800", description: "Innovative South Indian tasting menu — India's finest.", address: "ITC Grand Chola, Mount Road, Chennai", phone: "+91-44-2220-0000", openHours: "7PM–11PM", mapUrl: "https://maps.google.com/?q=Avartana+Chennai" },
  { id: "r9", name: "Masala Library", city: "Mumbai", cuisine: "Molecular Indian", rating: 4.7, priceRange: "₹₹₹₹", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800", description: "Molecular gastronomy meets Indian cuisine.", address: "BKC, Bandra East, Mumbai", phone: "+91-22-6654-2222", openHours: "12PM–3PM, 7PM–11PM", mapUrl: "https://maps.google.com/?q=Masala+Library+Mumbai" },
  { id: "r10", name: "Olive Bar & Kitchen", city: "Delhi", cuisine: "Mediterranean", rating: 4.6, priceRange: "₹₹₹", image: "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800", description: "Mediterranean in a stunning colonial bungalow.", address: "Mehrauli, New Delhi", phone: "+91-11-2957-4444", openHours: "12:30PM–11:30PM", mapUrl: "https://maps.google.com/?q=Olive+Bar+Kitchen+Delhi" },
  { id: "r11", name: "Bastian", city: "Mumbai", cuisine: "Seafood & Grill", rating: 4.6, priceRange: "₹₹₹", image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800", description: "Trendy seafood spot in Bandra with fresh daily catches.", address: "Linking Road, Bandra West, Mumbai", phone: "+91-22-2600-2222", openHours: "12:30PM–12AM", mapUrl: "https://maps.google.com/?q=Bastian+Mumbai" },
  { id: "r12", name: "Peshwari", city: "Delhi", cuisine: "North Indian", rating: 4.7, priceRange: "₹₹₹", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800", description: "Authentic North West Frontier cuisine with tandoor specialties.", address: "ITC Maurya Hotel, Delhi", phone: "+91-11-2611-2233", openHours: "7PM–11:45PM", mapUrl: "https://maps.google.com/?q=Peshwari+Delhi" },
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const query = searchParams.get("q");
    const cuisine = searchParams.get("cuisine");

    const where: Record<string, unknown> = {};
    if (city) {
      where.city = { contains: city };
    }
    if (query) {
      where.OR = [
        { name: { contains: query } },
        { city: { contains: query } },
      ];
    }
    if (cuisine) {
      where.cuisine = cuisine;
    }

    const restaurants = await prisma.restaurant.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: { rating: "desc" },
    });

    if (restaurants && restaurants.length > 0) {
      // Map Prisma data to include extra fields for the frontend
      const mapped = restaurants.map((r) => ({
        ...r,
        image: r.imageUrl || "",
        openHours: `${r.openTime}–${r.closeTime}`,
      }));
      return NextResponse.json(mapped);
    }

    // Fallback to hardcoded data
    let filtered = FALLBACK_RESTAURANTS;
    if (city) {
      filtered = filtered.filter((r) => r.city.toLowerCase().includes(city.toLowerCase()));
    }
    if (query) {
      filtered = filtered.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()) || r.city.toLowerCase().includes(query.toLowerCase()));
    }
    if (cuisine) {
      filtered = filtered.filter((r) => r.cuisine.toLowerCase().includes(cuisine.toLowerCase()));
    }
    return NextResponse.json(filtered);
  } catch {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const filtered = city
      ? FALLBACK_RESTAURANTS.filter((r) => r.city.toLowerCase().includes(city.toLowerCase()))
      : FALLBACK_RESTAURANTS;
    return NextResponse.json(filtered);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const restaurant = await prisma.restaurant.create({
      data: {
        name: data.name,
        cuisine: data.cuisine,
        description: data.description,
        address: data.address,
        city: data.city,
        rating: Number(data.rating) || 0,
        priceRange: data.priceRange,
        imageUrl: data.imageUrl || "",
        capacity: Number(data.capacity) || 50,
        openTime: data.openTime || "10:00",
        closeTime: data.closeTime || "22:00",
      },
    });
    return NextResponse.json(restaurant, { status: 201 });
  } catch (error) {
    console.error("Failed to create restaurant:", error);
    return NextResponse.json({ error: "Failed to create restaurant" }, { status: 500 });
  }
}
