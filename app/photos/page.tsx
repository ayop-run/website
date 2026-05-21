import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { PhotosGallery } from '@/components/photos/photos-gallery'

export const metadata: Metadata = {
  title: 'Photos — AYOP',
  description:
    'Run memories from the AYOP crew. Browse albums by year, category, and photographer.',
}

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
