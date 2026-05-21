'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface StickyCTAProps {
  label?: string
  href?: string
}

export function StickyCTA({ label = 'Join Next Run', href = 'https://www.instagram.com/ayop.run/' }: StickyCTAProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
      className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:bottom-8 z-30"
    >
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center md:inline-flex gap-2 bg-foreground text-background px-6 py-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors duration-300"
      >
        <span>{label}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-70"
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
  )
}
