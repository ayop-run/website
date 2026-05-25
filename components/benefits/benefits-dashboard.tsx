'use client'

import { useEffect, useMemo, useState } from 'react'
import { BenefitCard } from './benefit-card'
import { BenefitsFilters, type RedemptionFilter } from './benefits-filters'
import { Sparkles } from 'lucide-react'
import type { BenefitDto, BenefitRedemption } from '@/lib/benefits/types'

type LoadState = 'loading' | 'ready'

function matchesRedemption(
  benefit: BenefitDto,
  filter: RedemptionFilter,
): boolean {
  if (filter === 'all') return true
  const r: BenefitRedemption = benefit.redemption
  if (r === 'both') return true
  return r === filter
}

export function BenefitsDashboard() {
  const [benefits, setBenefits] = useState<BenefitDto[]>([])
  const [state, setState] = useState<LoadState>('loading')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedRedemption, setSelectedRedemption] =
    useState<RedemptionFilter>('all')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/benefits', { credentials: 'include' })
        const body = await res.json().catch(() => ({}))
        if (cancelled) return
        if (!res.ok) {
          // Surface to console for debugging but show an empty state to members
          // rather than a scary error. The /admin/benefits page surfaces real errors.
          console.warn('[benefits] load failed:', body?.error || res.status)
          setBenefits([])
        } else {
          setBenefits(Array.isArray(body?.benefits) ? body.benefits : [])
        }
        setState('ready')
      } catch (err) {
        if (cancelled) return
        console.warn('[benefits] load failed:', err)
        setBenefits([])
        setState('ready')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const categories = useMemo(() => {
    const set = new Set<string>()
    for (const b of benefits) if (b.category) set.add(b.category)
    return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))]
  }, [benefits])

  const filteredBenefits = useMemo(
    () =>
      benefits.filter((b) => {
        if (selectedCategory !== 'All' && b.category !== selectedCategory)
          return false
        if (!matchesRedemption(b, selectedRedemption)) return false
        return true
      }),
    [benefits, selectedCategory, selectedRedemption]
  )

  const activeBenefits = filteredBenefits.filter((b) => {
    if (!b.expiresAt) return true
    return new Date(b.expiresAt) > new Date()
  })

  const expiredBenefits = filteredBenefits.filter((b) => {
    if (!b.expiresAt) return false
    return new Date(b.expiresAt) <= new Date()
  })

  return (
    <section className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
        {state === 'loading' && (
          <p className="type-body text-muted-foreground">Loading benefits…</p>
        )}

        {state === 'ready' && benefits.length === 0 && (
          <div className="text-center py-16">
            <p className="type-lead">No benefits available yet.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Check back soon — new partner perks are added regularly.
            </p>
          </div>
        )}

        {state === 'ready' && benefits.length > 0 && (
          <>
            <BenefitsFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedRedemption={selectedRedemption}
              onSelectRedemption={setSelectedRedemption}
              resultsCount={filteredBenefits.length}
              onClear={() => {
                setSelectedCategory('All')
                setSelectedRedemption('all')
              }}
            />

            {activeBenefits.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h2 className="type-h3 text-foreground">
                    Active Offers ({activeBenefits.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeBenefits.map((benefit) => (
                    <BenefitCard key={benefit.id} benefit={benefit} />
                  ))}
                </div>
              </section>
            )}

            {expiredBenefits.length > 0 && (
              <section>
                <h2 className="type-h3 text-muted-foreground mb-6">
                  Expired Offers ({expiredBenefits.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
                  {expiredBenefits.map((benefit) => (
                    <BenefitCard key={benefit.id} benefit={benefit} isExpired />
                  ))}
                </div>
              </section>
            )}

            {filteredBenefits.length === 0 && (
              <div className="text-center py-16">
                <p className="type-lead">No offers match your filters.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try a different category or clear filters to see everything.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
