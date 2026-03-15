import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const restaurant = await prisma.restaurant.findUnique({
      where: { id },
    })

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
    }

    return NextResponse.json(restaurant)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch restaurant' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Delete related bookings first, then the restaurant
    await prisma.booking.deleteMany({ where: { restaurantId: id } })
    await prisma.restaurant.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete restaurant' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    const restaurant = await prisma.restaurant.update({
      where: { id },
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

    return NextResponse.json(restaurant)
  } catch (error) {
    console.error('Failed to update restaurant:', error)
    return NextResponse.json(
      { error: 'Failed to update restaurant' },
      { status: 500 }
    )
  }
}
