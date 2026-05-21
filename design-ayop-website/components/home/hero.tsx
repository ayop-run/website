'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export function Hero() {
  return (
    <section className="min-h-[85vh] flex flex-col justify-between px-6 md:px-12 pt-12 pb-8">
      {/* Main Headline */}
      <div className="max-w-5xl">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="headline-xl text-foreground"
        >
          {"WE DON'T FOLLOW TRENDS."}
          <br />
          WE FOLLOW THE ROAD.
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 max-w-lg text-muted-foreground leading-relaxed"
        >
          {"We don't just follow the latest trends that come and go; rather, we intentionally carve out our own distinctive journey, driven by our core values and a clear vision for the future."}
        </motion.p>
      </div>

      {/* Scattered Photos */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="relative h-[300px] md:h-[350px] mt-12"
      >
        {/* Photo 1 - Left */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute left-0 bottom-0 w-[140px] md:w-[180px] aspect-[3/4] photo-card"
        >
          <Image
            src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&q=80"
            alt="Group running session"
            fill
            className="object-cover"
          />
        </motion.div>

        {/* Photo 2 - Center */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute left-1/2 -translate-x-1/2 bottom-4 w-[160px] md:w-[200px] aspect-[3/4] photo-card"
        >
          <Image
            src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&q=80"
            alt="Runner in motion"
            fill
            className="object-cover"
          />
        </motion.div>

        {/* Photo 3 - Right */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="absolute right-0 bottom-0 w-[140px] md:w-[180px] aspect-[3/4] photo-card"
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
  )
}
