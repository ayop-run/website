'use client'

import { motion } from 'framer-motion'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { PageHero } from '@/components/page-hero'
import { projects } from '@/lib/data'
import Link from 'next/link'
import Image from 'next/image'

export default function ProjectsPage() {
  return (
    <>
      <Navigation />
      <main>
        <PageHero
          title="PROJECTS"
          description="Collaborations, activations, and community partnerships. Using movement as the starting point for meaningful exchange."
        />

        {/* Projects Grid */}
        <section className="border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Link
                  href={`/projects/${project.id}`}
                  className="group border-b md:border-r border-border p-6 md:p-10 min-h-[400px] flex flex-col hover:bg-secondary/50 transition-colors duration-300 block"
                >
                  {/* Cover Image */}
                  <div className="flex-1 bg-secondary relative overflow-hidden mb-6">
                    <Image
                      src={project.coverImage}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-xs text-muted-foreground">
                          {project.category}
                        </span>
                        <h2 className="mt-1 type-h3 font-bold group-hover:text-muted-foreground transition-colors">
                          {project.title}
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {project.description}
                        </p>
                      </div>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <path
                          d="M7 17L17 7M17 7H7M17 7V17"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{project.date}</span>
                      <span>·</span>
                      <span>{project.partner}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* Coming Soon Placeholder */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="border-b border-border p-6 md:p-10 min-h-[300px] flex flex-col items-center justify-center bg-secondary/30"
            >
              <span className="text-sm text-muted-foreground">
                More projects coming soon
              </span>
            </motion.div>
          </div>
        </section>

        {/* Collaboration CTA */}
        <section className="py-16 md:py-24 bg-card">
          <div className="px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <h2 className="type-h2">
                Interested in collaborating?
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                We&apos;re always open to connecting with brands, communities, and creatives who share our values.
              </p>
              <a
                href="mailto:hello@ayop.run"
                className="inline-flex items-center gap-2 mt-8 bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:bg-foreground/90 transition-colors"
              >
                Get in touch
              </a>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
