'use client'

import { motion } from 'framer-motion'
import { activitiesPageContent, socialLinks } from '@/lib/data'
import { CtaButtons } from '@/components/activities/cta-buttons'
import type { ActivitiesPageCtaBlock } from '@/lib/data'

function buildLinks(block: ActivitiesPageCtaBlock) {
  return block.links
    .map(({ socialId, primary }) => {
      const link = socialLinks.find((item) => item.id === socialId)
      if (!link) return null
      return { href: link.link, label: link.title, primary }
    })
    .filter(Boolean) as Array<{ href: string; label: string; primary?: boolean }>
}

function CtaColumn({ block, delay = 0 }: { block: ActivitiesPageCtaBlock; delay?: number }) {
  const [primaryLine, secondaryLine] = block.body

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      className={delay > 0 ? 'lg:border-l lg:border-border lg:pl-16' : undefined}
    >
      <p className="type-eyebrow text-muted-foreground">{block.eyebrow}</p>
      <h2 className="mt-4 type-h2">{block.title}</h2>
      {primaryLine && (
        <p className="mt-4 type-body text-foreground">{primaryLine}</p>
      )}
      {secondaryLine && (
        <p className="mt-2 type-body text-muted-foreground">{secondaryLine}</p>
      )}
      {block.footnote && (
        <p className="mt-6 text-sm text-muted-foreground">{block.footnote}</p>
      )}
      <CtaButtons links={buildLinks(block)} />
    </motion.div>
  )
}

export function ActivitiesCta() {
  const { runners, collaborations } = activitiesPageContent.cta

  return (
    <section className="border-t border-border bg-card py-16 md:py-24">
      <div className="grid grid-cols-1 gap-12 px-6 md:px-12 lg:grid-cols-2 lg:gap-16">
        <CtaColumn block={runners} />
        <CtaColumn block={collaborations} delay={0.1} />
      </div>
    </section>
  )
}
