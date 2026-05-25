/** Routes + page copy for the Members Benefits area.
 *
 * The password itself lives in Supabase (`site_settings`) and is verified
 * server-side via /api/benefits/unlock. Use the helpers below from clients to
 * check / clear the unlock state.
 */

export const BENEFITS_ROUTES = {
  gate: '/benefits',
  perks: '/benefits/perks',
} as const

export const BENEFITS_PAGE = {
  title: 'BENEFITS',
  description:
    'Exclusive partner discounts for AYOP members. Copy a code and head to the store to save on your next purchase.',
}

/** Ask the server whether the current visitor has a valid unlock cookie. */
export async function fetchBenefitsUnlocked(signal?: AbortSignal): Promise<boolean> {
  try {
    const res = await fetch('/api/benefits/unlock', {
      credentials: 'include',
      signal,
    })
    if (!res.ok) return false
    const body = (await res.json().catch(() => ({}))) as { unlocked?: unknown }
    return body.unlocked === true
  } catch {
    return false
  }
}

/** Verify a candidate password against the server and, on success, set the
 *  unlock cookie. Returns `{ ok: true }` on success or `{ ok: false, error }`. */
export async function submitBenefitsUnlock(
  password: string,
  remember = false,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch('/api/benefits/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ password, remember }),
    })
    const body = (await res.json().catch(() => ({}))) as {
      error?: string
      unlocked?: boolean
    }
    if (!res.ok || !body.unlocked) {
      return {
        ok: false,
        error: body.error || 'Sign-in failed. Please try again.',
      }
    }
    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Sign-in failed.',
    }
  }
}

/** Clear the unlock cookie (e.g. "sign out"). */
export async function clearBenefitsUnlock(): Promise<void> {
  try {
    await fetch('/api/benefits/unlock', {
      method: 'DELETE',
      credentials: 'include',
    })
  } catch {
    /* ignore */
  }
}
