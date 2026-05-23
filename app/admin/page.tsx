import { Suspense } from 'react'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { AdminGate } from '@/components/admin/admin-gate'

function AdminCard({
  title,
  description,
  href,
}: {
  title: string
  description: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-border p-5 transition-colors hover:border-foreground/30"
    >
      <h2 className="type-h3 mb-1">{title}</h2>
      <p className="type-caption">{description}</p>
    </Link>
  )
}

export default function AdminHomePage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-24 px-6 md:px-12 pb-16">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm mb-4">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              ← Home
            </Link>
          </p>
          <h1 className="type-h2 mb-8">Admin</h1>
          <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
            <AdminGate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* <AdminCard
                  title="Edit website"
                  description="Header, activities, team, social links, and other marketing copy."
                  href="/admin/edit"
                /> */}
                <AdminCard
                  title="Photo archive"
                  description="Open the gallery; add and edit entries after sign-in."
                  href="/photos"
                />
              </div>
            </AdminGate>
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
