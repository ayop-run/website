'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type PageHeroProps = {
  title: ReactNode
  description: ReactNode
  align?: 'left' | 'center'
  className?: string
}

/** Shared page intro — matches About, Activities, Projects, Photos layout. */
export function PageHero({
  title,
  description,
  align = 'left',
  className = '',
}: PageHeroProps) {
  const isCentered = align === 'center'

  const innerClass = isCentered
    ? 'max-w-4xl mx-auto text-center'
    : 'max-w-4xl'

  const titleClass = isCentered ? 'type-display mx-auto' : 'type-display'
  const descClass = isCentered
    ? 'type-lead mt-6 max-w-2xl mx-auto'
    : 'type-lead mt-8 max-w-xl'

  return (
    <section
      className={`pt-8 pb-16 md:pt-12 md:pb-24 px-6 md:px-12 ${className}`.trim()}
    >
      <div className={innerClass}>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={titleClass}
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={descClass}
        >
          {description}
        </motion.p>
      </div>
    </section>
  )
}
