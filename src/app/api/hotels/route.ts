import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    const where: any = {}

    if (query) {
      where.OR = [
        { name: { contains: query } },
        { city: { contains: query } },
      ]
    }

    const hotels = await prisma.hotel.findMany({
      where,
      orderBy: { rating: 'desc' },
      include: {
        rooms: {
          select: { price: true }
        }
      }
    })

    // Add min price
    const hotelsWithMinPrice = hotels.map(hotel => {
      const minPrice = hotel.rooms.length > 0 
        ? Math.min(...hotel.rooms.map((r: any) => r.price))
        : null
      return { ...hotel, minPrice }
    })

    return NextResponse.json(hotelsWithMinPrice)
  } catch (error) {
    console.error('Failed to fetch hotels:', error)
    return NextResponse.json({ error: 'Failed to fetch hotels' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const hotel = await prisma.hotel.create({
      data: {
        name: data.name,
        description: data.description,
        address: data.address,
        city: data.city,
        rating: Number(data.rating) || 0,
        stars: Number(data.stars) || 3,
        imageUrl: data.imageUrl || '',
        amenities: data.amenities || '',
      },
    })
    return NextResponse.json(hotel, { status: 201 })
  } catch (error) {
    console.error('Failed to create hotel:', error)
    return NextResponse.json(
      { error: 'Failed to create hotel' },
      { status: 500 }
    )
  }
}
