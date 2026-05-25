'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Pencil, Plus, Trash2, X } from 'lucide-react'
import type {
  BenefitDto,
  BenefitInput,
  BenefitKind,
  BenefitRedemption,
} from '@/lib/benefits/types'
import {
  BENEFIT_CATEGORY_SUGGESTIONS,
  BENEFIT_REDEMPTION_LABEL,
  BENEFIT_REDEMPTION_VALUES,
} from '@/lib/benefits/constants'

type Editing =
  | { mode: 'create' }
  | { mode: 'edit'; benefit: BenefitDto }
  | null

type FormState = {
  brand: string
  description: string
  kind: BenefitKind
  redemption: BenefitRedemption
  discountCode: string
  qrImageUrl: string
  locations: string
  discountValue: string
  category: string
  storeUrl: string
  expiresAt: string
  displayOrder: string
  isPublished: boolean
}

const EMPTY_FORM: FormState = {
  brand: '',
  description: '',
  kind: 'code',
  redemption: 'online',
  discountCode: '',
  qrImageUrl: '',
  locations: '',
  discountValue: '',
  category: '',
  storeUrl: '',
  expiresAt: '',
  displayOrder: '0',
  isPublished: true,
}

function fromBenefit(b: BenefitDto): FormState {
  return {
    brand: b.brand,
    description: b.description ?? '',
    kind: b.kind,
    redemption: b.redemption ?? 'online',
    discountCode: b.discountCode ?? '',
    qrImageUrl: b.qrImageUrl ?? '',
    locations: (b.locations ?? []).join(', '),
    discountValue: b.discountValue,
    category: b.category,
    storeUrl: b.storeUrl,
    expiresAt: b.expiresAt ?? '',
    displayOrder: String(b.displayOrder ?? 0),
    isPublished: b.isPublished !== false,
  }
}

function toPayload(form: FormState): BenefitInput {
  return {
    brand: form.brand.trim(),
    description: form.description.trim() ? form.description.trim() : null,
    kind: form.kind,
    redemption: form.redemption,
    discountCode: form.kind === 'code' ? form.discountCode.trim() : null,
    qrImageUrl: form.kind === 'qr' ? form.qrImageUrl.trim() : null,
    locations: form.locations
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean),
    discountValue: form.discountValue.trim(),
    category: form.category.trim(),
    storeUrl: form.storeUrl.trim(),
    expiresAt: form.expiresAt.trim() ? form.expiresAt.trim() : null,
    displayOrder: Number(form.displayOrder) || 0,
    isPublished: form.isPublished,
  }
}

