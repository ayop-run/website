'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Lock } from 'lucide-react'

type LoadState = 'loading' | 'ready' | 'error'

export function BenefitsPasswordSettings() {
  const [state, setState] = useState<LoadState>('loading')
  const [loadError, setLoadError] = useState<string | null>(null)
  const [current, setCurrent] = useState('')
  const [draft, setDraft] = useState('')
  const [reveal, setReveal] = useState(false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<number | null>(null)

  const load = async () => {
    setState('loading')
    setLoadError(null)
    try {
      const res = await fetch('/api/benefits/settings', {
        credentials: 'include',
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body?.error || `Failed (${res.status})`)
      const value =
        typeof body?.memberPassword === 'string' ? body.memberPassword : ''
      setCurrent(value)
      setDraft(value)
      setState('ready')
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load')
      setState('error')
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onSave = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaveError(null)
    try {
      const res = await fetch('/api/benefits/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ memberPassword: draft.trim() }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body?.error || `Failed (${res.status})`)
      const value =
        typeof body?.memberPassword === 'string' ? body.memberPassword : draft
      setCurrent(value)
      setDraft(value)
      setEditing(false)
      setSavedAt(Date.now())
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const onCancel = () => {
    setDraft(current)
    setEditing(false)
    setSaveError(null)
  }

  return (
    <section
      aria-labelledby="benefits-password-heading"
      className="border border-border p-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2
            id="benefits-password-heading"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <Lock className="h-4 w-4" aria-hidden />
            Members password
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Visitors enter this on <code>/benefits</code> to unlock the perks
            page. Sessions stay signed in for up to 30 days.
          </p>
        </div>
      </div>

      <div className="mt-4">
        {state === 'loading' && (
          <p className="text-sm text-muted-foreground">Loading…</p>
        )}

        {state === 'error' && (
          <div className="space-y-2">
            <p className="text-sm text-destructive" role="alert">
              {loadError ?? 'Failed to load the current password.'}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={load}
              className="rounded-none"
            >
              Retry
            </Button>
          </div>
        )}

        {state === 'ready' && !editing && (
          <div className="flex flex-wrap items-center gap-3">
            <Label className="text-muted-foreground">Current:</Label>
            <code className="border border-border bg-muted px-2 py-1 font-mono text-sm">
              {reveal ? current || '—' : '•'.repeat(Math.max(8, current.length))}
            </code>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setReveal((v) => !v)}
              className="gap-1 rounded-none"
              aria-label={reveal ? 'Hide password' : 'Show password'}
            >
              {reveal ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              {reveal ? 'Hide' : 'Show'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setEditing(true)
                setSavedAt(null)
              }}
              className="rounded-none"
            >
              Change password
            </Button>
            {savedAt && (
              <span className="text-sm text-muted-foreground">
                Saved just now.
              </span>
            )}
          </div>
        )}

        {state === 'ready' && editing && (
          <form onSubmit={onSave} className="mt-2 space-y-3" noValidate>
            <Label htmlFor="benefits-password-input">New password</Label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input
                id="benefits-password-input"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                type={reveal ? 'text' : 'password'}
                autoComplete="off"
                minLength={4}
                maxLength={120}
                required
                className="rounded-none sm:max-w-sm"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setReveal((v) => !v)}
                className="gap-1 rounded-none sm:w-auto"
              >
                {reveal ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                {reveal ? 'Hide' : 'Show'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Changing this does not sign out existing members; their cookies
              stay valid until they expire (max 30 days).
            </p>
            {saveError && (
              <p className="text-sm text-destructive" role="alert">
                {saveError}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="rounded-none"
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-none"
                disabled={saving || draft.trim().length < 4 || draft === current}
              >
                {saving ? 'Saving…' : 'Save password'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
