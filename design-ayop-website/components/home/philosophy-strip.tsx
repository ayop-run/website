'use client'

import { motion } from 'framer-motion'
import { philosophyFragments } from '@/lib/data'

export function PhilosophyStrip() {
  return (
    <section className="py-24 md:py-32 border-t border-border overflow-hidden">
      <div className="px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="text-sm text-muted-foreground tracking-wider uppercase">
            Philosophy
          </span>
        </motion.div>
      </div>

      <div className="flex flex-wrap gap-4 md:gap-8 px-6 md:px-12">
        {philosophyFragments.map((fragment, i) => (
          <motion.div
            key={fragment}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="flex items-center gap-4 md:gap-8"
          >
            <span className="text-2xl md:text-4xl lg:text-5xl font-medium tracking-tight text-foreground">
              {fragment}
            </span>
            {i < philosophyFragments.length - 1 && (
              <span className="text-2xl md:text-4xl text-muted-foreground/30">
                /
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  )
}
