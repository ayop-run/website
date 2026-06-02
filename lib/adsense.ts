/** Whether to load AdSense scripts and render ad units (production only). */
export function isAdsenseEnabled(): boolean {
  return process.env.NODE_ENV === 'production'
}

export const ADSENSE_CLIENT = 'ca-pub-1276789561645653'

/** In-feed autorelaxed unit on /photos gallery grid. */
export const ADSENSE_PHOTOS_SLOT = '5523907536'
