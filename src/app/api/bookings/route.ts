import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const data = await request.json()
    
    // Validate hotel room availability if type is hotel
    if (data.type === 'hotel' && data.roomId) {
      const room = await prisma.room.findUnique({ where: { id: data.roomId } })
      if (!room || !room.available) {
        return NextResponse.json({ error: 'Room is no longer available' }, { status: 400 })
      }
    }

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        type: data.type,
        restaurantId: data.restaurantId || null,
        hotelId: data.hotelId || null,
        roomId: data.roomId || null,
        checkIn: new Date(data.checkIn),
        checkOut: data.checkOut ? new Date(data.checkOut) : null,
        guests: data.guests || 2,
        specialReqs: data.specialReqs || '',
        totalPrice: data.totalPrice || 0,
        status: 'confirmed'
      },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Booking failed:', error)
    return NextResponse.json({ error: 'Booking failed' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      include: {
        restaurant: true,
        hotel: true,
        room: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(bookings)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}
