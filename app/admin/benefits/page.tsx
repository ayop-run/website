import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { AdminGate } from '@/components/admin/admin-gate'
import { BenefitsAdmin } from '@/components/admin/benefits-admin'
import { BenefitsPasswordSettings } from '@/components/admin/benefits-password-settings'

export const metadata: Metadata = {
  title: 'Member benefits · Admin',
  robots: { index: false, follow: false },
}

export default function AdminBenefitsPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-24 px-6 md:px-12 pb-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm mb-4">
            <Link
              href="/admin"
              className="text-muted-foreground hover:text-foreground"
            >
              ← Admin
            </Link>
          </p>
          <h1 className="type-h2 mb-2">Member benefits</h1>
          <p className="type-caption mb-8">
            Add, edit, or remove partner offers shown on{' '}
            <code>/benefits/perks</code>.
          </p>
          <Suspense
            fallback={<p className="text-muted-foreground">Loading…</p>}
          >
            <AdminGate>
              <div className="space-y-8">
                <BenefitsPasswordSettings />
                <BenefitsAdmin />
              </div>
            </AdminGate>
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
