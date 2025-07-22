import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './../../app/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Free Fitness Metrics Guide | World\'s Fastest Centenarian',
  description: 'Get your free 3-page guide to tracking health metrics. Learn the 4 key numbers that matter most for your health and fitness journey.',
  keywords: 'fitness tracking, health metrics, wearable devices, health data, Brand Anthony McDonald',
  authors: [{ name: 'Brand Anthony McDonald' }],
  openGraph: {
    title: 'Free Fitness Metrics Guide | World\'s Fastest Centenarian',
    description: 'Get your free 3-page guide to tracking health metrics. Learn the 4 key numbers that matter most.',
    url: 'https://thecalisthenics.com',
    siteName: 'The Calisthenics',
    images: [
      {
        url: '/ebook-cover.jpg',
        width: 1200,
        height: 630,
        alt: 'Foundations of Fitness and Health Metrics Ebook Cover',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Fitness Metrics Guide | World\'s Fastest Centenarian',
    description: 'Get your free 3-page guide to tracking health metrics. Learn the 4 key numbers that matter most.',
    images: ['/ebook-cover.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}