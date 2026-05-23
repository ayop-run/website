import { ImageResponse } from 'next/og'
import { OgImageContent } from '@/lib/og-image'
import { siteConfig } from '@/lib/site-metadata'

export const runtime = 'edge'
export const alt = siteConfig.title
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    <OgImageContent subtitle="Run Berlin, your way." />,
    size,
  )
}
