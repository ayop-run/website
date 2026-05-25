import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Member Benefits | AYOP Run',
  description: 'Exclusive partner discounts and benefits for AYOP running club members.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function BenefitsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
