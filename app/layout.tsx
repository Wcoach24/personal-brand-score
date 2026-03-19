import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Personal Brand Score | How Strong Is Your Brand?',
  description: 'Get your Personal Brand Score in 60 seconds. Discover where you stand and what to fix to build authority in your industry.',
  openGraph: {
    title: 'I just scored my Personal Brand — How strong is yours?',
    description: 'Free assessment: Get your Personal Brand Score in 60 seconds.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Personal Brand Score | How Strong Is Your Brand?',
    description: 'Get your Personal Brand Score in 60 seconds.',
  },
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
