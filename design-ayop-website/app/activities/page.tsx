'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { activities } from '@/lib/data'

const activityImages = [
  'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80',
  'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80',
  'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&q=80',
]

export default function ActivitiesPage() {
  return (
    <>
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="pt-8 pb-16 md:pt-12 md:pb-24 px-6 md:px-12">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="headline-xl max-w-4xl"
          >
            EVENT SCHEDULE
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8 max-w-xl text-muted-foreground leading-relaxed"
          >
            Weekly rituals and monthly journeys — designed to build consistency, connection, and culture.
          </motion.p>
        </section>

        {/* Activities Detail */}
        <section className="border-t border-border">
          {activities.map((activity, i) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="border-b border-border"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 px-6 md:px-12 py-12 md:py-16">
                {/* Left - Activity Number & Title */}
                <div className="lg:col-span-4">
                  <span className="text-xs text-muted-foreground">
                    {activity.shortTitle}
                  </span>
                  <h2 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight">
                    {activity.title}
                  </h2>
                  <div className="mt-6 space-y-1 text-sm">
                    <p className="text-muted-foreground">
                      <span className="text-foreground">When:</span> {activity.schedule}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="text-foreground">Where:</span> {activity.location}
                    </p>
                  </div>
                </div>

                {/* Center - Image */}
                <div className="lg:col-span-4">
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={activityImages[i]}
                      alt={activity.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Right - Description */}
                <div className="lg:col-span-4 flex flex-col justify-center">
                  <p className="text-foreground leading-relaxed">
                    {activity.description}
                  </p>
                  <p className="mt-4 text-sm text-muted-foreground italic">
                    {activity.details}
                  </p>
                  <a
                    href="https://www.instagram.com/ayop.run/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-6 text-sm text-foreground link-underline w-fit"
                  >
                    Join session
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-card">
          <div className="px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <h2 className="headline-md">
                Ready to run with us?
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Join our next session through Instagram or Strava. All paces welcome.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="https://www.instagram.com/ayop.run/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:bg-foreground/90 transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="https://www.strava.com/clubs/1235607"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-border text-foreground px-5 py-2.5 text-sm font-medium hover:bg-secondary transition-colors"
                >
                  Strava Club
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
