import { navLinks } from '@/lib/data'

/** Routes visible in production while the rest of the site stays gated. */
const PHOTOS_ONLY_PUBLIC_PATHS = ['/photos', '/activities'] as const

/** When true, production only serves photo gallery, activities, and related routes. */
export function isPhotosOnlyProduction(): boolean {
  if (process.env.PHOTOS_ONLY === 'false') return false
  if (process.env.PHOTOS_ONLY === 'true') return true
  return process.env.NODE_ENV === 'production'
}

export function getHomeHref(): string {
  return isPhotosOnlyProduction() ? '/photos' : '/'
}

export function getPublicNavLinks() {
  if (isPhotosOnlyProduction()) {
    return navLinks.filter((link) =>
      PHOTOS_ONLY_PUBLIC_PATHS.includes(
        link.href as (typeof PHOTOS_ONLY_PUBLIC_PATHS)[number],
      ),
    )
  }
  return navLinks
}

export function shouldShowPublicNav(): boolean {
  return getPublicNavLinks().length > 1
}

export function isPathAllowedInPhotosOnlyMode(pathname: string): boolean {
  if (pathname.startsWith('/photos')) return true
  if (pathname.startsWith('/activities')) return true
  if (pathname.startsWith('/api/photos')) return true
  if (pathname.startsWith('/admin')) return true
  return false
}
