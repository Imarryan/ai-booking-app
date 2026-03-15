import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        restaurant: { select: { name: true, city: true } },
        hotel: { select: { name: true, city: true } },
        room: { select: { type: true, price: true } },
      },
    })
    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Admin bookings error:', error)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}
