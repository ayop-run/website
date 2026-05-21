'use client'

import { Suspense, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { AdminGate } from '@/components/admin/admin-gate'

function OpenSiteEditor() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/edit')
  }, [router])
  return (
    <p className="text-sm text-muted-foreground">
      Opening the site editor… If nothing happens,{' '}
      <Link href="/edit" className="underline">
        open it here
      </Link>
      .
    </p>
  )
}

export default function AdminEditPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-24 px-6 md:px-12 pb-16">
        <div className="max-w-xl mx-auto">
          <p className="text-sm mb-4">
            <Link href="/admin" className="text-muted-foreground hover:text-foreground">
              ← Admin
            </Link>
          </p>
          <h1 className="text-3xl font-bold mb-4">Site editor</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Redirects to the full-page editor for header, team, activities, and related content.
          </p>
          <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
            <AdminGate showSignOut={false}>
              <OpenSiteEditor />
            </AdminGate>
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
