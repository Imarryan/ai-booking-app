import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [totalBookings, totalRestaurants, totalHotels, totalUsers, revenueAgg, recentBookings] = await Promise.all([
      prisma.booking.count(),
      prisma.restaurant.count(),
      prisma.hotel.count(),
      prisma.user.count(),
      prisma.booking.aggregate({ _sum: { totalPrice: true } }),
      prisma.booking.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          restaurant: { select: { name: true } },
          hotel: { select: { name: true } },
        },
      }),
    ])

    return NextResponse.json({
      totalBookings,
      totalRestaurants,
      totalHotels,
      totalUsers,
      totalRevenue: revenueAgg._sum.totalPrice ?? 0,
      recentBookings,
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
