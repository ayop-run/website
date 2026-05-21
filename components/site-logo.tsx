'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

type SiteLogoProps = {
  className?: string
}

/** AYOP wordmark — dark SVG on light theme, white SVG on dark theme. */
export function SiteLogo({ className }: SiteLogoProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const src =
    !mounted || resolvedTheme === 'dark'
      ? '/images/logo/logo-main-white.svg'
      : '/images/logo/logo-main-dark.svg'

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="AYOP"
      className={cn('block h-full w-auto', className)}
      decoding="async"
    />
  )
}
