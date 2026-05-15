import { PHOTO_CATEGORIES } from "./constants";

const INSTAGRAM_USERNAME = /^[a-zA-Z0-9._]{1,30}$/;
const TITLE_MAX = 500;

/**
 * @param {unknown} v
 * @returns {string | null}
 */
export function normalizeInstagramUsername(v) {
  if (v == null || v === "") return null;
  const s = String(v).trim().replace(/^@+/, "");
  if (s === "") return null;
  if (!INSTAGRAM_USERNAME.test(s)) {
    throw new Error("Invalid Instagram username");
  }
  return s;
}

/**
 * @param {unknown} v
 */
export function assertHttpUrl(v) {
  if (typeof v !== "string" || !v.trim()) {
    throw new Error("Album URL is required");
  }
  let u;
  try {
    u = new URL(v.trim());
  } catch {
    throw new Error("Invalid album URL");
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    throw new Error("Album URL must use http or https");
  }
  return u.toString();
}

/**
 * Optional image URL for list/hero covers. Empty → null.
 * @param {unknown} v
 * @returns {string | null}
 */
export function normalizeCoverImageUrl(v) {
  if (v == null || v === "") return null;
  const s = String(v).trim();
  if (s === "") return null;
  let u;
  try {
    u = new URL(s);
  } catch {
    throw new Error("Invalid cover image URL");
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    throw new Error("Cover image URL must use http or https");
  }
  return u.toString();
}

/**
 * @param {unknown} v
 */
export function assertCategory(v) {
  if (typeof v !== "string" || !PHOTO_CATEGORIES.includes(v)) {
    throw new Error("Invalid category");
  }
  return v;
}

/**
 * @param {unknown} v
 */
export function assertTitle(v) {
  if (typeof v !== "string" || !v.trim()) {
    throw new Error("Title is required");
  }
  const t = v.trim();
  if (t.length > TITLE_MAX) {
    throw new Error(`Title must be at most ${TITLE_MAX} characters`);
  }
  return t;
}

/**
 * Drops legacy placeholder copy that was appended to descriptions in older builds.
 * @param {string} s
 */
function stripLegacyDescriptionSuffix(s) {
  let t = s.trim();
  t = t.replace(/\s*[—–-]\s*View the full albumn?\.?/gi, "");
  t = t.replace(/\s+View the full albumn?\.?$/i, "");
  t = t.replace(/^View the full albumn?\.?$/i, "");
  return t.trim();
}

/**
 * @param {unknown} v
 * @returns {string | null}
 */
export function normalizeDescription(v) {
  if (v == null || v === "") return null;
  const s = stripLegacyDescriptionSuffix(String(v));
  return s === "" ? null : s;
}

/**
 * @param {unknown} v
 * @returns {string | null}
 */
export function normalizePhotographerDisplayName(v) {
  if (v == null || v === "") return null;
  const s = String(v).trim();
  if (s.length > 200) throw new Error("Photographer name is too long");
  return s === "" ? null : s;
}
