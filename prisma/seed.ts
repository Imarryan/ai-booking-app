import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create demo users
  const hashedPassword = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@bookwise.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@bookwise.com',
      password: hashedPassword,
      role: 'admin',
    },
  })

  const user = await prisma.user.upsert({
    where: { email: 'demo@bookwise.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@bookwise.com',
      password: hashedPassword,
      role: 'user',
    },
  })

  // Restaurants
  const restaurants = [
    { name: 'La Maison Dorée', cuisine: 'French', description: 'An exquisite fine dining experience with classic French cuisine, featuring dishes crafted from organic seasonal ingredients by Michelin-starred chefs.', address: '42 Rue de Rivoli', city: 'Paris', rating: 4.8, priceRange: '$$$', capacity: 40, openTime: '18:00', closeTime: '23:00', imageUrl: '/images/restaurant-1.jpg' },
    { name: 'Sakura Garden', cuisine: 'Japanese', description: 'Authentic Japanese omakase experience with fish flown fresh from Tsukiji Market. Each dish is a work of art.', address: '15 Cherry Blossom Lane', city: 'Tokyo', rating: 4.9, priceRange: '$$$$', capacity: 30, openTime: '17:00', closeTime: '22:00', imageUrl: '/images/restaurant-2.jpg' },
    { name: 'Trattoria Bella Vista', cuisine: 'Italian', description: 'Family-owned Italian trattoria serving handmade pasta and wood-fired pizzas with panoramic terrace views.', address: '88 Via Roma', city: 'Rome', rating: 4.6, priceRange: '$$', capacity: 60, openTime: '11:00', closeTime: '23:00', imageUrl: '/images/restaurant-3.jpg' },
    { name: 'Spice Palace', cuisine: 'Indian', description: 'A vibrant culinary journey through India with aromatic curries, tandoori specialties, and handcrafted naan baked in traditional clay ovens.', address: '7 Connaught Circus', city: 'New Delhi', rating: 4.7, priceRange: '$$', capacity: 80, openTime: '12:00', closeTime: '23:00', imageUrl: '/images/restaurant-4.jpg' },
    { name: 'El Sabor de Barcelona', cuisine: 'Spanish', description: 'Tapas bar and grill serving authentic Spanish cuisine with an extensive selection of house-made sangria and Catalonian wines.', address: '22 La Rambla', city: 'Barcelona', rating: 4.5, priceRange: '$$', capacity: 55, openTime: '13:00', closeTime: '00:00', imageUrl: '/images/restaurant-5.jpg' },
    { name: 'The Golden Dragon', cuisine: 'Chinese', description: 'Cantonese dim sum house with handcrafted dumplings prepared live by master chefs. Known for its legendary Peking duck.', address: '188 Nanjing Road', city: 'Shanghai', rating: 4.6, priceRange: '$$$', capacity: 100, openTime: '10:00', closeTime: '22:00', imageUrl: '/images/restaurant-6.jpg' },
    { name: 'The Smoke House', cuisine: 'American', description: 'Award-winning BBQ restaurant with slow-smoked meats, craft cocktails, and live jazz on weekends.', address: '550 Broadway', city: 'New York', rating: 4.4, priceRange: '$$', capacity: 70, openTime: '11:00', closeTime: '23:30', imageUrl: '/images/restaurant-7.jpg' },
    { name: 'Neptune\'s Table', cuisine: 'Seafood', description: 'Oceanfront fine dining featuring the freshest catches of the day, with a raw bar and signature lobster dishes.', address: '1 Ocean Pier', city: 'Lisbon', rating: 4.8, priceRange: '$$$$', capacity: 45, openTime: '12:00', closeTime: '22:00', imageUrl: '/images/restaurant-8.jpg' },
  ]

  for (const r of restaurants) {
    const existing = await prisma.restaurant.findFirst({ where: { name: r.name } })
    if (!existing) {
      await prisma.restaurant.create({ data: r })
    }
  }

  // Hotels
  const hotelData = [
    {
      name: 'The Grand Meridian',
      description: 'A luxurious 5-star hotel with breathtaking skyline views, infinity pool, and world-class spa. Located in the heart of Manhattan.',
      address: '1 Grand Avenue',
      city: 'New York',
      rating: 4.9,
      stars: 5,
      amenities: 'Pool,Spa,Gym,Restaurant,Bar,Concierge,Valet,Room Service',
      imageUrl: '/images/hotel-1.jpg',
      rooms: [
        { type: 'Deluxe King', price: 450, capacity: 2, imageUrl: '/images/room-1.jpg' },
        { type: 'Executive Suite', price: 750, capacity: 3, imageUrl: '/images/room-2.jpg' },
        { type: 'Presidential Suite', price: 1500, capacity: 4, imageUrl: '/images/room-3.jpg' },
      ],
    },
    {
      name: 'Azure Beach Resort',
      description: 'A beachfront paradise with private cabanas, water sports, and a sprawling infinity pool overlooking the Atlantic Ocean.',
      address: '100 Ocean Drive',
      city: 'Miami',
      rating: 4.7,
      stars: 5,
      amenities: 'Beach,Pool,Spa,Water Sports,Restaurant,Bar,Kids Club',
      imageUrl: '/images/hotel-2.jpg',
      rooms: [
        { type: 'Ocean View Room', price: 380, capacity: 2, imageUrl: '/images/room-5.jpg' },
        { type: 'Beach Villa', price: 900, capacity: 4, imageUrl: '/images/room-6.jpg' },
        { type: 'Garden Suite', price: 520, capacity: 3, imageUrl: '/images/room-7.jpg' },
      ],
    },
    {
      name: 'Le Palais Royal',
      description: 'An elegant Parisian palace hotel near the Champs-Élysées, blending 18th-century grandeur with contemporary luxury and Michelin-starred dining.',
      address: '15 Avenue Montaigne',
      city: 'Paris',
      rating: 4.8,
      stars: 5,
      amenities: 'Spa,Restaurant,Bar,Concierge,Room Service,Garden,Library',
      imageUrl: '/images/hotel-3.jpg',
      rooms: [
        { type: 'Classic Room', price: 350, capacity: 2, imageUrl: '/images/room-8.jpg' },
        { type: 'Junior Suite', price: 600, capacity: 2, imageUrl: '/images/room-9.jpg' },
        { type: 'Royal Suite', price: 1200, capacity: 4, imageUrl: '/images/room-10.jpg' },
      ],
    },
    {
      name: 'Sakura Ryokan',
      description: 'A serene Japanese ryokan blending traditional aesthetics with modern comfort. Features private onsen baths and kaiseki dining.',
      address: '8 Kiyomizu Lane',
      city: 'Kyoto',
      rating: 4.9,
      stars: 4,
      amenities: 'Onsen,Tea Room,Garden,Restaurant,Meditation Room,Yukata',
      imageUrl: '/images/hotel-4.jpg',
      rooms: [
        { type: 'Tatami Room', price: 280, capacity: 2, imageUrl: '/images/room-11.jpg' },
        { type: 'Garden View Suite', price: 450, capacity: 3, imageUrl: '/images/room-12.jpg' },
        { type: 'Imperial Suite', price: 800, capacity: 4, imageUrl: '/images/room-13.jpg' },
      ],
    },
    {
      name: 'Alpine Grand Resort',
      description: 'A pristine mountain retreat in the Swiss Alps with panoramic glacier views, world-class skiing access, and a luxury thermal spa.',
      address: '42 Bahnhofstrasse',
      city: 'Zurich',
      rating: 4.8,
      stars: 5,
      amenities: 'Ski Access,Spa,Pool,Restaurant,Bar,Fireplace Lounge,Helipad',
      imageUrl: '/images/hotel-5.jpg',
      rooms: [
        { type: 'Mountain View Room', price: 420, capacity: 2, imageUrl: '/images/room-14.jpg' },
        { type: 'Chalet Suite', price: 780, capacity: 4, imageUrl: '/images/room-15.jpg' },
        { type: 'Penthouse Suite', price: 1800, capacity: 6, imageUrl: '/images/room-16.jpg' },
      ],
    },
  ]

  for (const h of hotelData) {
    const existing = await prisma.hotel.findFirst({ where: { name: h.name } })
    if (!existing) {
      const { rooms, ...hotelInfo } = h
      const hotel = await prisma.hotel.create({ data: hotelInfo })
      for (const room of rooms) {
        await prisma.room.create({
          data: { ...room, hotelId: hotel.id },
        })
      }
    }
  }

  console.log('✅ Seed complete!')
  console.log(`  Admin: admin@bookwise.com / password123`)
  console.log(`  User:  demo@bookwise.com / password123`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
