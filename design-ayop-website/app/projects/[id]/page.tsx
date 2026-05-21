'use client'

import { motion } from 'framer-motion'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { projects } from '@/lib/data'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { use } from 'react'

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const project = projects.find((p) => p.id === id)

  if (!project) {
    notFound()
  }

  return (
    <>
      <Navigation />
      <main>
        {/* Back Link */}
        <div className="px-6 md:px-12 pt-6">
          <Link 
            href="/projects" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Projects
          </Link>
        </div>

        {/* Hero Section */}
        <section className="pt-8 pb-16 md:pt-12 md:pb-24 px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-sm text-muted-foreground"
              >
                {project.category}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="headline-xl mt-2"
              >
                {project.title.toUpperCase()}
              </motion.h1>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="md:text-right"
            >
              <p className="text-sm text-muted-foreground">{project.date}</p>
              <p className="text-sm text-muted-foreground mt-1">Partner: {project.partner}</p>
              <p className="text-sm text-muted-foreground mt-1">Role: {project.role}</p>
            </motion.div>
          </div>
        </section>

        {/* Cover Image */}
        <section className="px-6 md:px-12 pb-16 md:pb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative aspect-[16/9] w-full overflow-hidden bg-secondary"
          >
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </section>

        {/* Description */}
        <section className="px-6 md:px-12 pb-16 md:pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">Overview</h2>
              <p className="text-lg leading-relaxed">{project.fullDescription}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">Challenge</h2>
              <p className="text-muted-foreground leading-relaxed">{project.challenge}</p>
            </motion.div>
          </div>
        </section>

        {/* Approach & Outcome */}
        <section className="px-6 md:px-12 pb-16 md:pb-24 border-t border-border pt-16 md:pt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">Approach</h2>
              <p className="leading-relaxed">{project.approach}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-4">Outcome</h2>
              <p className="leading-relaxed">{project.outcome}</p>
            </motion.div>
          </div>
        </section>

        {/* Gallery */}
        <section className="px-6 md:px-12 pb-16 md:pb-24">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-8"
          >
            Gallery
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {project.gallery.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative aspect-square overflow-hidden bg-secondary"
              >
                <Image
                  src={image}
                  alt={`${project.title} gallery image ${index + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Credits */}
        <section className="px-6 md:px-12 pb-16 md:pb-24 border-t border-border pt-16 md:pt-24">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-8"
          >
            Credits
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {project.credits.map((credit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <p className="text-sm text-muted-foreground">{credit.role}</p>
                <p className="font-medium">{credit.name}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Navigation to Other Projects */}
        <section className="border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {projects
              .filter((p) => p.id !== project.id)
              .slice(0, 2)
              .map((otherProject, index) => (
                <Link
                  key={otherProject.id}
                  href={`/projects/${otherProject.id}`}
                  className="group p-6 md:p-12 border-b md:border-b-0 md:border-r border-border last:border-r-0 hover:bg-secondary/50 transition-colors"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <span className="text-sm text-muted-foreground">Next Project</span>
                    <h3 className="mt-2 text-xl font-bold tracking-tight group-hover:text-muted-foreground transition-colors">
                      {otherProject.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{otherProject.description}</p>
                  </motion.div>
                </Link>
              ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
