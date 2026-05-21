'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { photoAlbums } from '@/lib/data'

export function PhotosPreview() {
  return (
    <section className="py-24 md:py-32 border-t border-border">
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
            Archive
          </span>
          <h2 className="mt-6 text-4xl md:text-5xl font-medium tracking-tight">
            Photo Journal
          </h2>
        </motion.div>

        {/* Photos Grid - Editorial Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {photoAlbums.slice(0, 3).map((album, i) => (
            <motion.a
              key={album.id}
              href={album.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`group relative overflow-hidden bg-secondary ${
                i === 0 ? 'md:col-span-7 aspect-[4/3]' : 'md:col-span-5 aspect-square'
              }`}
            >
              {/* Placeholder background */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted transition-transform duration-700 group-hover:scale-105" />
              
              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 bg-gradient-to-t from-background/80 to-transparent">
                <div className="transform transition-transform duration-300 group-hover:translate-y-0 translate-y-2">
                  <span className="text-xs text-accent tracking-wider uppercase font-medium">
                    {album.category}
                  </span>
                  <h3 className="mt-2 text-xl md:text-2xl font-medium text-foreground">
                    {album.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{album.date}</span>
                    <span>·</span>
                    <span>by {album.photographer}</span>
                  </div>
                </div>
              </div>

              {/* Hover arrow */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-foreground"
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
            </motion.a>
          ))}
        </div>

        {/* Link to Photos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12"
        >
          <Link
            href="/photos"
            className="inline-flex items-center gap-2 text-foreground font-medium hover:text-accent transition-colors duration-300 group"
          >
            <span>Browse all photos</span>
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
