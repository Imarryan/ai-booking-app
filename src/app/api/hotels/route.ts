import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const FALLBACK_HOTELS = [
  { id: "f1", name: "Taj Mahal Palace", city: "Mumbai", stars: 5, price: 25000, rating: 4.9, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800", description: "Iconic landmark since 1903 overlooking Gateway of India.", amenities: '["Pool","Spa","WiFi","Restaurant","Bar","Butler"]', address: "Apollo Bunder, Colaba, Mumbai", phone: "+91-22-6665-3366", mapUrl: "https://maps.google.com/?q=Taj+Mahal+Palace+Mumbai" },
  { id: "f2", name: "The Oberoi Mumbai", city: "Mumbai", stars: 5, price: 22000, rating: 4.8, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800", description: "Stunning Arabian Sea views from Nariman Point.", amenities: '["Pool","Spa","WiFi","Restaurant","Butler"]', address: "Nariman Point, Mumbai", phone: "+91-22-6632-5757", mapUrl: "https://maps.google.com/?q=Oberoi+Mumbai" },
  { id: "f3", name: "Four Seasons Mumbai", city: "Mumbai", stars: 5, price: 23000, rating: 4.8, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800", description: "34 stories of panoramic city and sea views.", amenities: '["Pool","Spa","WiFi","Restaurant","Gym"]', address: "Dr E Moses Road, Worli, Mumbai", phone: "+91-22-2481-8000", mapUrl: "https://maps.google.com/?q=Four+Seasons+Mumbai" },
  { id: "f4", name: "The Imperial New Delhi", city: "Delhi", stars: 5, price: 28000, rating: 4.9, image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800", description: "1931 colonial landmark — a window into Indian heritage.", amenities: '["Pool","Spa","WiFi","Restaurant","Art Gallery"]', address: "Janpath, New Delhi", phone: "+91-11-2334-1234", mapUrl: "https://maps.google.com/?q=Imperial+Hotel+New+Delhi" },
  { id: "f5", name: "The Leela Palace Delhi", city: "Delhi", stars: 5, price: 30000, rating: 4.9, image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800", description: "Classical Indian grandeur with Rolls Royce transfers.", amenities: '["Pool","Spa","WiFi","Restaurant","Butler","Rolls Royce"]', address: "Chanakyapuri, New Delhi", phone: "+91-11-3933-1234", mapUrl: "https://maps.google.com/?q=Leela+Palace+Delhi" },
  { id: "f6", name: "ITC Maurya Delhi", city: "Delhi", stars: 5, price: 22000, rating: 4.8, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800", description: "Where world leaders stay. Home of legendary Bukhara.", amenities: '["Pool","Spa","WiFi","Bukhara","Dum Pukht"]', address: "Sardar Patel Marg, Delhi", phone: "+91-11-2611-2233", mapUrl: "https://maps.google.com/?q=ITC+Maurya+Delhi" },
  { id: "f7", name: "Taj Exotica Goa", city: "Goa", stars: 5, price: 35000, rating: 4.9, image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800", description: "56-acre private beach resort in South Goa.", amenities: '["Private Beach","Pool","Spa","WiFi","Watersports"]', address: "Benaulim Beach, South Goa", phone: "+91-832-668-3333", mapUrl: "https://maps.google.com/?q=Taj+Exotica+Goa" },
  { id: "f8", name: "W Goa", city: "Goa", stars: 5, price: 30000, rating: 4.8, image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800", description: "Clifftop infinity pool above Vagator Beach.", amenities: '["Infinity Pool","Spa","WiFi","Beach Club","Nightlife"]', address: "Vagator Beach, North Goa", phone: "+91-832-671-8888", mapUrl: "https://maps.google.com/?q=W+Goa+Hotel" },
  { id: "f9", name: "Rambagh Palace", city: "Jaipur", stars: 5, price: 45000, rating: 4.9, image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800", description: "Former Maharaja residence — the jewel of Jaipur.", amenities: '["Pool","Spa","WiFi","Restaurant","Polo","Royal Gardens"]', address: "Bhawani Singh Road, Jaipur", phone: "+91-141-221-1919", mapUrl: "https://maps.google.com/?q=Rambagh+Palace+Jaipur" },
  { id: "f10", name: "Oberoi Rajvilas", city: "Jaipur", stars: 5, price: 50000, rating: 4.9, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800", description: "Royal tents, elephant rides, 250-year-old Shiva temple.", amenities: '["Pool","Spa","WiFi","Royal Tents","Elephant Rides"]', address: "Goner Road, Jaipur", phone: "+91-141-268-0101", mapUrl: "https://maps.google.com/?q=Oberoi+Rajvilas+Jaipur" },
  { id: "f11", name: "ITC Grand Chola", city: "Chennai", stars: 5, price: 20000, rating: 4.8, image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800", description: "Inspired by the grandeur of the Chola dynasty.", amenities: '["Pool","Spa","WiFi","Restaurant","Business Center"]', address: "Mount Road, Chennai", phone: "+91-44-2220-0000", mapUrl: "https://maps.google.com/?q=ITC+Grand+Chola+Chennai" },
  { id: "f12", name: "Taj Falaknuma Palace", city: "Hyderabad", stars: 5, price: 40000, rating: 4.9, image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800", description: "The Nizam's palace perched on a hill above Hyderabad.", amenities: '["Pool","Spa","WiFi","Royal Dining","Horse Carriages"]', address: "Falaknuma, Hyderabad", phone: "+91-40-6629-8585", mapUrl: "https://maps.google.com/?q=Taj+Falaknuma+Palace+Hyderabad" },
  { id: "f13", name: "Wildflower Hall", city: "Shimla", stars: 5, price: 35000, rating: 4.9, image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800", description: "Cedar forest at 8250 feet with breathtaking Himalayan views.", amenities: '["Spa","WiFi","Restaurant","Hiking","Snow Activities"]', address: "Chharabra, Shimla", phone: "+91-177-264-8585", mapUrl: "https://maps.google.com/?q=Wildflower+Hall+Shimla" },
  { id: "f14", name: "The Leela Kovalam", city: "Kochi", stars: 5, price: 28000, rating: 4.8, image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800", description: "Clifftop palace overlooking the Arabian Sea in Kerala.", amenities: '["Pool","Spa","WiFi","Ayurveda","Beach"]', address: "Kovalam Beach, Kerala", phone: "+91-471-305-1234", mapUrl: "https://maps.google.com/?q=Leela+Kovalam+Kerala" },
  { id: "f15", name: "Alila Fort Bishangarh", city: "Jaipur", stars: 5, price: 38000, rating: 4.8, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800", description: "230-year-old hilltop fort transformed into a luxury resort.", amenities: '["Pool","Spa","WiFi","Heritage Walks","Stargazing"]', address: "Bishangarh Village, Rajasthan", phone: "+91-1423-234567", mapUrl: "https://maps.google.com/?q=Alila+Fort+Bishangarh" },
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const query = searchParams.get("q");

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

    const hotels = await prisma.hotel.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: { rating: "desc" },
      include: { rooms: { select: { price: true } } },
    });

    if (hotels && hotels.length > 0) {
      // Map Prisma data to include price from rooms and extra fields for the frontend
      const mapped = hotels.map((h) => {
        const minPrice = h.rooms.length > 0 ? Math.min(...h.rooms.map((r) => r.price)) : 20000;
        return { ...h, price: minPrice, image: h.imageUrl || "", minPrice };
      });
      return NextResponse.json(mapped);
    }

    // Fallback to hardcoded data
    const filtered = city
      ? FALLBACK_HOTELS.filter((h) => h.city.toLowerCase().includes(city.toLowerCase()))
      : query
        ? FALLBACK_HOTELS.filter((h) => h.name.toLowerCase().includes(query.toLowerCase()) || h.city.toLowerCase().includes(query.toLowerCase()))
        : FALLBACK_HOTELS;
    return NextResponse.json(filtered);
  } catch {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const filtered = city
      ? FALLBACK_HOTELS.filter((h) => h.city.toLowerCase().includes(city.toLowerCase()))
      : FALLBACK_HOTELS;
    return NextResponse.json(filtered);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const hotel = await prisma.hotel.create({
      data: {
        name: data.name,
        description: data.description,
        address: data.address,
        city: data.city,
        rating: Number(data.rating) || 0,
        stars: Number(data.stars) || 3,
        imageUrl: data.imageUrl || "",
        amenities: data.amenities || "",
      },
    });
    return NextResponse.json(hotel, { status: 201 });
  } catch (error) {
    console.error("Failed to create hotel:", error);
    return NextResponse.json({ error: "Failed to create hotel" }, { status: 500 });
  }
}
