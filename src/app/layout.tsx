import './globals.css'
import React from 'react'
import { Poppins, Inter } from 'next/font/google'

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: 'RoamWork OS — Global Lead Generation & 360° Digital Audit Platform',
  description: 'Automated 360° Web & Social Media Audit Engine with Country-Aware Valuation & Multi-Channel Outreach Dispatcher',
  icons: {
    icon: '/brand/logo.png',
    shortcut: '/brand/logo.png',
    apple: '/brand/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/brand/logo.png" type="image/png" />
      </head>
      <body className="font-inter bg-slate-950 text-slate-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
