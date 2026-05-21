'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export function AboutPreview() {
  return (
    <section className="py-24 md:py-32 bg-card">
      <div className="px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Left Column - Headline & Image */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="headline-lg text-foreground mb-12"
            >
              AT AYOP, SUCCESS IS THE JOURNEY. EVERY LESSON FOSTERS GROWTH.
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full max-w-md aspect-[4/5]"
            >
              <Image
                src="https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=800&q=80"
                alt="AYOP running community"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>

          {/* Right Column - Text & Small Images */}
          <div className="flex flex-col justify-between">
            <div className="space-y-6 max-w-lg">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-muted-foreground leading-relaxed"
              >
                {"We don't merely chase after the latest trends that often fade away; instead, we purposefully forge our own unique path, one that is deeply anchored in our fundamental values and our long-term aspirations."}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-muted-foreground leading-relaxed"
              >
                {"This thoughtful approach empowers us to stay authentic to our identity while also enabling us to make significant strides forward. By focusing on what truly matters to us, we ensure that our progress is not only meaningful but also aligned with our vision for the future."}
              </motion.p>
            </div>

            {/* Two small images at bottom right */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex gap-4 mt-12 lg:mt-0 lg:justify-end"
            >
              <div className="relative w-[140px] md:w-[160px] aspect-square">
                <Image
                  src="https://images.unsplash.com/photo-1486218119243-13883505764c?w=400&q=80"
                  alt="Running action shot"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative w-[140px] md:w-[160px] aspect-square">
                <Image
                  src="https://images.unsplash.com/photo-1544216717-3bbf52512659?w=400&q=80"
                  alt="Community runners"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16"
        >
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-sm text-foreground link-underline"
          >
            Learn more about us
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
