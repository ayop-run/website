'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { photoAlbums, availableYears, photoCategories, photographers } from '@/lib/data'

export default function PhotosPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPhotographer, setSelectedPhotographer] = useState('All')

  const filteredAlbums = useMemo(() => {
    return photoAlbums.filter((album) => {
      const matchesSearch = searchQuery === '' || 
        album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        album.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        album.photographer.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesYear = selectedYear === 'all' || album.year === selectedYear
      const matchesCategory = selectedCategory === 'All' || album.category === selectedCategory
      const matchesPhotographer = selectedPhotographer === 'All' || album.photographer === selectedPhotographer
      
      return matchesSearch && matchesYear && matchesCategory && matchesPhotographer
    })
  }, [searchQuery, selectedYear, selectedCategory, selectedPhotographer])

  // Vertical offset patterns for each position in a row of 3
  const getVerticalOffset = (index: number) => {
    const positionInRow = index % 3
    const rowIndex = Math.floor(index / 3)
    
    // Alternate patterns for variety
    if (rowIndex % 2 === 0) {
      // Pattern A: left high, center low, right mid
      if (positionInRow === 0) return 'mt-0'
      if (positionInRow === 1) return 'mt-16 md:mt-24'
      return 'mt-8 md:mt-12'
    } else {
      // Pattern B: left mid, center high, right low
      if (positionInRow === 0) return 'mt-12 md:mt-20'
      if (positionInRow === 1) return 'mt-0'
      return 'mt-20 md:mt-32'
    }
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        {/* Header Section */}
        <section className="pt-24 pb-8 px-6 md:px-12 lg:px-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground uppercase"
            >
              Gallery With Runners.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Join us for an exciting event to explore our journey! Our schedule includes sessions 
              reflecting our core values. Don&apos;t miss this chance to connect!
            </motion.p>
          </div>
        </section>

        {/* Filters Section */}
        <section className="py-6 px-6 md:px-12 lg:px-24 border-y border-border">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search photos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 transition-all text-sm"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* Year Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Year:</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setSelectedYear('all')}
                    className={`px-3 py-1.5 text-sm transition-colors ${
                      selectedYear === 'all' 
                        ? 'bg-foreground text-background' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    All
                  </button>
                  {availableYears.map((year) => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={`px-3 py-1.5 text-sm transition-colors ${
                        selectedYear === year 
                          ? 'bg-foreground text-background' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Category:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1.5 text-sm bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 cursor-pointer"
                >
                  {photoCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Photographer Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Photographer:</span>
                <select
                  value={selectedPhotographer}
                  onChange={(e) => setSelectedPhotographer(e.target.value)}
                  className="px-3 py-1.5 text-sm bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 cursor-pointer"
                >
                  <option value="All">All</option>
                  {photographers.map((p) => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16 px-6 md:px-12 lg:px-24">
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              {filteredAlbums.length > 0 ? (
                <motion.div
                  key="photos"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-x-8 md:gap-x-16 lg:gap-x-24 gap-y-16"
                >
                  {filteredAlbums.map((album, index) => (
                    <motion.a
                      key={album.id}
                      href={album.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { duration: 0.5, delay: index * 0.08 }
                      }}
                      whileHover={{ y: -5 }}
                      className={`group block ${getVerticalOffset(index)}`}
                    >
                      {/* Photo */}
                      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
                        <Image
                          src={album.coverImage}
                          alt={album.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      
                      {/* Label */}
                      <div className="mt-4 flex items-start gap-4">
                        <span className="text-sm text-muted-foreground font-medium">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium text-foreground uppercase tracking-wide">
                            {album.title}
                          </span>
                          <a
                            href={album.photographerInstagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                          >
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                            @{album.photographer}
                          </a>
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-32"
                >
                  <p className="text-muted-foreground text-lg">No photos found</p>
                  <p className="text-muted-foreground text-sm mt-2">Try adjusting your search or filters</p>
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedYear('all')
                      setSelectedCategory('All')
                      setSelectedPhotographer('All')
                    }}
                    className="mt-6 px-4 py-2 text-sm bg-foreground text-background hover:bg-foreground/90 transition-colors"
                  >
                    Clear all filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Info Banner */}
        <section className="py-8 px-6 md:px-12 lg:px-24 border-t border-border">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Photos are hosted on Google Photos. Click any album to view the full gallery.
            </p>
            <p className="text-sm text-muted-foreground">
              {filteredAlbums.length} album{filteredAlbums.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
