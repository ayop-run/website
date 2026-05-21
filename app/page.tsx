import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Hero } from '@/components/home/hero'
import { AboutPreview } from '@/components/home/about-preview'
import { ActivitiesPreview } from '@/components/home/activities-preview'
import { UpcomingRuns } from '@/components/home/upcoming-runs'
import { PhotosPreview } from '@/components/home/photos-preview'
import { ManifestoPreview } from '@/components/home/manifesto-preview'
import { PhilosophyStrip } from '@/components/home/philosophy-strip'

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <AboutPreview />
        <ActivitiesPreview />
        <UpcomingRuns />
        <PhotosPreview />
        <PhilosophyStrip />
        <ManifestoPreview />
      </main>
      <Footer />
    </>
  )
}
