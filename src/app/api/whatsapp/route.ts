import { NextResponse } from 'next/server'
import twilio from 'twilio'

export async function POST(req: Request) {
  try {
    const { phone, name, hotel, checkIn, checkOut, guests } = await req.json()

    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER

    if (!accountSid || !authToken || !whatsappNumber) {
      return NextResponse.json(
        { success: false, error: 'WhatsApp service not configured' },
        { status: 500 }
      )
    }

    const client = twilio(accountSid, authToken)

    const message = await client.messages.create({
      from: `whatsapp:${whatsappNumber}`,
      to: `whatsapp:+91${phone}`,
      body: `🏨 *Booking Confirmed!*

Dear ${name},

Your booking has been confirmed!

*${hotel}*
📅 Check-in: ${checkIn}
📅 Check-out: ${checkOut}
👥 Guests: ${guests}

Thank you for choosing us! Our concierge will contact you shortly.

*LuxStay India* 🌟`,
    })

    return NextResponse.json({ success: true, messageId: message.sid })
  } catch (error: unknown) {
    console.error('WhatsApp error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}
