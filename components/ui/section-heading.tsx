'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type SectionHeadingProps = {
  eyebrow?: ReactNode
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className = '',
}: SectionHeadingProps) {
  const alignClass =
    align === 'center' ? 'text-center mx-auto max-w-2xl' : 'max-w-4xl'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={`mb-16 ${alignClass} ${className}`.trim()}
    >
      {eyebrow ? <p className="type-eyebrow">{eyebrow}</p> : null}
      <h2 className={`type-h2 ${eyebrow ? 'mt-6' : ''}`}>{title}</h2>
      {description ? (
        <p className={`type-lead mt-6 ${align === 'center' ? 'mx-auto' : ''}`}>
          {description}
        </p>
      ) : null}
    </motion.div>
  )
}
