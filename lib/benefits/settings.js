/** Settings keys used in the `site_settings` table. */
export const BENEFITS_PASSWORD_KEY = "benefits_member_password";

/** Fallback if the table or row doesn't exist yet (matches the seed). */
export const BENEFITS_PASSWORD_FALLBACK = "ayoprun2024";

const MIN_LEN = 4;
const MAX_LEN = 120;

/**
 * @param {unknown} v
 * @returns {string}
 */
export function assertMemberPassword(v) {
  if (typeof v !== "string" || !v.trim()) {
    throw new Error("Password is required");
  }
  const s = v.trim();
  if (s.length < MIN_LEN) {
    throw new Error(`Password must be at least ${MIN_LEN} characters`);
  }
  if (s.length > MAX_LEN) {
    throw new Error(`Password must be at most ${MAX_LEN} characters`);
  }
  return s;
}

/**
 * Read the current member password from Supabase.
 * Returns the fallback if the row is missing so legacy /benefits keeps working
 * before the migration is applied.
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @returns {Promise<string>}
 */
export async function getMemberPassword(supabase) {
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", BENEFITS_PASSWORD_KEY)
      .maybeSingle();
    if (error) {
      console.warn("[benefits/settings] read failed:", error.message);
      return BENEFITS_PASSWORD_FALLBACK;
    }
    if (!data || typeof data.value !== "string" || !data.value.trim()) {
      return BENEFITS_PASSWORD_FALLBACK;
    }
    return data.value;
  } catch (e) {
    console.warn("[benefits/settings] read threw:", e);
    return BENEFITS_PASSWORD_FALLBACK;
  }
}

/**
 * Upsert the current member password.
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} value already-validated password
 */
export async function setMemberPassword(supabase, value) {
  const { error } = await supabase
    .from("site_settings")
    .upsert(
      {
        key: BENEFITS_PASSWORD_KEY,
        value,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "key" }
    );
  if (error) throw error;
}

/**
 * Constant-time-ish string compare (best effort in JS).
 * @param {string} a
 * @param {string} b
 */
export function passwordsMatch(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
