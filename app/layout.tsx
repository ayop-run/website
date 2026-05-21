import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AYOP — At Your Own Pace',
  description: 'A Berlin-based running community built around rhythm, connection, and collective movement. Run Berlin, your way.',
  keywords: ['running', 'Berlin', 'community', 'AYOP', 'running club', 'trail running', 'track'],
  authors: [{ name: 'AYOP' }],
  icons: {
    icon: [
      { url: '/images/logo/favicon.svg', type: 'image/svg+xml' },
      { url: '/images/logo/favicon.png', type: 'image/png', sizes: '32x32' },
      { url: '/images/logo/favicon.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [{ url: '/images/logo/favicon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/images/logo/favicon.png',
  },
  openGraph: {
    title: 'AYOP — At Your Own Pace',
    description: 'A Berlin-based running community built around rhythm, connection, and collective movement.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AYOP — At Your Own Pace',
    description: 'A Berlin-based running community built around rhythm, connection, and collective movement.',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
