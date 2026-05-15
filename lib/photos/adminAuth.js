import bcrypt from "bcryptjs";

/**
 * True if either plain or bcrypt admin password is set (non-empty after trim).
 */
export function isAdminPasswordConfigured() {
  const hash = process.env.ADMIN_PASSWORD_BCRYPT?.trim();
  const plain = process.env.ADMIN_PASSWORD?.trim();
  return Boolean(hash) || Boolean(plain);
}

/**
 * @param {string | undefined} candidate
 * @returns {Promise<boolean>}
 */
export async function verifyAdminPassword(candidate) {
  const trimmed = candidate == null ? "" : String(candidate).trim();
  if (!trimmed) return false;

  const hash = process.env.ADMIN_PASSWORD_BCRYPT?.trim();
  const plain = process.env.ADMIN_PASSWORD?.trim();

  if (hash) {
    try {
      return await bcrypt.compare(trimmed, hash);
    } catch {
      return false;
    }
  }
  if (plain) {
    return trimmed === plain;
  }
  return false;
}
