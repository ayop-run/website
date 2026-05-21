import { CATEGORY_LABELS, FILTER_YEARS, PHOTO_CATEGORIES } from './constants'
import type { PhotoDto } from './types'

export { CATEGORY_LABELS, FILTER_YEARS, PHOTO_CATEGORIES }
export type { PhotoDto }

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] || category
}

export function albumMeta(photo: PhotoDto): string {
  const label = categoryLabel(photo.category)
  return `${photo.shotOn} · ${label}`
}

export function photoYear(shotOn: string): string {
  return shotOn.slice(0, 4)
}

export function formatPhotographerCredit(
  displayName: string | null,
  instagramUsername: string | null
): string | null {
  if (!displayName?.trim()) return null
  if (instagramUsername?.trim()) {
    return `${displayName} (@${instagramUsername.replace(/^@/, '')})`
  }
  return displayName
}

export function instagramProfileUrl(username: string | null): string | null {
  if (!username?.trim()) return null
  const handle = username.replace(/^@/, '').trim()
  return `https://www.instagram.com/${handle}/`
}

/** Category options for gallery filter (design-style select). */
export const PHOTO_FILTER_CATEGORIES = [
  { label: 'All', value: '' },
  ...PHOTO_CATEGORIES.map((key) => ({
    label: categoryLabel(key),
    value: key,
  })),
] as const

export function extractPhotographerNames(photos: PhotoDto[]): string[] {
  const names = new Set<string>()
  for (const p of photos) {
    if (p.photographerDisplayName?.trim()) {
      names.add(p.photographerDisplayName.trim())
    }
  }
  return [...names].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
}
