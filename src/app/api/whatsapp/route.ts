import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { name, phone, email, hotel, restaurant, checkIn, checkOut, guests } = await req.json()
    const property = hotel || restaurant || 'Your Booking'
    const bookingId = 'LUX' + Date.now().toString().slice(-6)

    // Build WhatsApp deep link (no Twilio needed)
    const whatsappMsg = encodeURIComponent(
      `🌟 *Booking Confirmed — LuxStay India*\n\n` +
      `Dear ${name || 'Guest'},\n\n` +
      `✅ Your booking is confirmed!\n\n` +
      `🏨 *${property}*\n` +
      (checkIn ? `📅 Check-in: ${checkIn}\n` : '') +
      (checkOut ? `📅 Check-out: ${checkOut}\n` : '') +
      `👥 Guests: ${guests || 1}\n` +
      `🎫 Booking ID: ${bookingId}\n\n` +
      `Our concierge will call you within 30 minutes.\n\n` +
      `Thank you for choosing LuxStay India! 🙏`
    )

    const whatsappUrl = phone ? `https://wa.me/91${phone}?text=${whatsappMsg}` : null

    return NextResponse.json({
      success: true,
      bookingId,
      whatsappUrl,
      message: `Booking ${bookingId} confirmed for ${property}`,
    })
  } catch (error: unknown) {
    console.error('WhatsApp error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}
