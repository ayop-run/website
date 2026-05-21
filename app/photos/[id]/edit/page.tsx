'use client'

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { PhotographerFormFields } from '@/components/photos/photographer-form-fields'
import { categoryLabel, PHOTO_CATEGORIES } from '@/lib/photos/client'

export default function PhotoEditPage() {
  const router = useRouter()
  const params = useParams()
  const id = params && typeof params.id === 'string' ? params.id : ''
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [adminSession, setAdminSession] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    externalAlbumUrl: '',
    coverImageUrl: '',
    shotOn: '',
    category: 'TRACK_SESSION',
    photographerDisplayName: '',
    photographerInstagramUsername: '',
    password: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      setAdminSession(false)
      try {
        const [unlockRes, photoRes] = await Promise.all([
          fetch('/api/photos/unlock-new', { credentials: 'include' }),
          fetch(`/api/photos/${encodeURIComponent(id)}`),
        ])
        const unlockBody = await unlockRes.json().catch(() => ({}))
        const body = await photoRes.json()
        if (!cancelled) {
          setAdminSession(Boolean(unlockRes.ok && unlockBody.unlocked))
        }
        if (!photoRes.ok) throw new Error(body.error || 'Not found')
        const p = body.photo
        if (!cancelled) {
          setForm({
            title: p.title,
            description: p.description || '',
            externalAlbumUrl: p.externalAlbumUrl,
            coverImageUrl: p.coverImageUrl || '',
            shotOn: p.shotOn,
            category: p.category,
            photographerDisplayName: p.photographerDisplayName || '',
            photographerInstagramUsername: p.photographerInstagramUsername || '',
            password: '',
          })
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Error')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  const onChange =
    (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }))
    }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!id) return
    setSubmitting(true)
    setSaveError(null)
    try {
      const payload: Record<string, unknown> = {
        title: form.title,
        description: form.description || null,
        externalAlbumUrl: form.externalAlbumUrl,
        coverImageUrl: form.coverImageUrl.trim() === '' ? null : form.coverImageUrl.trim(),
        shotOn: form.shotOn,
        category: form.category,
        photographerDisplayName: form.photographerDisplayName || null,
        photographerInstagramUsername: form.photographerInstagramUsername || null,
      }
      if (!adminSession && form.password.trim()) {
        payload.password = form.password
      }
      const res = await fetch(`/api/photos/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || 'Failed to update')
      router.push('/photos')
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Failed to update')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = 'mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2'

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-24 px-6 md:px-12 pb-16">
        <div className="max-w-xl mx-auto">
          <p className="text-sm mb-6">
            <Link href="/photos" className="text-muted-foreground hover:text-foreground">
              ← All photos
            </Link>
          </p>
          <h1 className="type-h2 mb-6">Edit entry</h1>

          {loading && <p className="text-muted-foreground">Loading…</p>}
          {error && (
            <p className="text-destructive" role="alert">
              {error}
            </p>
          )}

          {!loading && !error && (
            <form onSubmit={onSubmit} className="space-y-4">
              <label className="block text-sm">
                <span className="text-muted-foreground">Album URL</span>
                <input
                  required
                  type="url"
                  value={form.externalAlbumUrl}
                  onChange={onChange('externalAlbumUrl')}
                  className={inputClass}
                />
              </label>
              <label className="block text-sm">
                <span className="text-muted-foreground">Cover image URL (optional)</span>
                <input
                  type="url"
                  value={form.coverImageUrl}
                  onChange={onChange('coverImageUrl')}
                  className={inputClass}
                />
              </label>
              <label className="block text-sm">
                <span className="text-muted-foreground">Title</span>
                <input
                  required
                  value={form.title}
                  onChange={onChange('title')}
                  className={inputClass}
                />
              </label>
              <label className="block text-sm">
                <span className="text-muted-foreground">Session date</span>
                <input
                  required
                  type="date"
                  value={form.shotOn}
                  onChange={onChange('shotOn')}
                  className={inputClass}
                />
              </label>
              <label className="block text-sm">
                <span className="text-muted-foreground">Category</span>
                <select value={form.category} onChange={onChange('category')} className={inputClass}>
                  {PHOTO_CATEGORIES.map((key) => (
                    <option key={key} value={key}>
                      {categoryLabel(key)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="text-muted-foreground">Description (optional)</span>
                <textarea
                  value={form.description}
                  onChange={onChange('description')}
                  rows={3}
                  className={inputClass}
                />
              </label>
              <PhotographerFormFields
                photographerDisplayName={form.photographerDisplayName}
                photographerInstagramUsername={form.photographerInstagramUsername}
                onChange={onChange}
                nameOptionalLabel
              />
              {!adminSession && (
                <label className="block text-sm">
                  <span className="text-muted-foreground">Admin password</span>
                  <input
                    required
                    type="password"
                    value={form.password}
                    onChange={onChange('password')}
                    className={inputClass}
                  />
                </label>
              )}
              {saveError && (
                <p className="text-sm text-destructive" role="alert">
                  {saveError}
                </p>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
                >
                  {submitting ? 'Saving…' : 'Save'}
                </button>
                <Link
                  href="/photos"
                  className="rounded-full border border-border px-4 py-2 text-sm inline-flex items-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
