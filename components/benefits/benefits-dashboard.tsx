'use client'

import { useState } from 'react'
import { BenefitCard } from './benefit-card'
import { CategoryFilter } from './category-filter'
import { Gift, Sparkles } from 'lucide-react'

export interface Benefit {
  id: string
  brand: string
  logo?: string
  description: string
  discountCode: string
  discountValue: string
  category: string
  storeUrl: string
  expiresAt: string | null // ISO date string or null for no expiration
}

// Sample data - in production, this would come from a database
const benefits: Benefit[] = [
  {
    id: '1',
    brand: 'ON Running',
    description: 'Premium Swiss performance running shoes and apparel',
    discountCode: 'AYOP20',
    discountValue: '20% off',
    category: 'Footwear',
    storeUrl: 'https://www.on-running.com',
    expiresAt: '2026-12-31',
  },
  {
    id: '2',
    brand: 'Maurten',
    description: 'Revolutionary hydrogel sports fuel technology',
    discountCode: 'AYOPFUEL15',
    discountValue: '15% off',
    category: 'Nutrition',
    storeUrl: 'https://www.maurten.com',
    expiresAt: '2026-09-30',
  },
  {
    id: '3',
    brand: 'Tracksmith',
    description: 'Timeless running apparel crafted for the dedicated runner',
    discountCode: 'AYOPTRACK25',
    discountValue: '25% off',
    category: 'Apparel',
    storeUrl: 'https://www.tracksmith.com',
    expiresAt: '2026-08-15',
  },
  {
    id: '4',
    brand: 'Coros',
    description: 'Advanced GPS watches and heart rate monitors',
    discountCode: 'AYOPCOROS10',
    discountValue: '10% off',
    category: 'Tech',
    storeUrl: 'https://www.coros.com',
    expiresAt: null,
  },
  {
    id: '5',
    brand: 'Nuun',
    description: 'Clean electrolyte hydration tablets',
    discountCode: 'AYOPNUUN20',
    discountValue: '20% off',
    category: 'Nutrition',
    storeUrl: 'https://www.nuunlife.com',
    expiresAt: '2026-07-01',
  },
  {
    id: '6',
    brand: 'Goodr',
    description: 'Fun, functional, and fashionable running sunglasses',
    discountCode: 'AYOPSHADES15',
    discountValue: '15% off',
    category: 'Accessories',
    storeUrl: 'https://www.goodr.com',
    expiresAt: '2026-10-31',
  },
  {
    id: '7',
    brand: 'SiS',
    description: 'Science-backed sports nutrition and energy gels',
    discountCode: 'AYOPSIS25',
    discountValue: '25% off',
    category: 'Nutrition',
    storeUrl: 'https://www.scienceinsport.com',
    expiresAt: '2025-03-15', // Expired for demo purposes
  },
  {
    id: '8',
    brand: 'Satisfy Running',
    description: 'High-performance technical running gear with style',
    discountCode: 'AYOPSATISFY20',
    discountValue: '20% off',
    category: 'Apparel',
    storeUrl: 'https://www.satisfyrunning.com',
    expiresAt: '2026-11-30',
  },
]

const categories = ['All', 'Footwear', 'Apparel', 'Nutrition', 'Tech', 'Accessories']

export function BenefitsDashboard() {
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredBenefits =
    selectedCategory === 'All'
      ? benefits
      : benefits.filter((b) => b.category === selectedCategory)

  const activeBenefits = filteredBenefits.filter((b) => {
    if (!b.expiresAt) return true
    return new Date(b.expiresAt) > new Date()
  })

  const expiredBenefits = filteredBenefits.filter((b) => {
    if (!b.expiresAt) return false
    return new Date(b.expiresAt) <= new Date()
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <Gift className="w-5 h-5 text-primary" />
            </div>
            <h1 className="type-h2 text-foreground">Member Benefits</h1>
          </div>
          <p className="type-lead max-w-2xl">
            Exclusive discounts from our partner brands. Copy a code and head to their store to save on your next purchase.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {/* Active Benefits */}
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

        {/* Expired Benefits */}
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

        {/* Empty State */}
        {filteredBenefits.length === 0 && (
          <div className="text-center py-16">
            <p className="type-lead">No benefits found in this category.</p>
          </div>
        )}
      </main>
    </div>
  )
}
