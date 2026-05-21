import { navLinks } from '@/lib/data'

/** When true, production only serves the photo gallery and related routes. */
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
    return navLinks.filter((link) => link.href === '/photos')
  }
  return navLinks
}

export function isPathAllowedInPhotosOnlyMode(pathname: string): boolean {
  if (pathname.startsWith('/photos')) return true
  if (pathname.startsWith('/api/photos')) return true
  if (pathname.startsWith('/admin')) return true
  return false
}
