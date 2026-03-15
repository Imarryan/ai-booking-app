import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const hotel = await prisma.hotel.findUnique({
      where: { id },
      include: { rooms: true }
    })

    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 })
    }

    return NextResponse.json(hotel)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch hotel' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Delete related bookings first
    await prisma.booking.deleteMany({ where: { hotelId: id } })
    // Rooms cascade-delete via schema, but bookings referencing rooms need cleanup
    const rooms = await prisma.room.findMany({ where: { hotelId: id }, select: { id: true } })
    await prisma.booking.deleteMany({ where: { roomId: { in: rooms.map(r => r.id) } } })
    // Now delete the hotel (rooms cascade)
    await prisma.hotel.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete hotel' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    // Assuming we only update the hotel details for now, omitting partial room updates
    const hotel = await prisma.hotel.update({
      where: { id },
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

    return NextResponse.json(hotel)
  } catch (error) {
    console.error('Failed to update hotel:', error)
    return NextResponse.json(
      { error: 'Failed to update hotel' },
      { status: 500 }
    )
  }
}
