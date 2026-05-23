import { siteConfig } from '@/lib/site-metadata'

type OgImageProps = {
  eyebrow?: string
  title?: string
  subtitle?: string
}

export function OgImageContent({
  eyebrow = 'Berlin Running Community',
  title = siteConfig.name,
  subtitle = siteConfig.tagline,
}: OgImageProps) {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#0a0a0a',
        padding: '72px 80px',
      }}
    >
      <div
        style={{
          fontSize: 22,
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          color: '#a3a3a3',
        }}
      >
        {eyebrow}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div
          style={{
            fontSize: title.length > 12 ? 72 : 96,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            color: '#fafafa',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 34,
            lineHeight: 1.2,
            color: '#d4d4d4',
            maxWidth: 900,
          }}
        >
          {subtitle}
        </div>
      </div>

      <div style={{ fontSize: 24, color: '#737373' }}>ayop.run</div>
    </div>
  )
}
