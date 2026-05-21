'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { PageHero } from '@/components/page-hero'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  FILTER_YEARS,
  PHOTO_FILTER_CATEGORIES,
  categoryLabel,
  extractPhotographerNames,
  instagramProfileUrl,
  type PhotoDto,
} from '@/lib/photos/client'

function buildQuery(params: {
  year: string
  category: string
  q: string
  photographer?: string
}) {
  const search = new URLSearchParams()
  if (params.year) search.set('year', params.year)
  if (params.category) search.set('category', params.category)
  if (params.q) search.set('q', params.q)
  if (params.photographer && params.photographer !== 'All') {
    search.set('photographer', params.photographer)
  }
  return search.toString()
}

const filterSelectTriggerClass =
  'h-9 min-w-[7.5rem] cursor-pointer rounded-none border-border bg-secondary/50 shadow-none text-sm text-foreground hover:bg-secondary/80 focus-visible:border-foreground/30 focus-visible:ring-1 focus-visible:ring-foreground/20'

function FilterSelect({
  value,
  onValueChange,
  options,
  triggerClassName,
}: {
  value: string
  onValueChange: (value: string) => void
  options: { value: string; label: string }[]
  triggerClassName?: string
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        size="sm"
        className={cn(filterSelectTriggerClass, triggerClassName)}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="rounded-none border-border bg-popover shadow-lg">
        {options.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            className="rounded-none text-sm focus:bg-secondary data-[highlighted]:bg-secondary"
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/** Update query string without Next.js navigation (avoids scroll-to-top on filter clicks). */
function replacePhotosUrl(qs: string) {
  const path = qs ? `/photos?${qs}` : '/photos'
  window.history.replaceState(window.history.state, '', path)
}

function PhotoAlbumCard({
  photo,
  adminUnlocked,
}: {
  photo: PhotoDto
  adminUnlocked: boolean
}) {
  const igUrl = instagramProfileUrl(photo.photographerInstagramUsername)
  const handle = photo.photographerInstagramUsername?.replace(/^@/, '').trim()

  return (
    <motion.a
      href={photo.externalAlbumUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="group flex h-full flex-col overflow-hidden"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
        {photo.coverImageUrl ? (
          <img
            src={photo.coverImageUrl}
            alt={photo.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center bg-gradient-to-br from-secondary to-muted">
            <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              {photo.shotOn} · {categoryLabel(photo.category)}
            </span>
            <span className="line-clamp-3 text-sm font-semibold">{photo.title}</span>
          </div>
        )}
        {adminUnlocked && (
          <div className="absolute top-2 right-2 z-10">
            <Link
              href={`/photos/${photo.id}/edit`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex min-h-[2.25rem] items-center border border-border bg-background/95 px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-sm hover:opacity-90"
            >
              Edit
            </Link>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          {photo.shotOn}
          <span className="mx-1.5 text-muted-foreground/60">·</span>
          {categoryLabel(photo.category)}
        </p>
        <span className="text-sm font-medium uppercase tracking-wide text-foreground">
          {photo.title}
        </span>
        {handle && igUrl ? (
          <span
            role="link"
            tabIndex={0}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              window.open(igUrl, '_blank', 'noopener,noreferrer')
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                e.stopPropagation()
                window.open(igUrl, '_blank', 'noopener,noreferrer')
              }
            }}
            className="type-caption hover:text-foreground transition-colors cursor-pointer underline-offset-2 hover:underline"
          >
            @{handle}
          </span>
        ) : photo.photographerDisplayName ? (
          <span className="type-caption">{photo.photographerDisplayName}</span>
        ) : null}
      </div>
    </motion.a>
  )
}

function filtersFromSearchParams(searchParams: ReturnType<typeof useSearchParams>) {
  const y = searchParams?.get('year') ?? ''
  const catParam = searchParams?.get('category') ?? ''
  const catOpt = PHOTO_FILTER_CATEGORIES.find((c) => c.value === catParam)
  const photographer = searchParams?.get('photographer') ?? ''
  return {
    selectedYear: y && FILTER_YEARS.includes(y) ? y : ('all' as const),
    selectedCategory: catOpt?.label ?? 'All',
    searchQuery: searchParams?.get('q') ?? '',
    selectedPhotographer: photographer || 'All',
  }
}

export function PhotosGallery() {
  const searchParams = useSearchParams()
  const isFirstLoad = useRef(true)
  const skipUrlSync = useRef(true)
  const initialFilters = useMemo(() => filtersFromSearchParams(searchParams), [searchParams])
  const [allPhotos, setAllPhotos] = useState<PhotoDto[]>([])
  const [photos, setPhotos] = useState<PhotoDto[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [isRefetching, setIsRefetching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState(initialFilters.searchQuery)
  const [selectedYear, setSelectedYear] = useState<'all' | string>(initialFilters.selectedYear)
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.selectedCategory)
  const [selectedPhotographer, setSelectedPhotographer] = useState(initialFilters.selectedPhotographer)
  const [sessionState, setSessionState] = useState<'loading' | 'guest' | 'admin'>('loading')

  const categoryApiValue = useMemo(() => {
    const opt = PHOTO_FILTER_CATEGORIES.find((c) => c.label === selectedCategory)
    return opt?.value ?? ''
  }, [selectedCategory])

  const syncUrl = useCallback(
    (next: { year: string; category: string; q: string; photographer?: string }) => {
      const qs = buildQuery({
        ...next,
        photographer: next.photographer ?? selectedPhotographer,
      })
      replacePhotosUrl(qs)
    },
    [selectedPhotographer]
  )

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/photos/unlock-new', { credentials: 'include' })
        const body = await res.json()
        if (cancelled) return
        setSessionState(res.ok && body.unlocked ? 'admin' : 'guest')
      } catch {
        if (!cancelled) setSessionState('guest')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (skipUrlSync.current) {
      skipUrlSync.current = false
      return
    }
    const t = window.setTimeout(() => {
      syncUrl({
        year: selectedYear === 'all' ? '' : selectedYear,
        category: categoryApiValue,
        q: searchQuery.trim(),
        photographer: selectedPhotographer,
      })
    }, searchQuery ? 300 : 0)
    return () => window.clearTimeout(t)
  }, [searchQuery, selectedYear, categoryApiValue, selectedPhotographer, syncUrl])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      if (!isFirstLoad.current) setIsRefetching(true)
      setError(null)
      try {
        const year = selectedYear === 'all' ? '' : selectedYear
        const qs = buildQuery({ year, category: categoryApiValue, q: searchQuery.trim() })
        const res = await fetch(`/api/photos${qs ? `?${qs}` : ''}`)
        const body = await res.json()
        if (!res.ok) throw new Error(body.error || 'Request failed')
        if (cancelled) return
        const list: PhotoDto[] = body.photos || []
        setPhotos(list)
        if (!year && !categoryApiValue && !searchQuery.trim()) {
          setAllPhotos(list)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load')
          setPhotos([])
        }
      } finally {
        if (!cancelled) {
          isFirstLoad.current = false
          setInitialLoading(false)
          setIsRefetching(false)
        }
      }
    }
    const t = window.setTimeout(load, searchQuery ? 300 : 0)
    return () => {
      cancelled = true
      window.clearTimeout(t)
    }
  }, [selectedYear, categoryApiValue, searchQuery])

  useEffect(() => {
    if (allPhotos.length > 0) return
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/photos')
        const body = await res.json()
        if (!cancelled && res.ok) setAllPhotos(body.photos || [])
      } catch {
        /* ignore */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [allPhotos.length])

  const photographerOptions = useMemo(
    () => extractPhotographerNames(allPhotos.length ? allPhotos : photos),
    [allPhotos, photos]
  )

  const filteredAlbums = useMemo(() => {
    if (selectedPhotographer === 'All') return photos
    return photos.filter((p) => p.photographerDisplayName?.trim() === selectedPhotographer)
  }, [photos, selectedPhotographer])

  const updateYear = (year: 'all' | string) => {
    setSelectedYear(year)
  }

  const updateCategory = (label: string) => {
    setSelectedCategory(label)
  }

  const updateSearch = (q: string) => {
    setSearchQuery(q)
  }

  const updatePhotographer = (name: string) => {
    setSelectedPhotographer(name)
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedYear('all')
    setSelectedCategory('All')
    setSelectedPhotographer('All')
    replacePhotosUrl('')
  }

  const onAdminSignOut = async () => {
    try {
      await fetch('/api/photos/unlock-new', { method: 'DELETE', credentials: 'include' })
    } catch {
      /* ignore */
    }
    setSessionState('guest')
  }

  const adminUnlocked = sessionState === 'admin'
  const yearButtons = FILTER_YEARS.map((y) => Number(y))

  return (
    <main className="min-h-screen bg-background">
      <PageHero
        title="PHOTOS"
        description="Run memories from the crew — tap any album to open the full gallery on Google Photos."
      />

      {adminUnlocked && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 md:bottom-8 md:right-8">
          <Link
            href="/photos/new"
            className="inline-flex items-center border border-border bg-foreground px-4 py-2.5 text-sm font-medium text-background shadow-md hover:opacity-90"
          >
            Add entry
          </Link>
          <button
            type="button"
            onClick={onAdminSignOut}
            className="border border-border bg-background/95 px-3 py-1.5 text-xs text-muted-foreground shadow-sm backdrop-blur-sm hover:text-foreground"
          >
            Sign out
          </button>
        </div>
      )}

      <section className="py-6 px-6 md:px-12 border-y border-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search photos..."
              value={searchQuery}
              onChange={(e) => updateSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground rounded-none focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="type-caption shrink-0">Year:</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => updateYear('all')}
                  className={`px-3 py-1.5 text-sm transition-colors ${
                    selectedYear === 'all'
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  All
                </button>
                {yearButtons.map((year) => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => updateYear(String(year))}
                    className={`px-3 py-1.5 text-sm transition-colors ${
                      selectedYear === String(year)
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="type-caption shrink-0">Category:</span>
              <FilterSelect
                value={selectedCategory}
                onValueChange={updateCategory}
                options={PHOTO_FILTER_CATEGORIES.map((cat) => ({
                  value: cat.label,
                  label: cat.label,
                }))}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="type-caption shrink-0">Photographer:</span>
              <FilterSelect
                value={selectedPhotographer}
                onValueChange={updatePhotographer}
                triggerClassName="min-w-[9.5rem] max-w-[14rem]"
                options={[
                  { value: 'All', label: 'All' },
                  ...photographerOptions.map((name) => ({
                    value: name,
                    label: name,
                  })),
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-6 md:px-12">
        <div>
          {error && (
            <p className="mb-4 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          {initialLoading && (
            <p className="type-body text-muted-foreground py-8">Loading…</p>
          )}

          {!initialLoading && filteredAlbums.length > 0 && (
            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 transition-opacity duration-200 ${
                isRefetching ? 'opacity-60' : 'opacity-100'
              }`}
            >
              {filteredAlbums.map((photo) => (
                <PhotoAlbumCard
                  key={photo.id}
                  photo={photo}
                  adminUnlocked={adminUnlocked}
                />
              ))}
            </div>
          )}

          {!initialLoading && !error && filteredAlbums.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32">
              <p className="type-h3 text-muted-foreground">No photos found</p>
              <p className="type-caption mt-2">
                Try adjusting your search or filters
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="mt-6 px-4 py-2 text-sm bg-foreground text-background hover:bg-foreground/90 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="py-8 px-6 md:px-12 border-t border-border">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="type-caption">
            Photos are hosted on Google Photos. Click any album to view the full gallery.
          </p>
          <p className="type-caption">
            {initialLoading
              ? '…'
              : `${filteredAlbums.length} album${filteredAlbums.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
      </section>
    </main>
  )
}
