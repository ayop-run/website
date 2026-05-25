import type { Metadata } from 'next'
import { createPageMetadata } from '@/lib/site-metadata'

export const metadata: Metadata = {
  ...createPageMetadata({
    title: 'Member Perks',
    description:
      'Exclusive partner discounts for AYOP members. Copy a code and shop with our partners.',
    path: '/benefits/perks',
  }),
  robots: {
    index: false,
    follow: false,
  },
}

export default function BenefitsPerksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
