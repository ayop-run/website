import type { Metadata } from 'next'

const productionUrl = 'https://ayop.run'

export const siteConfig = {
  name: 'AYOP',
  tagline: 'At Your Own Pace',
  title: 'AYOP — At Your Own Pace',
  description:
    'A Berlin-based running community built around rhythm, connection, and collective movement. Run Berlin, your way.',
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : productionUrl),
  locale: 'en_US',
  keywords: [
    'running',
    'Berlin',
    'community',
    'AYOP',
    'running club',
    'track running',
    'trail running',
  ],
  social: {
    instagram: 'https://www.instagram.com/ayop.run/',
  },
} as const

type PageMetadataOptions = {
  title: string
  description: string
  path?: string
}

export function createPageMetadata({
  title,
  description,
  path = '',
}: PageMetadataOptions): Metadata {
  const url = `${siteConfig.url}${path}`
  const fullTitle = `${title} — ${siteConfig.name}`

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
  }
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
}
