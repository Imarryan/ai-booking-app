import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const restaurantImages: Record<string, string> = {
    'La Maison Dorée': '/images/restaurant-1.jpg',
    'Sakura Garden': '/images/restaurant-2.jpg',
    'Trattoria Bella Vista': '/images/restaurant-3.jpg',
  }

  for (const [name, imageUrl] of Object.entries(restaurantImages)) {
    const updated = await prisma.restaurant.updateMany({
      where: { name },
      data: { imageUrl },
    })
    console.log(`Updated restaurant ${name}: ${updated.count} records`)
  }

  const hotelImages: Record<string, string> = {
    'The Grand Meridian': '/images/hotel-1.jpg',
    'Azure Beach Resort': '/images/hotel-2.jpg',
  }

  for (const [name, imageUrl] of Object.entries(hotelImages)) {
    const updated = await prisma.hotel.updateMany({
      where: { name },
      data: { imageUrl },
    })
    console.log(`Updated hotel ${name}: ${updated.count} records`)
  }

  // Update rooms
  const grandMeridian = await prisma.hotel.findFirst({ where: { name: 'The Grand Meridian' }, include: { rooms: true } })
  if (grandMeridian) {
    const roomImages = ['/images/room-1.jpg', '/images/room-2.jpg', '/images/room-3.jpg']
    for (let i = 0; i < grandMeridian.rooms.length; i++) {
      await prisma.room.update({
        where: { id: grandMeridian.rooms[i].id },
        data: { imageUrl: roomImages[i % roomImages.length] },
      })
    }
    console.log(`Updated ${grandMeridian.rooms.length} rooms for Grand Meridian`)
  }

  const azure = await prisma.hotel.findFirst({ where: { name: 'Azure Beach Resort' }, include: { rooms: true } })
  if (azure) {
    const roomImages = ['/images/room-5.jpg', '/images/room-6.jpg', '/images/room-7.jpg']
    for (let i = 0; i < azure.rooms.length; i++) {
      await prisma.room.update({
        where: { id: azure.rooms[i].id },
        data: { imageUrl: roomImages[i % roomImages.length] },
      })
    }
    console.log(`Updated ${azure.rooms.length} rooms for Azure Beach Resort`)
  }

  console.log('✅ Image URLs updated!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
