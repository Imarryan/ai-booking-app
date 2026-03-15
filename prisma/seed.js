const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Indian hotels and restaurants...')

  // ===== HOTELS =====
  const hotelsData = [
    { name: 'Taj Mahal Palace', stars: 5, description: 'Iconic luxury hotel overlooking the Gateway of India.', address: 'Apollo Bunder, Colaba, Mumbai', city: 'Mumbai', rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', amenities: 'Pool,Spa,WiFi,Restaurant,Bar', rooms: [
      { type: 'Luxury Suite', price: 25000, capacity: 2 },
      { type: 'Deluxe Room', price: 18000, capacity: 2 },
      { type: 'Superior Room', price: 12000, capacity: 2 }
    ]},
    { name: 'The Oberoi Mumbai', stars: 5, description: 'Luxury hotel with stunning Arabian Sea views.', address: 'Nariman Point, Mumbai', city: 'Mumbai', rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', amenities: 'Pool,Spa,WiFi,Restaurant', rooms: [
      { type: 'Premier Suite', price: 22000, capacity: 2 },
      { type: 'Deluxe Room', price: 15000, capacity: 2 }
    ]},
    { name: 'ITC Grand Central', stars: 5, description: 'Grand luxury hotel in the heart of Mumbai.', address: 'Dr Babasaheb Ambedkar Road, Parel, Mumbai', city: 'Mumbai', rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', amenities: 'Pool,WiFi,Restaurant,Gym', rooms: [
      { type: 'Executive Suite', price: 18000, capacity: 2 },
      { type: 'Deluxe Room', price: 12000, capacity: 2 }
    ]},
    { name: 'JW Marriott Mumbai', stars: 5, description: 'Beachfront luxury hotel in Juhu.', address: 'Juhu Tara Road, Juhu, Mumbai', city: 'Mumbai', rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', amenities: 'Pool,Spa,WiFi,Restaurant', rooms: [
      { type: 'Ocean View Suite', price: 20000, capacity: 2 },
      { type: 'Deluxe Room', price: 14000, capacity: 2 }
    ]},
    { name: 'The Leela Palace Delhi', stars: 5, description: 'Ultra-luxury palace hotel in the diplomatic enclave.', address: 'Chanakyapuri, New Delhi', city: 'Delhi', rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', amenities: 'Pool,Spa,WiFi,Restaurant,Bar,Gym', rooms: [
      { type: 'Royal Suite', price: 30000, capacity: 2 },
      { type: 'Premier Room', price: 20000, capacity: 2 },
      { type: 'Deluxe Room', price: 15000, capacity: 2 }
    ]},
    { name: 'The Imperial Delhi', stars: 5, description: 'Heritage luxury hotel on Janpath since 1931.', address: 'Janpath, Connaught Place, New Delhi', city: 'Delhi', rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800', amenities: 'Pool,Spa,WiFi,Restaurant,Bar', rooms: [
      { type: 'Heritage Suite', price: 25000, capacity: 2 },
      { type: 'Deluxe Room', price: 16000, capacity: 2 }
    ]},
    { name: 'ITC Maurya Delhi', stars: 5, description: 'Iconic luxury hotel famous for Bukhara restaurant.', address: 'Diplomatic Enclave, Sardar Patel Marg, Delhi', city: 'Delhi', rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800', amenities: 'Pool,Spa,WiFi,Restaurant,Gym', rooms: [
      { type: 'Towers Suite', price: 22000, capacity: 2 },
      { type: 'Executive Room', price: 14000, capacity: 2 }
    ]},
    { name: 'Taj Bangalore', stars: 5, description: 'Premium luxury in the garden city of India.', address: 'MG Road, Bangalore', city: 'Bangalore', rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', amenities: 'Pool,WiFi,Restaurant,Bar', rooms: [
      { type: 'Luxury Suite', price: 18000, capacity: 2 },
      { type: 'Superior Room', price: 10000, capacity: 2 }
    ]},
    { name: 'ITC Grand Chola Chennai', stars: 5, description: 'Majestic luxury inspired by the great Chola dynasty.', address: 'Guindy, Chennai', city: 'Chennai', rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800', amenities: 'Pool,Spa,WiFi,Restaurant,Gym', rooms: [
      { type: 'Grand Suite', price: 20000, capacity: 2 },
      { type: 'Executive Room', price: 12000, capacity: 2 }
    ]},
    { name: 'Taj Lake Palace Udaipur', stars: 5, description: 'Floating marble palace on Lake Pichola.', address: 'Lake Pichola, Udaipur', city: 'Udaipur', rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800', amenities: 'Pool,Spa,WiFi,Restaurant,Bar,Boat', rooms: [
      { type: 'Palace Suite', price: 35000, capacity: 2 },
      { type: 'Luxury Room', price: 22000, capacity: 2 }
    ]},
    { name: 'The Oberoi Udaivilas', stars: 5, description: 'Award-winning luxury resort on the banks of Lake Pichola.', address: 'Haridasji Ki Magri, Udaipur', city: 'Udaipur', rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', amenities: 'Pool,Spa,WiFi,Restaurant,Bar', rooms: [
      { type: 'Kohinoor Suite', price: 40000, capacity: 2 },
      { type: 'Premier Room', price: 25000, capacity: 2 }
    ]},
    { name: 'Taj Fort Aguada Goa', stars: 5, description: 'Stunning resort within a 16th-century Portuguese fort.', address: 'Sinquerim, Bardez, Goa', city: 'Goa', rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', amenities: 'Pool,Beach,Spa,WiFi,Restaurant,Bar', rooms: [
      { type: 'Sea View Suite', price: 22000, capacity: 2 },
      { type: 'Premium Room', price: 14000, capacity: 2 }
    ]},
    { name: 'W Goa', stars: 5, description: 'Trendy beachside luxury retreat in North Goa.', address: 'Vagator Beach, Bardez, Goa', city: 'Goa', rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', amenities: 'Pool,Beach,Spa,WiFi,Restaurant,Bar,DJ', rooms: [
      { type: 'Marvelous Suite', price: 28000, capacity: 2 },
      { type: 'Wonderful Room', price: 16000, capacity: 2 }
    ]},
    { name: 'Rambagh Palace Jaipur', stars: 5, description: 'Former residence of the Maharaja of Jaipur, now a luxury hotel.', address: 'Bhawani Singh Road, Jaipur', city: 'Jaipur', rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800', amenities: 'Pool,Spa,WiFi,Restaurant,Bar,Garden', rooms: [
      { type: 'Royal Suite', price: 45000, capacity: 2 },
      { type: 'Palace Room', price: 25000, capacity: 2 }
    ]},
    { name: 'Wildflower Hall Shimla', stars: 5, description: 'Oberoi luxury resort nestled in the Himalayas.', address: 'Chharabra, Shimla', city: 'Shimla', rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', amenities: 'Spa,WiFi,Restaurant,Trekking,Yoga', rooms: [
      { type: 'Deluxe Suite', price: 30000, capacity: 2 },
      { type: 'Premier Room', price: 18000, capacity: 2 }
    ]},
  ]

  for (const hotel of hotelsData) {
    const { rooms, ...hotelData } = hotel
    const created = await prisma.hotel.upsert({
      where: { id: hotelData.name.toLowerCase().replace(/\s+/g, '-') },
      update: hotelData,
      create: { ...hotelData }
    })
    console.log('✅ Hotel:', created.name)

    for (const room of rooms) {
      await prisma.room.create({
        data: { ...room, hotelId: created.id, imageUrl: hotelData.imageUrl }
      })
      console.log('   🛏️ Room:', room.type, '- ₹' + room.price)
    }
  }

  // ===== RESTAURANTS =====
  const restaurantsData = [
    { name: 'Wasabi by Morimoto', cuisine: 'Japanese', rating: 4.8, priceRange: '₹₹₹₹', address: 'Taj Mahal Palace, Colaba, Mumbai', city: 'Mumbai', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800', description: 'World-class Japanese cuisine by Iron Chef Morimoto.', capacity: 40 },
    { name: 'Trishna', cuisine: 'Seafood', rating: 4.7, priceRange: '₹₹₹', address: 'Kala Ghoda, Fort, Mumbai', city: 'Mumbai', imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800', description: 'Legendary seafood restaurant since 1981.', capacity: 60 },
    { name: 'Bombay Canteen', cuisine: 'Indian Modern', rating: 4.6, priceRange: '₹₹₹', address: 'Process House, Kamala Mills, Mumbai', city: 'Mumbai', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', description: 'Modern Indian food celebrating regional flavours.', capacity: 80 },
    { name: 'Khyber', cuisine: 'Mughlai', rating: 4.5, priceRange: '₹₹₹', address: 'MG Road, Kala Ghoda, Fort, Mumbai', city: 'Mumbai', imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828329f?w=800', description: 'Iconic North Indian restaurant since 1958.', capacity: 70 },
    { name: 'Indian Accent Mumbai', cuisine: 'Contemporary Indian', rating: 4.8, priceRange: '₹₹₹₹', address: 'The Lodhi, Mumbai', city: 'Mumbai', imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', description: 'Award-winning contemporary Indian dining.', capacity: 50 },
    { name: 'Bukhara', cuisine: 'North Indian', rating: 4.9, priceRange: '₹₹₹₹', address: 'ITC Maurya, Sardar Patel Marg, Delhi', city: 'Delhi', imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800', description: 'World-famous dal Bukhara and tandoori cuisine.', capacity: 60 },
    { name: 'Indian Accent Delhi', cuisine: 'Contemporary Indian', rating: 4.9, priceRange: '₹₹₹₹', address: 'The Lodhi Hotel, New Delhi', city: 'Delhi', imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', description: 'Asia\'s 50 Best — inventive Indian cuisine.', capacity: 45 },
    { name: 'Karim\'s', cuisine: 'Mughlai', rating: 4.6, priceRange: '₹₹', address: 'Jama Masjid, Old Delhi', city: 'Delhi', imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800', description: 'Legendary Mughlai food since 1913, near Jama Masjid.', capacity: 100 },
    { name: 'SodaBottleOpenerWala', cuisine: 'Parsi', rating: 4.4, priceRange: '₹₹', address: 'Khan Market, New Delhi', city: 'Delhi', imageUrl: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800', description: 'Fun Irani cafe serving Parsi comfort food.', capacity: 55 },
    { name: 'Vidyarthi Bhavan', cuisine: 'South Indian', rating: 4.7, priceRange: '₹', address: 'Gandhi Bazaar, Basavanagudi, Bangalore', city: 'Bangalore', imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800', description: 'Legendary dosa joint since 1943.', capacity: 80 },
    { name: 'Karavalli', cuisine: 'Coastal Indian', rating: 4.6, priceRange: '₹₹₹', address: 'The Gateway Hotel, Residency Road, Bangalore', city: 'Bangalore', imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800', description: 'Award-winning coastal cuisine from Karnataka, Kerala and Goa.', capacity: 60 },
    { name: 'Dakshin', cuisine: 'South Indian', rating: 4.7, priceRange: '₹₹₹', address: 'ITC Grand Chola, Guindy, Chennai', city: 'Chennai', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', description: 'Exquisite South Indian fine dining.', capacity: 50 },
    { name: 'Gunpowder Goa', cuisine: 'South Indian', rating: 4.5, priceRange: '₹₹', address: 'Assagao, North Goa', city: 'Goa', imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828329f?w=800', description: 'Rustic Kerala & Andhra home-style cooking in a charming setting.', capacity: 40 },
    { name: 'Suvarna Mahal', cuisine: 'Royal Indian', rating: 4.8, priceRange: '₹₹₹₹', address: 'Rambagh Palace, Jaipur', city: 'Jaipur', imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', description: 'Royal dining in a gilded palace ballroom.', capacity: 40 },
    { name: 'Bademiya', cuisine: 'Street Food', rating: 4.3, priceRange: '₹', address: 'Tulloch Road, Behind Taj Hotel, Colaba, Mumbai', city: 'Mumbai', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800', description: 'Mumbai\'s most famous late-night kebab stall since 1946.', capacity: 30 },
  ]

  for (const restaurant of restaurantsData) {
    const created = await prisma.restaurant.upsert({
      where: { id: restaurant.name.toLowerCase().replace(/\s+/g, '-') },
      update: restaurant,
      create: { ...restaurant }
    })
    console.log('✅ Restaurant:', created.name)
  }

  console.log('\n🎉 All Indian hotels & restaurants seeded successfully!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
