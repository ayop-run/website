'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'
import { ADSENSE_CLIENT, isAdsenseEnabled } from '@/lib/adsense'

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

type AdStatus = 'waiting' | 'script-loaded' | 'pushed' | 'error'

type GoogleAdSenseUnitProps = {
  slot: string
  format?: string
  layoutKey?: string
  /** Cap fluid ad height (Google max is 1200px). */
  maxHeightPx?: number
  /** `card` matches photo album tiles in the gallery grid. */
  variant?: 'banner' | 'card'
  className?: string
}

export function GoogleAdSenseUnit({
  slot,
  format = 'fluid',
  layoutKey = '+1z+rz-g-n+31',
  maxHeightPx = 600,
  variant = 'banner',
  className,
}: GoogleAdSenseUnitProps) {
  const isCard = variant === 'card'
  const rootClassName =
    className ??
    (isCard
      ? 'relative flex h-full flex-col overflow-hidden'
      : 'mb-10 w-full')
  const pushed = useRef(false)
  const [status, setStatus] = useState<AdStatus>('waiting')
  const [isLocalhost, setIsLocalhost] = useState(false)
  const enabled = isAdsenseEnabled()

  const pushAd = () => {
    if (pushed.current) return
    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
      pushed.current = true
      setStatus('pushed')
    } catch {
      setStatus('error')
    }
  }

  useEffect(() => {
    setIsLocalhost(
      window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1',
    )
  }, [])

  const schedulePush = () => {
    // Wait for layout so fluid ads get a stable width before sizing height.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => pushAd())
    })
  }

  // If the script was already injected (navigation / HMR), still push for this slot.
  useEffect(() => {
    if (!enabled) return
    if (!document.querySelector('script[src*="adsbygoogle.js"]')) return
    const t = window.setTimeout(() => {
      if (pushed.current) return
      try {
        window.adsbygoogle = window.adsbygoogle || []
        window.adsbygoogle.push({})
        pushed.current = true
        setStatus('pushed')
      } catch {
        setStatus('error')
      }
    }, 100)
    return () => window.clearTimeout(t)
  }, [enabled])

  const adMaxHeight = isCard ? 480 : maxHeightPx
  const adStyle = {
    display: 'block',
    width: '100%',
    maxHeight: `${adMaxHeight}px`,
    overflow: 'hidden',
  } as const

  if (!enabled) {
    if (isCard) {
      return (
        <article
          className={`${rootClassName} border border-dashed border-border bg-muted/20`}
          aria-hidden
        >
          <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-secondary/50 p-4 text-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                AdSense
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Set{' '}
                <code className="text-foreground">NEXT_PUBLIC_ENABLE_ADSENSE=true</code>
              </p>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-2 p-4">
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Sponsored
            </p>
          </div>
        </article>
      )
    }

    return (
      <div
        className={`${rootClassName} border border-dashed border-border bg-muted/20 px-4 py-6 text-center`}
        aria-hidden
      >
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          AdSense
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Add{' '}
          <code className="text-foreground">NEXT_PUBLIC_ENABLE_ADSENSE=true</code>{' '}
          to <code className="text-foreground">.env.local</code> and restart{' '}
          <code className="text-foreground">yarn dev</code>.
        </p>
      </div>
    )
  }

  const adSlot = (
    <div
      className={
        isCard
          ? 'relative flex aspect-square w-full items-center justify-center overflow-hidden bg-secondary'
          : 'w-full overflow-hidden'
      }
      style={isCard ? undefined : { maxHeight: `${adMaxHeight}px` }}
    >
      <ins
        className="adsbygoogle"
        style={adStyle}
        data-ad-format={format}
        data-ad-layout-key={layoutKey}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
      />
    </div>
  )

  return (
    <article className={rootClassName} aria-label="Advertisement">
      <Script
        id={`adsbygoogle-${slot}`}
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
        onLoad={() => {
          setStatus('script-loaded')
          schedulePush()
        }}
        onError={() => setStatus('error')}
      />
      {isCard ? (
        <>
          {adSlot}
          <div className="flex flex-1 flex-col gap-2 p-4">
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Sponsored
            </p>
            {process.env.NODE_ENV !== 'production' && status !== 'error' && (
              <p className="text-xs leading-relaxed text-muted-foreground">
                {status === 'waiting' && 'Loading AdSense script…'}
                {(status === 'script-loaded' || status === 'pushed') &&
                  (isLocalhost
                    ? 'Ads usually do not fill on localhost.'
                    : 'Ad slot initialized.')}
              </p>
            )}
          </div>
        </>
      ) : (
        <>
          {adSlot}
          {process.env.NODE_ENV !== 'production' && status !== 'error' && (
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {status === 'waiting' && 'Loading AdSense script…'}
              {(status === 'script-loaded' || status === 'pushed') &&
                (isLocalhost
                  ? 'Ad slot initialized — Google usually does not show ads on localhost. Deploy to ayop.run to see real ads.'
                  : 'Ad slot initialized.')}
            </p>
          )}
        </>
      )}
    </article>
  )
}
