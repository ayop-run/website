import { BENEFIT_KINDS, BENEFIT_REDEMPTION_VALUES } from "./constants";

const TEXT_MAX = 500;
const URL_MAX = 1000;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * @param {unknown} v
 * @returns {string}
 */
function assertNonEmpty(v, fieldLabel) {
  if (typeof v !== "string" || !v.trim()) {
    throw new Error(`${fieldLabel} is required`);
  }
  const s = v.trim();
  if (s.length > TEXT_MAX) {
    throw new Error(`${fieldLabel} is too long`);
  }
  return s;
}

/**
 * @param {unknown} v
 */
export function assertBrand(v) {
  return assertNonEmpty(v, "Brand");
}

/**
 * @param {unknown} v
 */
export function assertDiscountValue(v) {
  return assertNonEmpty(v, "Discount value");
}

/**
 * @param {unknown} v
 */
export function assertCategory(v) {
  return assertNonEmpty(v, "Category");
}

/**
 * @param {unknown} v
 * @returns {string | null}
 */
export function normalizeDescription(v) {
  if (v == null) return null;
  const s = String(v).trim();
  if (s === "") return null;
  if (s.length > 2000) {
    throw new Error("Description is too long");
  }
  return s;
}

/**
 * @param {unknown} v
 * @returns {'code' | 'qr'}
 */
export function assertKind(v) {
  const s = typeof v === "string" ? v.trim() : "";
  if (!BENEFIT_KINDS.includes(s)) {
    throw new Error("Invalid kind. Must be 'code' or 'qr'.");
  }
  return s;
}

/**
 * @param {unknown} v
 * @returns {'online' | 'in_store' | 'both'}
 */
export function normalizeRedemption(v) {
  if (v == null || v === "") return "online";
  const s = typeof v === "string" ? v.trim() : "";
  if (!BENEFIT_REDEMPTION_VALUES.includes(s)) {
    throw new Error(
      `Invalid redemption. Must be one of: ${BENEFIT_REDEMPTION_VALUES.join(", ")}.`
    );
  }
  return s;
}

/**
 * @param {unknown} v
 * @returns {string | null}
 */
export function normalizeDiscountCode(v) {
  if (v == null) return null;
  const s = String(v).trim();
  if (s === "") return null;
  if (s.length > 120) throw new Error("Discount code is too long");
  return s;
}

/**
 * Absolute http(s) or root-relative (/images/...) URL.
 * @param {unknown} v
 * @returns {string | null}
 */
export function normalizeImageUrl(v) {
  if (v == null) return null;
  const s = String(v).trim();
  if (s === "") return null;
  if (s.length > URL_MAX) throw new Error("Image URL is too long");
  if (s.startsWith("/")) return s;
  try {
    const u = new URL(s);
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      throw new Error("Image URL must use http or https");
    }
    return u.toString();
  } catch {
    throw new Error("Invalid image URL");
  }
}

/**
 * @param {unknown} v
 */
export function assertStoreUrl(v) {
  if (typeof v !== "string" || !v.trim()) {
    throw new Error("Store URL is required");
  }
  const s = v.trim();
  if (s.length > URL_MAX) throw new Error("Store URL is too long");
  try {
    const u = new URL(s);
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      throw new Error("Store URL must use http or https");
    }
    return u.toString();
  } catch {
    throw new Error("Invalid store URL");
  }
}

/**
 * @param {unknown} v
 * @returns {string[]}
 */
export function normalizeLocations(v) {
  if (v == null || v === "") return [];
  let list;
  if (Array.isArray(v)) {
    list = v.map((x) => String(x ?? "").trim());
  } else {
    list = String(v)
      .split(/[,\n]/)
      .map((s) => s.trim());
  }
  const cleaned = list.filter((s) => s !== "");
  if (cleaned.length > 20) throw new Error("Too many locations");
  for (const s of cleaned) {
    if (s.length > 120) throw new Error("Location entry is too long");
  }
  return cleaned;
}

/**
 * @param {unknown} v
 * @returns {string | null}
 */
export function normalizeExpiresAt(v) {
  if (v == null || v === "") return null;
  const s = String(v).trim();
  if (!ISO_DATE.test(s)) {
    throw new Error("Expires at must be YYYY-MM-DD");
  }
  return s;
}

/**
 * @param {unknown} v
 * @returns {number}
 */
export function normalizeDisplayOrder(v) {
  if (v == null || v === "") return 0;
  const n = Number(v);
  if (!Number.isFinite(n)) throw new Error("Display order must be a number");
  return Math.trunc(n);
}

/**
 * @param {unknown} v
 * @returns {boolean}
 */
export function normalizeIsPublished(v) {
  if (v == null) return true;
  if (typeof v === "boolean") return v;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (s === "true" || s === "1" || s === "on") return true;
    if (s === "false" || s === "0" || s === "off") return false;
  }
  if (typeof v === "number") return v !== 0;
  return Boolean(v);
}
