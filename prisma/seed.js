// @ts-nocheck
/* eslint-disable */
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

async function main() {
  const prisma = new PrismaClient()

  const hashedPassword = await bcrypt.hash('password123', 10)

  await prisma.user.upsert({
    where: { email: 'admin@bookwise.com' },
    update: {},
    create: { name: 'Admin User', email: 'admin@bookwise.com', password: hashedPassword, role: 'admin' },
  })

  await prisma.user.upsert({
    where: { email: 'demo@bookwise.com' },
    update: {},
    create: { name: 'Demo User', email: 'demo@bookwise.com', password: hashedPassword, role: 'user' },
  })

  const restaurants = [
    { name: 'La Maison Dorée', cuisine: 'French', description: 'An exquisite fine dining experience with classic French cuisine reimagined for the modern palate.', address: '42 Rue de Rivoli', city: 'Paris', rating: 4.8, priceRange: '$$$', capacity: 40, openTime: '18:00', closeTime: '23:00' },
    { name: 'Sakura Garden', cuisine: 'Japanese', description: 'Authentic Japanese omakase experience with fish flown fresh from Tsukiji Market.', address: '15 Cherry Blossom Lane', city: 'Tokyo', rating: 4.9, priceRange: '$$$$', capacity: 30, openTime: '17:00', closeTime: '22:00' },
    { name: 'Trattoria Bella Vista', cuisine: 'Italian', description: 'Family-owned Italian trattoria serving handmade pasta and wood-fired pizzas.', address: '88 Via Roma', city: 'Rome', rating: 4.6, priceRange: '$$', capacity: 60, openTime: '11:00', closeTime: '23:00' },
    { name: 'The Spice Route', cuisine: 'Indian', description: 'A vibrant celebration of Indian flavors from tandoori to biryani.', address: '7 Connaught Place', city: 'New Delhi', rating: 4.5, priceRange: '$$', capacity: 80, openTime: '12:00', closeTime: '23:30' },
    { name: 'El Cielo', cuisine: 'Spanish', description: 'Avant-garde Spanish tapas with molecular gastronomy techniques.', address: '23 Las Ramblas', city: 'Barcelona', rating: 4.7, priceRange: '$$$', capacity: 45, openTime: '13:00', closeTime: '00:00' },
    { name: 'The Golden Dragon', cuisine: 'Chinese', description: 'Cantonese and Sichuan specialties in an opulent golden-themed dining room.', address: '168 Nanjing Road', city: 'Shanghai', rating: 4.4, priceRange: '$$', capacity: 100, openTime: '10:00', closeTime: '22:00' },
    { name: 'Ember & Oak', cuisine: 'American', description: 'Farm-to-table New American cuisine with craft cocktails.', address: '555 Broadway', city: 'New York', rating: 4.6, priceRange: '$$$', capacity: 55, openTime: '11:30', closeTime: '23:00' },
    { name: 'Mar Azul', cuisine: 'Seafood', description: 'Ocean-fresh seafood with Mediterranean influences overlooking the harbor.', address: '12 Marina Bay', city: 'Lisbon', rating: 4.7, priceRange: '$$$', capacity: 50, openTime: '12:00', closeTime: '22:30' },
  ]

  for (const r of restaurants) {
    await prisma.restaurant.create({ data: r })
  }

  const hotelData = [
    { name: 'The Grand Meridian', description: 'A luxurious 5-star hotel with breathtaking skyline views.', address: '1 Grand Avenue', city: 'New York', rating: 4.9, stars: 5, amenities: 'Pool,Spa,Gym,Restaurant,Bar,Concierge', rooms: [{ type: 'Deluxe King', price: 450, capacity: 2 }, { type: 'Executive Suite', price: 750, capacity: 3 }, { type: 'Presidential Suite', price: 1500, capacity: 4 }, { type: 'Standard Double', price: 280, capacity: 2 }] },
    { name: 'Azure Beach Resort', description: 'A beachfront paradise with private cabanas and water sports.', address: '100 Ocean Drive', city: 'Miami', rating: 4.7, stars: 5, amenities: 'Beach,Pool,Spa,Water Sports,Restaurant,Bar', rooms: [{ type: 'Ocean View Room', price: 380, capacity: 2 }, { type: 'Beach Villa', price: 900, capacity: 4 }, { type: 'Garden Suite', price: 520, capacity: 3 }] },
    { name: 'Alpine Lodge & Spa', description: 'Cozy mountain retreat with ski-in/ski-out access.', address: '45 Mountain Peak Road', city: 'Zurich', rating: 4.8, stars: 4, amenities: 'Spa,Ski Access,Pool,Restaurant,Sauna', rooms: [{ type: 'Mountain View Room', price: 320, capacity: 2 }, { type: 'Chalet Suite', price: 680, capacity: 4 }, { type: 'Cozy Cabin', price: 250, capacity: 2 }] },
    { name: 'The Imperial Palace Hotel', description: 'Heritage luxury hotel blending Mughal architecture with modern comforts.', address: '22 Rajpath', city: 'New Delhi', rating: 4.6, stars: 5, amenities: 'Pool,Spa,Gym,Restaurant,Bar,Butler Service', rooms: [{ type: 'Heritage Room', price: 200, capacity: 2 }, { type: 'Maharaja Suite', price: 600, capacity: 3 }, { type: 'Royal Penthouse', price: 1200, capacity: 4 }] },
    { name: 'Sakura Inn Kyoto', description: 'Traditional ryokan-style boutique hotel surrounded by bamboo groves.', address: '8 Higashiyama', city: 'Kyoto', rating: 4.8, stars: 4, amenities: 'Onsen,Garden,Tea Ceremony,Restaurant', rooms: [{ type: 'Tatami Room', price: 180, capacity: 2 }, { type: 'Garden Suite', price: 350, capacity: 3 }, { type: 'Zen Penthouse', price: 500, capacity: 2 }] },
    { name: 'Costa del Sol Resort', description: 'Mediterranean resort with infinity pools and Michelin-starred dining.', address: '5 Playa del Sol', city: 'Barcelona', rating: 4.7, stars: 5, amenities: 'Pool,Beach,Spa,Yacht,Restaurant,Tennis', rooms: [{ type: 'Sea View Room', price: 350, capacity: 2 }, { type: 'Villa Suite', price: 800, capacity: 4 }, { type: 'Penthouse Terrace', price: 1100, capacity: 3 }] },
  ]

  for (const h of hotelData) {
    const { rooms, ...hotelInfo } = h
    const hotel = await prisma.hotel.create({ data: hotelInfo })
    for (const room of rooms) {
      await prisma.room.create({ data: { ...room, hotelId: hotel.id } })
    }
  }

  console.log('Seed complete!')
  console.log('  Admin: admin@bookwise.com / password123')
  console.log('  User:  demo@bookwise.com / password123')

  await prisma.$disconnect()
}

main().catch((e) => { console.error(e); process.exit(1) })
