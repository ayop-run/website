'use client'

import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/ui/section-heading'
import { upcomingRuns } from '@/lib/data'

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function UpcomingRuns() {
  return (
    <section className="py-24 md:py-32 border-t border-border bg-secondary/30">
      <div className="px-6 md:px-12">
        <SectionHeading eyebrow="Schedule" title="Upcoming Sessions" />

        {/* Runs List */}
        <div className="space-y-0">
          {upcomingRuns.map((run, i) => (
            <motion.a
              key={run.id}
              href={run.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="block py-6 md:py-8 border-b border-border hover:bg-secondary/50 transition-colors duration-300 group"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-center">
                {/* Date & Time */}
                <div className="md:col-span-3">
                  <p className="type-h3">{formatDate(run.date)}</p>
                  <p className="type-caption">{run.time}</p>
                </div>

                {/* Title */}
                <div className="md:col-span-4">
                  <h3 className="type-h3 group-hover:text-accent transition-colors duration-300">
                    {run.title}
                  </h3>
                </div>

                {/* Location */}
                <div className="md:col-span-3">
                  <p className="type-caption">{run.location}</p>
                </div>

                {/* Pace */}
                <div className="md:col-span-2 flex justify-between items-center">
                  <span className="text-sm text-muted-foreground bg-secondary px-3 py-1">
                    {run.pace}
                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="transform transition-transform duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 text-accent"
                  >
                    <path
                      d="M3 8H13M13 8L8 3M13 8L8 13"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
