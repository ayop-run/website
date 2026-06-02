/** Whether to load AdSense scripts and render ad units (production only). */
export function isAdsenseEnabled(): boolean {
  return process.env.NODE_ENV === 'production'
}

export const ADSENSE_CLIENT = 'ca-pub-1276789561645653'
