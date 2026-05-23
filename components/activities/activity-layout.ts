import type { Activity } from '@/lib/data'

export const ACTIVITY_GRID =
  'grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12'

export const ACTIVITY_SECTION_PADDING = 'px-6 md:px-12'

export function activityContentColSpan(hasImage: boolean) {
  return hasImage ? 'lg:col-span-4' : 'lg:col-span-8'
}

export function activityDescriptionColSpan(hasImage: boolean) {
  return hasImage ? 'lg:col-span-4' : 'lg:col-span-8'
}

export type ActivityBlockProps = {
  activity: Activity
}
