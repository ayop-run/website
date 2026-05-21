'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { activities } from '@/lib/data'

export function ActivitiesPreview() {
  return (
    <section id="activities" className="py-24 md:py-32 border-t border-border">
      <div className="px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <span className="text-sm text-muted-foreground tracking-wider uppercase">
            Activities
          </span>
          <h2 className="mt-6 text-4xl md:text-5xl font-medium tracking-tight">
            Our Activities
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Weekly rituals and monthly journeys — designed to build consistency, connection, and culture.
          </p>
        </motion.div>

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
                <span className="text-xs text-accent tracking-wider uppercase font-medium">
                  {activity.shortTitle}
                </span>
                <h3 className="mt-4 text-2xl md:text-3xl font-medium tracking-tight">
                  {activity.title}
                </h3>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {activity.description}
                </p>
                <p className="mt-4 text-sm text-muted-foreground/70 italic">
                  {activity.details}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">{activity.schedule}</p>
                    <p className="text-sm text-muted-foreground mt-1">{activity.location}</p>
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
