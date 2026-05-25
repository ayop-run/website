'use client'

import { Globe, Store, X } from 'lucide-react'
import type { ReactNode } from 'react'

export type RedemptionFilter = 'all' | 'online' | 'in_store'

export const REDEMPTION_FILTERS: {
  value: RedemptionFilter
  label: string
  icon: ReactNode | null
}[] = [
  { value: 'all', label: 'All', icon: null },
  {
    value: 'online',
    label: 'Online',
    icon: <Globe className="h-3.5 w-3.5" aria-hidden />,
  },
  {
    value: 'in_store',
    label: 'In-store',
    icon: <Store className="h-3.5 w-3.5" aria-hidden />,
  },
]

interface BenefitsFiltersProps {
  categories: string[]
  selectedCategory: string
  onSelectCategory: (value: string) => void

  selectedRedemption: RedemptionFilter
  onSelectRedemption: (value: RedemptionFilter) => void

  resultsCount: number
  onClear: () => void
}

export function BenefitsFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedRedemption,
  onSelectRedemption,
  resultsCount,
  onClear,
}: BenefitsFiltersProps) {
  const hasActiveFilter =
    selectedCategory !== 'All' || selectedRedemption !== 'all'

  return (
    <div className="mb-10 space-y-3">
      <FilterRow label="Category">
        {categories.map((cat) => (
          <FilterChip
            key={cat}
            active={selectedCategory === cat}
            onClick={() => onSelectCategory(cat)}
          >
            {cat}
          </FilterChip>
        ))}
      </FilterRow>

      <FilterRow label="Redeem">
        {REDEMPTION_FILTERS.map((opt) => (
          <FilterChip
            key={opt.value}
            active={selectedRedemption === opt.value}
            onClick={() => onSelectRedemption(opt.value)}
          >
            {opt.icon}
            {opt.label}
          </FilterChip>
        ))}
      </FilterRow>

      <div className="flex items-center justify-between gap-3 pt-1 text-sm">
        <p className="text-muted-foreground">
          {resultsCount} {resultsCount === 1 ? 'offer' : 'offers'}
        </p>
        {hasActiveFilter && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}

function FilterRow({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="grid gap-2 sm:grid-cols-[88px_1fr] sm:items-center sm:gap-x-4"
    >
      <p className="type-eyebrow text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

interface FilterChipProps {
  active: boolean
  onClick: () => void
  children: ReactNode
}

function FilterChip({ active, onClick, children }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-sm transition-colors ${
        active
          ? 'border-foreground bg-foreground text-background'
          : 'border-border text-muted-foreground hover:border-foreground/60 hover:text-foreground'
      }`}
    >
      {children}
    </button>
  )
}
