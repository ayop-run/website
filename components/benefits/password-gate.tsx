'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, AlertCircle, Lock } from 'lucide-react'

interface PasswordGateProps {
  /** Verify the candidate against the server. Returns ok on success. */
  verifyPassword: (
    password: string,
  ) => Promise<{ ok: true } | { ok: false; error: string }>
  onSuccess: () => void
}

const PREVIEW_BRANDS: string[] = [
  // 'ON Running',
  // 'Maurten',
  // 'Tracksmith',
  // 'Coros',
  // 'Satisfy',
  // 'Goodr',
]

export function PasswordGate({ verifyPassword, onSuccess }: PasswordGateProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await verifyPassword(password)
    if (result.ok) {
      onSuccess()
    } else {
      setError(result.error)
      setPassword('')
    }
    setIsLoading(false)
  }

  return (
    <section className="border-t border-border bg-card">
      <div className="grid grid-cols-1 gap-12 px-6 md:px-12 py-16 md:py-24 lg:grid-cols-2 lg:gap-16">
        {/* Left — Pitch */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="type-eyebrow text-muted-foreground inline-flex items-center gap-2">
            <Lock className="h-3.5 w-3.5" aria-hidden />
            Members Only
          </p>
          <h2 className="mt-4 type-h2">Run perks, on us.</h2>
          <p className="mt-4 type-body text-foreground">
            A growing list of partner discounts — kit, fuel, recovery, and more — picked for the crew.
          </p>
          <p className="mt-2 type-body text-muted-foreground">
            Ask for the password at any session to organizers.
          </p>

          <ul className="mt-8 flex flex-wrap gap-2">
            {PREVIEW_BRANDS.map((brand) => (
              <li
                key={brand}
                className="border border-border px-3 py-1 text-xs text-muted-foreground"
              >
                {brand}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Right — Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="lg:border-l lg:border-border lg:pl-16"
        >
          <div className="mx-auto w-full max-w-sm lg:mx-0">
            <p className="type-eyebrow text-muted-foreground">Crew password</p>
            <h3 className="mt-4 type-h3">Enter to access benefits.</h3>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-none pr-12 text-base"
                  autoFocus
                  disabled={isLoading}
                  aria-label="Member password"
                  aria-invalid={Boolean(error)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((open) => !open)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-center gap-2 text-sm text-destructive"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="h-12 w-full rounded-none"
                disabled={!password || isLoading}
              >
                {isLoading ? 'Verifying…' : 'Unlock benefits'}
              </Button>
            </form>

            {/* <p className="mt-6 text-sm text-muted-foreground">
              No password?{' '}
              <a
                href="https://www.instagram.com/ayop.run/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-foreground"
              >
                Message us on Instagram
              </a>
              .
            </p> */}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
