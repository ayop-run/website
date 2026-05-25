'use client'

import { Button } from '@/components/ui/button'

interface CategoryFilterProps {
  categories: string[]
  selected: string
  onSelect: (category: string) => void
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selected === category ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelect(category)}
          className="rounded-full"
        >
          {category}
        </Button>
      ))}
    </div>
  )
}