export function BenefitsAdmin() {
  const [benefits, setBenefits] = useState<BenefitDto[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [editing, setEditing] = useState<Editing>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const loadBenefits = async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const res = await fetch('/api/benefits?all=1', { credentials: 'include' })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body?.error || `Failed (${res.status})`)
      setBenefits(Array.isArray(body?.benefits) ? body.benefits : [])
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load benefits')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBenefits()
  }, [])

  const openCreate = () => {
    setEditing({ mode: 'create' })
    setForm(EMPTY_FORM)
    setSubmitError(null)
  }

  const openEdit = (benefit: BenefitDto) => {
    setEditing({ mode: 'edit', benefit })
    setForm(fromBenefit(benefit))
    setSubmitError(null)
  }

  const closeForm = () => {
    setEditing(null)
    setSubmitError(null)
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!editing) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const payload = toPayload(form)
      const isCreate = editing.mode === 'create'
      const url = isCreate
        ? '/api/benefits'
        : `/api/benefits/${editing.benefit.id}`
      const res = await fetch(url, {
        method: isCreate ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body?.error || `Failed (${res.status})`)
      closeForm()
      await loadBenefits()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSubmitting(false)
    }
  }

  const onDelete = async (benefit: BenefitDto) => {
    if (
      typeof window !== 'undefined' &&
      !window.confirm(`Delete benefit "${benefit.brand}"? This cannot be undone.`)
    ) {
      return
    }
    setPendingDeleteId(benefit.id)
    try {
      const res = await fetch(`/api/benefits/${benefit.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok && res.status !== 204) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || `Failed (${res.status})`)
      }
      await loadBenefits()
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setPendingDeleteId(null)
    }
  }

  const categorySuggestions = useMemo(() => {
    const used = new Set(benefits.map((b) => b.category).filter(Boolean))
    for (const c of BENEFIT_CATEGORY_SUGGESTIONS) used.add(c)
    return Array.from(used).sort((a, b) => a.localeCompare(b))
  }, [benefits])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {benefits.length} {benefits.length === 1 ? 'benefit' : 'benefits'}
          </p>
        </div>
        <Button
          type="button"
          onClick={openCreate}
          className="gap-2 rounded-none"
          disabled={Boolean(editing)}
        >
          <Plus className="h-4 w-4" />
          Add benefit
        </Button>
      </div>

      {editing && (
        <BenefitForm
          mode={editing.mode}
          form={form}
          setForm={setForm}
          onCancel={closeForm}
          onSubmit={onSubmit}
          submitting={submitting}
          error={submitError}
          categorySuggestions={categorySuggestions}
        />
      )}

      {loadError && (
        <p className="text-sm text-destructive" role="alert">
          {loadError}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading benefits…</p>
      ) : benefits.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No benefits yet. Click <strong>Add benefit</strong> to create one.
        </p>
      ) : (
        <ul className="divide-y divide-border border border-border">
          {benefits.map((b) => (
            <li key={b.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <strong className="text-foreground">{b.brand}</strong>
                  <Badge variant="secondary">{b.category}</Badge>
                  <Badge variant="outline">{b.kind === 'qr' ? 'QR' : 'Code'}</Badge>
                  <Badge variant="outline">{BENEFIT_REDEMPTION_LABEL[b.redemption]}</Badge>
                  {!b.isPublished && <Badge variant="destructive">Hidden</Badge>}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {b.discountValue}
                  {b.kind === 'code' && b.discountCode ? ` · ${b.discountCode}` : ''}
                  {b.expiresAt ? ` · expires ${b.expiresAt}` : ' · no expiry'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => openEdit(b)}
                  className="gap-1 rounded-none"
                  disabled={Boolean(editing)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(b)}
                  className="gap-1 rounded-none text-destructive hover:text-destructive"
                  disabled={pendingDeleteId === b.id || Boolean(editing)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {pendingDeleteId === b.id ? 'Deleting…' : 'Delete'}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

interface BenefitFormProps {
  mode: 'create' | 'edit'
  form: FormState
  setForm: React.Dispatch<React.SetStateAction<FormState>>
  onCancel: () => void
  onSubmit: (e: FormEvent) => void
  submitting: boolean
  error: string | null
  categorySuggestions: string[]
}

function BenefitForm({
  mode,
  form,
  setForm,
  onCancel,
  onSubmit,
  submitting,
  error,
  categorySuggestions,
}: BenefitFormProps) {
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 border border-border p-4"
      noValidate
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {mode === 'create' ? 'Add benefit' : 'Edit benefit'}
        </h2>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onCancel}
          aria-label="Close form"
          className="rounded-none"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label="Brand" required>
          <Input
            value={form.brand}
            onChange={(e) => set('brand', e.target.value)}
            required
            maxLength={500}
            className="rounded-none"
          />
        </Field>

        <Field label="Discount value" required hint="e.g. 20% off">
          <Input
            value={form.discountValue}
            onChange={(e) => set('discountValue', e.target.value)}
            required
            maxLength={120}
            className="rounded-none"
          />
        </Field>

        <Field label="Category" required>
          <Input
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
            required
            list="benefits-category-suggestions"
            className="rounded-none"
          />
          <datalist id="benefits-category-suggestions">
            {categorySuggestions.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>

        <Field label="Store URL" required hint="https://…">
          <Input
            type="url"
            value={form.storeUrl}
            onChange={(e) => set('storeUrl', e.target.value)}
            required
            className="rounded-none"
          />
        </Field>

        <Field label="Type" required>
          <div className="flex gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 border border-border px-3 py-2 text-sm">
              <input
                type="radio"
                name="kind"
                checked={form.kind === 'code'}
                onChange={() => set('kind', 'code')}
              />
              <span>Code</span>
            </label>
            <label className="inline-flex cursor-pointer items-center gap-2 border border-border px-3 py-2 text-sm">
              <input
                type="radio"
                name="kind"
                checked={form.kind === 'qr'}
                onChange={() => set('kind', 'qr')}
              />
              <span>QR / voucher image</span>
            </label>
          </div>
        </Field>

        <Field label="Redemption" required>
          <div className="flex flex-wrap gap-2">
            {BENEFIT_REDEMPTION_VALUES.map((value) => (
              <label
                key={value}
                className="inline-flex cursor-pointer items-center gap-2 border border-border px-3 py-2 text-sm"
              >
                <input
                  type="radio"
                  name="redemption"
                  checked={form.redemption === value}
                  onChange={() => set('redemption', value)}
                />
                <span>{BENEFIT_REDEMPTION_LABEL[value]}</span>
              </label>
            ))}
          </div>
        </Field>

        {form.kind === 'code' ? (
          <Field label="Discount code" required hint="e.g. AYOP20">
            <Input
              value={form.discountCode}
              onChange={(e) => set('discountCode', e.target.value)}
              required
              maxLength={120}
              className="rounded-none"
            />
          </Field>
        ) : (
          <Field
            label="QR image URL"
            required
            hint="Path under /public (e.g. /images/foo.jpg) or full https URL"
          >
            <Input
              value={form.qrImageUrl}
              onChange={(e) => set('qrImageUrl', e.target.value)}
              required
              className="rounded-none"
            />
          </Field>
        )}

        <Field label="Expires at" hint="YYYY-MM-DD, leave blank for no expiry">
          <Input
            type="date"
            value={form.expiresAt}
            onChange={(e) => set('expiresAt', e.target.value)}
            className="rounded-none"
          />
        </Field>

        <Field label="Display order" hint="Lower numbers appear first">
          <Input
            type="number"
            value={form.displayOrder}
            onChange={(e) => set('displayOrder', e.target.value)}
            className="rounded-none"
          />
        </Field>

        <Field
          label="Locations"
          hint="Comma-separated, e.g. Kollwitzstraße, Schwedter Straße"
        >
          <Input
            value={form.locations}
            onChange={(e) => set('locations', e.target.value)}
            className="rounded-none"
          />
        </Field>

        <div className="flex items-end">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => set('isPublished', e.target.checked)}
              className="h-4 w-4"
            />
            <span>Published (visible to members)</span>
          </label>
        </div>
      </div>

      <Field label="Description" hint="One short sentence">
        <Textarea
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          rows={2}
          maxLength={2000}
          className="rounded-none"
        />
      </Field>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="rounded-none"
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" className="rounded-none" disabled={submitting}>
          {submitting ? 'Saving…' : mode === 'create' ? 'Create benefit' : 'Save changes'}
        </Button>
      </div>
    </form>
  )
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-foreground">
        {label}
        {required && <span className="text-destructive" aria-hidden> *</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
