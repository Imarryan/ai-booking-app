import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const cuisine = searchParams.get('cuisine')

    const where: any = {}

    if (query) {
      where.OR = [
        { name: { contains: query } },
        { city: { contains: query } },
      ]
    }

    if (cuisine) {
      where.cuisine = cuisine
    }

    const restaurants = await prisma.restaurant.findMany({
      where,
      orderBy: { rating: 'desc' },
    })

    return NextResponse.json(restaurants)
  } catch (error) {
    console.error('Failed to fetch restaurants:', error)
    return NextResponse.json(
      { error: 'Failed to fetch restaurants' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const restaurant = await prisma.restaurant.create({
      data: {
        name: data.name,
        cuisine: data.cuisine,
        description: data.description,
        address: data.address,
        city: data.city,
        rating: Number(data.rating) || 0,
        priceRange: data.priceRange,
        imageUrl: data.imageUrl || '',
        capacity: Number(data.capacity) || 50,
        openTime: data.openTime || '10:00',
        closeTime: data.closeTime || '22:00',
      },
    })
    return NextResponse.json(restaurant, { status: 201 })
  } catch (error) {
    console.error('Failed to create restaurant:', error)
    return NextResponse.json(
      { error: 'Failed to create restaurant' },
      { status: 500 }
    )
  }
}
