import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SessionProvider from '@/components/SessionProvider'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ChatWidget from '@/components/ChatWidget'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BookWise - AI Powered Bookings',
  description: 'Book restaurants and hotels instantly using our conversational AI agent.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} bg-black text-gray-100 min-h-screen flex flex-col antialiased`}>
        <SessionProvider>
          <Navbar />
          <main className="flex-grow pt-20">
            {children}
          </main>
          <ChatWidget />
          <Footer />
        </SessionProvider>
      </body>
    </html>
  )
}
