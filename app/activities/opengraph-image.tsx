import { ImageResponse } from 'next/og'
import { OgImageContent } from '@/lib/og-image'
import { activitiesPageContent } from '@/lib/data'

export const runtime = 'edge'
export const alt = 'Activities — AYOP'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function ActivitiesOpenGraphImage() {
  return new ImageResponse(
    <OgImageContent
      eyebrow="AYOP"
      title="Activities"
      subtitle={activitiesPageContent.description}
    />,
    size,
  )
}
