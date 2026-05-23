'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/ui/section-heading'
import { activities } from '@/lib/data'

export function ActivitiesPreview() {
  return (
    <section id="activities" className="py-24 md:py-32 border-t border-border">
      <div className="px-6 md:px-12">
        <SectionHeading
          eyebrow="Activities"
          title="Our Activities"
          description="Weekly rituals and monthly journeys — designed to build consistency, connection, and culture."
        />

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
          {activities.map((activity, i) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-background p-8 md:p-10 flex flex-col min-h-[400px]"
            >
              <div className="mb-auto">
                <span className="type-eyebrow text-accent">
                  {activity.shortTitle}
                </span>
                <h3 className="mt-4 type-h3">
                  {activity.title}
                </h3>
                <p className="mt-4 type-body text-muted-foreground">
                  {activity.description}
                </p>
                <p className="mt-4 type-caption italic opacity-80">
                  {activity.details}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="type-caption">{activity.schedule}</p>
                    <p className="type-caption mt-1">{activity.location}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Link to Activities */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12"
        >
          <Link
            href="/activities"
            className="inline-flex items-center gap-2 text-foreground font-medium hover:text-accent transition-colors duration-300 group"
          >
            <span>View all activities</span>
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
