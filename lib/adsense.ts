/** Whether to load AdSense scripts and render ad units. */
export function isAdsenseEnabled(): boolean {
  return (
    process.env.NODE_ENV === 'production' ||
    process.env.NEXT_PUBLIC_ENABLE_ADSENSE === 'true'
  )
}

export const ADSENSE_CLIENT = 'ca-pub-1276789561645653'
