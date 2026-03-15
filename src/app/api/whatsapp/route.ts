import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, phone, hotel, restaurant, checkIn, checkOut, guests } = await req.json();
    const property = hotel || restaurant || "Your Booking";
    const bookingId = "LUX" + Date.now().toString().slice(-6);

    const msg = encodeURIComponent(
      `🌟 *Booking Confirmed — LuxStay India*\n\n` +
      `Dear ${name},\n\n` +
      `✅ Your booking is confirmed!\n\n` +
      `🏨 *${property}*\n` +
      `${checkIn ? `📅 Check-in: ${checkIn}\n` : ""}` +
      `${checkOut ? `📅 Check-out: ${checkOut}\n` : ""}` +
      `👥 Guests: ${guests || 1}\n` +
      `🎫 Booking ID: ${bookingId}\n\n` +
      `Our concierge will call you within 30 minutes to finalize details.\n\n` +
      `Thank you for choosing LuxStay India! 🙏\n` +
      `📞 Support: +91-98765-43210`
    );

    const waUrl = `https://wa.me/91${phone}?text=${msg}`;
    return NextResponse.json({ success: true, bookingId, whatsappUrl: waUrl });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
