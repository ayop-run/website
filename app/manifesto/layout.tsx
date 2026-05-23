import type { Metadata } from 'next'
import { createPageMetadata } from '@/lib/site-metadata'
import { siteData } from '@/lib/site-data'

export const metadata: Metadata = createPageMetadata({
  title: 'Manifesto',
  description: siteData.manifesto.split('\n')[0],
  path: '/manifesto',
})

export default function ManifestoLayout({ children }: { children: React.ReactNode }) {
  return children
}
