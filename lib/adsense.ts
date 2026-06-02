/** Whether to load AdSense scripts and render ad units (production only). */
export function isAdsenseEnabled(): boolean {
  return process.env.NODE_ENV === 'production'
}

export const ADSENSE_CLIENT = 'ca-pub-1276789561645653'

/** In-feed autorelaxed unit on /photos gallery grid. */
export const ADSENSE_PHOTOS_SLOT = '5523907536'

const ADSENSE_SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`

/** Client-only: inject adsbygoogle.js without Next.js Script (avoids data-nscript). */
export function loadAdsenseScript(): Promise<void> {
  if (typeof document === 'undefined') {
    return Promise.reject(new Error('AdSense script requires a browser'))
  }

  const existing = document.querySelector<HTMLScriptElement>(
    `script[src="${ADSENSE_SCRIPT_SRC}"]`,
  )

  if (existing?.dataset.loaded === 'true') {
    return Promise.resolve()
  }

  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(), { once: true })
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.async = true
    script.src = ADSENSE_SCRIPT_SRC
    script.crossOrigin = 'anonymous'
    script.onload = () => {
      script.dataset.loaded = 'true'
      resolve()
    }
    script.onerror = () => reject(new Error('AdSense script failed to load'))
    document.head.appendChild(script)
  })
}
