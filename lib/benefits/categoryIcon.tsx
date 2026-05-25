import {
  Apple,
  Coffee,
  Cpu,
  Footprints,
  Glasses,
  Shirt,
  Tag,
  Watch,
  type LucideIcon,
} from 'lucide-react'

/** Match common category names to a lucide icon. Categories are admin-editable
 *  free text, so we look up case-insensitively and fall back to a generic
 *  Tag icon for anything unrecognised. Add new entries as new categories ship. */
const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  apparel: Shirt,
  sportswear: Shirt,
  clothing: Shirt,
  footwear: Footprints,
  shoes: Footprints,
  nutrition: Apple,
  food: Apple,
  fuel: Apple,
  tech: Cpu,
  technology: Cpu,
  electronics: Cpu,
  wearables: Watch,
  watch: Watch,
  watches: Watch,
  accessories: Glasses,
  eyewear: Glasses,
  sunglasses: Glasses,
  'café': Coffee,
  cafe: Coffee,
  coffee: Coffee,
  bakery: Coffee,
}

function normaliseKey(category: string): string {
  return category.trim().toLowerCase()
}

/** @returns the lucide icon component for a category (or the generic Tag fallback). */
export function getCategoryIcon(category: string): LucideIcon {
  return CATEGORY_ICON_MAP[normaliseKey(category)] ?? Tag
}
