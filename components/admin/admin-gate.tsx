'use client'

import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function readSafeNextPath(next: string | null): string | null {
  if (next == null) return null
  let decoded = next.trim()
  try {
    decoded = decodeURIComponent(decoded)
  } catch {
    return null
  }
  if (!decoded.startsWith('/') || decoded.startsWith('//')) return null
  if (decoded.includes('://')) return null
  return decoded
}

type Props = {
  children: ReactNode
  showSignOut?: boolean
}

export function AdminGate({ children, showSignOut = true }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [sessionState, setSessionState] = useState<'loading' | 'guest' | 'admin'>('loading')
  const [password, setPassword] = useState('')
  const [rememberDevice, setRememberDevice] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

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
    if (sessionState !== 'admin') return
    const safe = readSafeNextPath(searchParams?.get('next') ?? null)
    if (safe) router.replace(safe, { scroll: false })
  }, [sessionState, searchParams, router])

  const onSignIn = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/photos/unlock-new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password, remember: rememberDevice }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || 'Sign-in failed')
      setPassword('')
      setSessionState('admin')
      const safe = readSafeNextPath(searchParams?.get('next') ?? null)
      if (safe) router.replace(safe, { scroll: false })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed')
    } finally {
      setSubmitting(false)
    }
  }

  const onSignOut = async () => {
    try {
      await fetch('/api/photos/unlock-new', { method: 'DELETE', credentials: 'include' })
    } catch {
      /* ignore */
    }
    setSessionState('guest')
  }

  if (sessionState === 'loading') {
    return <p className="text-muted-foreground">Loading…</p>
  }

  if (sessionState === 'guest') {
    return (
      <form onSubmit={onSignIn} className="max-w-sm space-y-3 rounded-lg border border-border p-4">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Your browser can save this sign-in. Use a fixed account name below so your password app
          pairs it with your password.
        </p>
        <label htmlFor="admin-gate-username" className="block text-sm">
          <span className="text-muted-foreground">Account name (for saved password)</span>
          <input
            id="admin-gate-username"
            name="username"
            type="text"
            readOnly
            autoComplete="username"
            defaultValue="AYOP admin"
            className="mt-1 w-full cursor-default rounded-md border border-input bg-muted px-3 py-2 text-sm"
            aria-readonly
          />
        </label>
        <label htmlFor="admin-gate-password" className="block text-sm">
          <span className="text-muted-foreground">Admin password</span>
          <input
            id="admin-gate-password"
            name="password"
            required
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2"
          />
        </label>
        <label htmlFor="admin-gate-remember" className="flex cursor-pointer items-start gap-2 text-sm">
          <input
            id="admin-gate-remember"
            type="checkbox"
            checked={rememberDevice}
            onChange={(e) => setRememberDevice(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0"
          />
          <span className="text-muted-foreground leading-snug">
            Stay signed in on this device (up to 30 days).
          </span>
        </label>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    )
  }

  return (
    <div className="space-y-6">
      {showSignOut && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onSignOut}
            className="text-sm text-muted-foreground underline hover:text-foreground"
          >
            Sign out
          </button>
        </div>
      )}
      {children}
    </div>
  )
}
