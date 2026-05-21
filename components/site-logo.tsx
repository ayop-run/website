import { cn } from '@/lib/utils'

type SiteLogoProps = {
  className?: string
}

/** AYOP wordmark — dark SVG on light theme, white SVG on dark theme. */
export function SiteLogo({ className }: SiteLogoProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center leading-none [&_img]:block [&_img]:h-full [&_img]:w-auto',
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/logo/logo-main-dark.svg"
        alt="AYOP"
        className="dark:hidden"
        decoding="async"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/logo/logo-main-white.svg"
        alt="AYOP"
        className="hidden dark:block"
        decoding="async"
      />
    </span>
  )
}
