import type { Metadata } from 'next'
import { createPageMetadata } from '@/lib/site-metadata'
import { siteData } from '@/lib/site-data'

export const metadata: Metadata = createPageMetadata({
  title: 'Community',
  description: siteData.aboutpara,
  path: '/about',
})

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
