'use client'

import { useEffect, useRef, useState } from 'react'
import {
  ADSENSE_CLIENT,
  isAdsenseEnabled,
  loadAdsenseScript,
} from '@/lib/adsense'

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

type GoogleAdSenseUnitProps = {
  slot: string
  format?: string
  /** Required for `fluid` in-feed units only. */
  layoutKey?: string
  /** Cap fluid ad height (Google max is 1200px). */
  maxHeightPx?: number
  /** `card` matches photo album tiles in the gallery grid. */
  variant?: 'banner' | 'card'
  className?: string
}

export function GoogleAdSenseUnit({
  slot,
  format = 'autorelaxed',
  layoutKey,
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
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const enabled = isAdsenseEnabled()

  useEffect(() => {
    if (!enabled) return

    let cancelled = false

    loadAdsenseScript()
      .then(() => {
        if (!cancelled) setScriptLoaded(true)
      })
      .catch(() => {
        /* Script blocked or network error — slot stays hidden */
      })

    return () => {
      cancelled = true
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled || !scriptLoaded || pushed.current) return

    let cancelled = false

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (cancelled || pushed.current) return
        try {
          window.adsbygoogle = window.adsbygoogle || []
          window.adsbygoogle.push({})
          pushed.current = true
        } catch {
          /* AdSense push failed */
        }
      })
    })

    return () => {
      cancelled = true
    }
  }, [enabled, scriptLoaded])

  const isFluid = format === 'fluid'
  const adMaxHeight = isCard ? 480 : maxHeightPx
  const adStyle = isFluid
    ? ({
        display: 'block',
        width: '100%',
        maxHeight: `${adMaxHeight}px`,
        overflow: 'hidden',
      } as const)
    : ({ display: 'block' } as const)

  if (!enabled) {
    return null
  }

  if (!scriptLoaded) {
    return null
  }

  const adSlot = (
    <div
      className={
        isCard
          ? 'relative flex aspect-square w-full items-center justify-center overflow-hidden bg-secondary'
          : 'w-full overflow-hidden'
      }
      style={isFluid && !isCard ? { maxHeight: `${adMaxHeight}px` } : undefined}
    >
      <ins
        className="adsbygoogle"
        style={adStyle}
        data-ad-format={format}
        {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
      />
    </div>
  )

  return (
    <article className={rootClassName} aria-label="Advertisement">
      {isCard ? (
        <>
          {adSlot}
          <div className="flex flex-1 flex-col gap-2 p-4">
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Sponsored
            </p>
          </div>
        </>
      ) : (
        adSlot
      )}
    </article>
  )
}
