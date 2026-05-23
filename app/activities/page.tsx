import type { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { PageHero } from '@/components/page-hero'
import { ActivitiesList } from '@/components/activities/activities-list'
import { ActivitiesCta } from '@/components/activities/activities-cta'
import { activities, activitiesPageContent } from '@/lib/data'
import { createPageMetadata } from '@/lib/site-metadata'

export const metadata: Metadata = createPageMetadata({
  title: 'Activities',
  description: activitiesPageContent.description,
  path: '/activities',
})

export default function ActivitiesPage() {
  const { title, description } = activitiesPageContent

  return (
    <>
      <Navigation />
      <main>
        <PageHero title={title} description={description} />
        <ActivitiesList activities={activities} />
        <ActivitiesCta />
      </main>
      <Footer />
    </>
  )
}
