type CtaLink = {
  href: string
  label: string
  primary?: boolean
}

export function CtaButtons({ links }: { links: CtaLink[] }) {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {links.map(({ href, label, primary }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={
            primary
              ? 'inline-flex items-center gap-2 bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90'
              : 'inline-flex items-center gap-2 border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary'
          }
        >
          {label}
        </a>
      ))}
    </div>
  )
}
