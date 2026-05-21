import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { Hero } from '@/components/home/hero'
import { AboutPreview } from '@/components/home/about-preview'

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <AboutPreview />
      </main>
      <Footer />
    </>
  )
}
