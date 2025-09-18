import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GenZen Meditation',
  description: 'AI-powered personalized meditation app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}