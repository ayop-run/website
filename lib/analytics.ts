import type { PhotoDto } from '@/lib/photos/types'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export type PhotoAlbumEventSource = 'photos_gallery' | 'home_preview'

export function trackOpenPhotoAlbum(
  photo: Pick<PhotoDto, 'id' | 'title' | 'category' | 'shotOn'>,
  source: PhotoAlbumEventSource,
) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return
  }

  window.gtag('event', 'open_photo_album', {
    album_id: photo.id,
    album_title: photo.title,
    category: photo.category,
    shot_on: photo.shotOn,
    year: photo.shotOn.slice(0, 4),
    source,
  })
}
