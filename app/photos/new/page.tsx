'use client'

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { PhotographerFormFields } from '@/components/photos/photographer-form-fields'
import { categoryLabel, PHOTO_CATEGORIES } from '@/lib/photos/client'

const emptyForm = {
  title: '',
  description: '',
  externalAlbumUrl: '',
  coverImageUrl: '',
  shotOn: '',
  category: 'TRACK_SESSION',
  photographerDisplayName: '',
  photographerInstagramUsername: '',
  password: '',
}

export default function PhotosNewPage() {
  const router = useRouter()
  const [step, setStep] = useState<'checking' | 'form'>('checking')
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/photos/unlock-new', { credentials: 'include' })
        const body = await res.json()
        if (cancelled) return
        if (res.ok && body.unlocked) {
          setStep('form')
        } else {
          window.location.assign(`/admin?next=${encodeURIComponent('/photos/new')}`)
        }
      } catch {
        if (!cancelled) {
          window.location.assign(`/admin?next=${encodeURIComponent('/photos/new')}`)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const onChange =
    (field: keyof typeof emptyForm) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }))
    }

  const onSubmitForm = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setFormError(null)
    try {
      const body: Record<string, unknown> = {
        title: form.title,
        description: form.description || null,
        externalAlbumUrl: form.externalAlbumUrl,
        shotOn: form.shotOn,
        category: form.category,
        photographerDisplayName: form.photographerDisplayName || null,
        photographerInstagramUsername: form.photographerInstagramUsername || null,
      }
      const trimmedCover = form.coverImageUrl.trim()
      if (trimmedCover) body.coverImageUrl = trimmedCover
      if (form.password.trim()) body.password = form.password

      const res = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')
      router.push('/photos')
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save')
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

          {step === 'checking' && <p className="text-muted-foreground">Checking sign-in…</p>}

          {step === 'form' && (
            <>
              <h1 className="type-h2 mb-6">New entry</h1>
              <form onSubmit={onSubmitForm} className="space-y-4">
                <label className="block text-sm">
                  <span className="text-muted-foreground">Album URL</span>
                  <input
                    required
                    type="url"
                    value={form.externalAlbumUrl}
                    onChange={onChange('externalAlbumUrl')}
                    className={inputClass}
                    placeholder="https://"
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-muted-foreground">Cover image URL (optional)</span>
                  <input
                    type="url"
                    value={form.coverImageUrl}
                    onChange={onChange('coverImageUrl')}
                    className={inputClass}
                    placeholder="https://…"
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
                  <select
                    value={form.category}
                    onChange={onChange('category')}
                    className={inputClass}
                  >
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
                <label className="block text-sm">
                  <span className="text-muted-foreground">
                    Admin password (only if sign-in expired)
                  </span>
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={form.password}
                    onChange={onChange('password')}
                    className={inputClass}
                  />
                </label>
                {formError && (
                  <p className="text-sm text-destructive" role="alert">
                    {formError}
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
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
