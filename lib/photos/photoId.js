const SUFFIX_LEN = 8;
const SUFFIX_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";

export function randomSuffix(length = SUFFIX_LEN) {
  let s = "";
  for (let i = 0; i < length; i += 1) {
    s += SUFFIX_CHARS[Math.floor(Math.random() * SUFFIX_CHARS.length)];
  }
  return s;
}

/**
 * @param {string} input ISO date YYYY-MM-DD or parseable date string
 * @returns {string} YYYY-MM-DD
 */
export function normalizeShotOn(input) {
  if (typeof input !== "string" || !input.trim()) {
    throw new Error("Invalid shot date");
  }
  const trimmed = input.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [y, m, d] = trimmed.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    if (
      dt.getUTCFullYear() !== y ||
      dt.getUTCMonth() !== m - 1 ||
      dt.getUTCDate() !== d
    ) {
      throw new Error("Invalid shot date");
    }
    return trimmed;
  }
  const dt = new Date(trimmed);
  if (Number.isNaN(dt.getTime())) {
    throw new Error("Invalid shot date");
  }
  return dt.toISOString().slice(0, 10);
}

/**
 * @param {string} id
 * @param {string} shotOn YYYY-MM-DD
 */
export function idDatePrefixMatchesShotOn(id, shotOn) {
  if (!id || !shotOn) return false;
  return id.slice(0, 10) === shotOn;
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} shotOnPrefix YYYY-MM-DD
 */
export async function generateUniquePhotoId(supabase, shotOnPrefix) {
  for (let attempt = 0; attempt < 24; attempt += 1) {
    const id = `${shotOnPrefix}-${randomSuffix()}`;
    const { data, error } = await supabase
      .from("photos")
      .select("id")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    if (!data) return id;
  }
  throw new Error("Could not allocate a unique photo id");
}
