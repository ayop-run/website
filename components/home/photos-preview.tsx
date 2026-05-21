'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/ui/section-heading'
import { categoryLabel, type PhotoDto } from '@/lib/photos/client'

export function PhotosPreview() {
  const [albums, setAlbums] = useState<PhotoDto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/photos')
        const body = await res.json()
        if (!cancelled && res.ok) {
          setAlbums((body.photos ?? []).slice(0, 3))
        }
      } catch {
        if (!cancelled) setAlbums([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const tiles = loading ? [] : albums

  return (
    <section className="py-24 md:py-32 border-t border-border">
      <div className="px-6 md:px-12">
        <SectionHeading eyebrow="Archive" title="Photo Journal" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {loading &&
            [0, 1, 2].map((i) => (
              <div
                key={`loading-${i}`}
                className={`relative overflow-hidden bg-secondary animate-pulse ${
                  i === 0 ? 'md:col-span-7 aspect-[4/3]' : 'md:col-span-5 aspect-square'
                }`}
              />
            ))}

          {!loading &&
            tiles.map((album, i) => {
              const photographer = album.photographerDisplayName?.trim()
              const category = categoryLabel(album.category)

              return (
                <motion.a
                  key={album.id}
                  href={album.externalAlbumUrl}
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
                  {album.coverImageUrl ? (
                    <img
                      src={album.coverImageUrl}
                      alt={album.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary to-muted transition-transform duration-700 group-hover:scale-105" />
                  )}

                  <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 bg-gradient-to-t from-background/80 to-transparent">
                    <div className="transform transition-transform duration-300 group-hover:translate-y-0 translate-y-2">
                      <span className="type-eyebrow text-accent">
                        {category}
                      </span>
                      <h3 className="mt-2 type-h3 text-foreground">
                        {album.title}
                      </h3>
                      <div className="mt-2 flex items-center gap-4 type-caption">
                        <span>{album.shotOn}</span>
                        {photographer && (
                          <>
                            <span>·</span>
                            <span>by {photographer}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-foreground"
                      aria-hidden
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
              )
            })}
        </div>

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
              aria-hidden
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
