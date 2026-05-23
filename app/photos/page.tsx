import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { PhotosGallery } from '@/components/photos/photos-gallery'
import { createPageMetadata } from '@/lib/site-metadata'

export const metadata: Metadata = createPageMetadata({
  title: 'Photos',
  description:
    'Run memories from the AYOP crew. Browse albums by year, category, and photographer.',
  path: '/photos',
})

export default function PhotosPage() {
  return (
    <>
      <Navigation />
      <Suspense fallback={<main className="min-h-screen pt-24 px-6 text-muted-foreground">Loading…</main>}>
        <PhotosGallery />
      </Suspense>
      <Footer />
    </>
  )
}
