'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { PageHero } from '@/components/page-hero'
import { siteData } from '@/lib/site-data'

export function Hero() {
  return (
    <>
      <PageHero
        title={
          <>
            {siteData.headerTaglineOne}
            <br />
            {siteData.headerTaglineTwo}
          </>
        }
        description={siteData.activitiesDescription}
      />

      <section className="px-6 md:px-12 pb-16 md:pb-24 border-b border-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative h-[300px] md:h-[350px] max-w-6xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute left-0 bottom-0 w-[140px] md:w-[180px] aspect-[3/4] photo-card overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&q=80"
              alt="Group running session"
              fill
              className="object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-4 w-[160px] md:w-[200px] aspect-[3/4] photo-card overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&q=80"
              alt="Runner in motion"
              fill
              className="object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute right-0 bottom-0 w-[140px] md:w-[180px] aspect-[3/4] photo-card overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400&q=80"
              alt="Running legs close-up"
              fill
              className="object-cover"
            />
          </motion.div>
        </motion.div>
      </section>
    </>
  )
}
