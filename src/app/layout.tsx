import './globals.css'
import React from 'react'

export const metadata = {
  title: 'Roamwork OS — Lead Generation & Digital Growth CRM',
  description: 'Automated 360 Digital Audit & Human-in-the-Loop Outreach Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  )
}
