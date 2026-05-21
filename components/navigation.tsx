'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { getHomeHref, getPublicNavLinks, isPhotosOnlyProduction } from '@/lib/site-mode'
import { SiteLogo } from '@/components/site-logo'
import { Sun, Moon } from 'lucide-react'

export function Navigation() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { setTheme } = useTheme()
  const navLinks = getPublicNavLinks()
  const homeHref = getHomeHref()
  const showSiteNav = !isPhotosOnlyProduction()

  const toggleTheme = () => {
    const root = document.documentElement
    const isDark = root.classList.contains('dark')
    const next = isDark ? 'light' : 'dark'
    root.classList.remove('light', 'dark')
    root.classList.add(next)
    root.style.colorScheme = next
    setTheme(next)
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <nav className="px-6 md:px-12">
          <div className="flex h-14 items-center justify-between gap-6 md:gap-8">
            {/* Logo */}
            <Link
              href={homeHref}
              className="inline-flex shrink-0 items-center"
              aria-label="AYOP home"
            >
              <SiteLogo className="h-5" />
            </Link>

            {/* Desktop Navigation */}
            {showSiteNav && (
            <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-colors duration-200 link-underline ${
                    pathname === link.href 
                      ? 'text-foreground' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            )}

            {/* Right Side - Location, Theme Toggle, CTA */}
            <div className="hidden md:flex items-center gap-6">
              <span className="text-sm text-muted-foreground">Berlin, DE</span>
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="relative p-2 rounded-full hover:bg-secondary transition-colors duration-200"
                aria-label="Toggle theme"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </button>

              <a
                href="https://www.instagram.com/ayop.run/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium px-4 py-2 bg-foreground text-background rounded-full hover:opacity-90 transition-opacity duration-200"
              >
                Join Us
              </a>
            </div>

            {/* Mobile - Theme Toggle & Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={toggleTheme}
                className="relative p-2 rounded-full hover:bg-secondary transition-colors duration-200"
                aria-label="Toggle theme"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </button>
              
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 -mr-2"
                aria-label="Toggle menu"
              >
                <div className="w-6 flex flex-col gap-1.5">
                  <motion.span
                    animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                    className="w-full h-px bg-foreground origin-center"
                  />
                  <motion.span
                    animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                    className="w-full h-px bg-foreground"
                  />
                  <motion.span
                    animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                    className="w-full h-px bg-foreground origin-center"
                  />
                </div>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-14 z-40 bg-background border-b border-border md:hidden"
          >
            <nav className="px-6 py-6 space-y-4">
              {showSiteNav && navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block text-lg transition-colors duration-200 ${
                    pathname === link.href 
                      ? 'text-foreground' 
                      : 'text-muted-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-border">
                <span className="block text-sm text-muted-foreground mb-3">Based in Berlin, Germany</span>
                <a
                  href="https://www.instagram.com/ayop.run/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm font-medium px-4 py-2 bg-foreground text-background rounded-full"
                >
                  Join Us
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
