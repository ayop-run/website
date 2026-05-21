'use client'

import { useEffect, useId, useState, type ChangeEvent } from 'react'
import type { PhotoDto } from '@/lib/photos/types'

const inputClass =
  'mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2'

const EXTRA_SELECTOR_DISPLAY_NAME = 'Sujin'
const EXTRA_SELECTOR_INSTAGRAM = 'sujinleeme'

function mergeUniqueSorted(defaults: string[], fromApi: string[]) {
  const set = new Set([...defaults, ...fromApi])
  return [...set].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
}

function extractSuggestions(photos: PhotoDto[]) {
  const names = new Set<string>()
  const usernames = new Set<string>()
  for (const p of photos || []) {
    if (p.photographerDisplayName?.trim()) names.add(p.photographerDisplayName.trim())
    if (p.photographerInstagramUsername?.trim()) {
      usernames.add(p.photographerInstagramUsername.trim())
    }
  }
  const sort = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: 'base' })
  return { names: [...names].sort(sort), usernames: [...usernames].sort(sort) }
}

type Props = {
  photographerDisplayName: string
  photographerInstagramUsername: string
  onChange: (
    field: 'photographerDisplayName' | 'photographerInstagramUsername'
  ) => (e: ChangeEvent<HTMLInputElement>) => void
  nameOptionalLabel?: boolean
}

export function PhotographerFormFields({
  photographerDisplayName,
  photographerInstagramUsername,
  onChange,
  nameOptionalLabel = true,
}: Props) {
  const nameListId = useId()
  const usernameListId = useId()
  const [nameOptions, setNameOptions] = useState<string[]>([])
  const [usernameOptions, setUsernameOptions] = useState<string[]>([])
  const [quickName, setQuickName] = useState('')
  const [quickUsername, setQuickUsername] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/photos')
        const body = await res.json().catch(() => ({}))
        if (cancelled) return
        const { names, usernames } = res.ok
          ? extractSuggestions(body.photos ?? [])
          : { names: [], usernames: [] }
        setNameOptions(
          names.length > 0 ? mergeUniqueSorted([EXTRA_SELECTOR_DISPLAY_NAME], names) : []
        )
        setUsernameOptions(
          usernames.length > 0
            ? mergeUniqueSorted([EXTRA_SELECTOR_INSTAGRAM], usernames)
            : []
        )
      } catch {
        if (!cancelled) {
          setNameOptions([])
          setUsernameOptions([])
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const hasNameSuggestions = nameOptions.length > 0
  const hasUsernameSuggestions = usernameOptions.length > 0
  const nameLabel = nameOptionalLabel ? 'Photographer name (optional)' : 'Photographer name'
  const instagramLabel = nameOptionalLabel
    ? 'Instagram username, no @ (optional)'
    : 'Instagram username, no @'

  return (
    <>
      <div className="block text-sm">
        <span className="text-muted-foreground block">{nameLabel}</span>
        {hasNameSuggestions ? (
          <div className="mt-1 space-y-1">
            <select
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              value={quickName}
              onChange={(e) => {
                const v = e.target.value
                if (v) onChange('photographerDisplayName')({ target: { value: v } } as ChangeEvent<HTMLInputElement>)
                setQuickName('')
              }}
              aria-label="Pick a saved photographer name"
            >
              <option value="">Saved names — pick or type below…</option>
              {nameOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <input
              type="text"
              list={nameListId}
              value={photographerDisplayName}
              onChange={onChange('photographerDisplayName')}
              autoComplete="off"
              className={inputClass}
            />
            <datalist id={nameListId}>
              {nameOptions.map((n) => (
                <option key={n} value={n} />
              ))}
            </datalist>
          </div>
        ) : (
          <input
            type="text"
            value={photographerDisplayName}
            onChange={onChange('photographerDisplayName')}
            className={`${inputClass} mt-1`}
          />
        )}
      </div>
      <div className="block text-sm">
        <span className="text-muted-foreground block">{instagramLabel}</span>
        {hasUsernameSuggestions ? (
          <div className="mt-1 space-y-1">
            <select
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              value={quickUsername}
              onChange={(e) => {
                const v = e.target.value
                if (v) {
                  onChange('photographerInstagramUsername')({
                    target: { value: v },
                  } as ChangeEvent<HTMLInputElement>)
                }
                setQuickUsername('')
              }}
              aria-label="Pick a saved Instagram username"
            >
              <option value="">Saved usernames — pick or type below…</option>
              {usernameOptions.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            <input
              type="text"
              list={usernameListId}
              value={photographerInstagramUsername}
              onChange={onChange('photographerInstagramUsername')}
              autoComplete="off"
              className={inputClass}
              placeholder="username"
            />
            <datalist id={usernameListId}>
              {usernameOptions.map((u) => (
                <option key={u} value={u} />
              ))}
            </datalist>
          </div>
        ) : (
          <input
            type="text"
            value={photographerInstagramUsername}
            onChange={onChange('photographerInstagramUsername')}
            className={`${inputClass} mt-1`}
            placeholder="username"
          />
        )}
      </div>
    </>
  )
}
