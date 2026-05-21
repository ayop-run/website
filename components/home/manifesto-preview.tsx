'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export function ManifestoPreview() {
  return (
    <section className="py-32 md:py-48 border-t border-border bg-secondary/20">
      <div className="px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <span className="type-eyebrow">
            Manifesto
          </span>
          
          <blockquote className="mt-8 type-quote text-balance">
            A crew, a community, a movement.
            <br />
            <span className="text-muted-foreground">
              At your own pace, we find our improvement.
            </span>
          </blockquote>

          <Link
            href="/manifesto"
            className="inline-flex items-center gap-2 mt-12 text-foreground font-medium hover:text-accent transition-colors duration-300 group"
          >
            <span>Read full manifesto</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="transform transition-transform duration-300 group-hover:translate-x-1"
            >
              <path
                d="M3 8H13M13 8L8 3M13 8L8 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
