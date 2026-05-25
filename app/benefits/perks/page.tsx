'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { PageHero } from '@/components/page-hero'
import { BenefitsDashboard } from '@/components/benefits/benefits-dashboard'
import {
  BENEFITS_PAGE,
  BENEFITS_ROUTES,
  fetchBenefitsUnlocked,
} from '@/lib/benefits/gate'

export default function BenefitsPerksPage() {
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const ctrl = new AbortController()
    ;(async () => {
      const unlocked = await fetchBenefitsUnlocked(ctrl.signal)
      if (ctrl.signal.aborted) return
      if (!unlocked) {
        router.replace(BENEFITS_ROUTES.gate)
        return
      }
      setIsReady(true)
    })()
    return () => ctrl.abort()
  }, [router])

  return (
    <>
      <Navigation />
      <main>
        <PageHero title={BENEFITS_PAGE.title} description={BENEFITS_PAGE.description} />
        {isReady && <BenefitsDashboard />}
      </main>
      <Footer />
    </>
  )
}
