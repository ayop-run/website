import { createHmac, timingSafeEqual } from "node:crypto";

/** Member-side unlock cookie for the /benefits/perks gate.
 *  Distinct namespace from the photo admin cookie so the two are independent.
 */
export const BENEFITS_UNLOCK_COOKIE = "benefits_unlock";

const DEFAULT_MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days
const REMEMBER_MAX_AGE_SEC = 60 * 60 * 24 * 30; // 30 days
export const BENEFITS_UNLOCK_MAX_AGE_DEFAULT_SEC = DEFAULT_MAX_AGE_SEC;
export const BENEFITS_UNLOCK_MAX_AGE_REMEMBER_SEC = REMEMBER_MAX_AGE_SEC;

function signingKey() {
  const material =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.ADMIN_PASSWORD ||
    "";
  return createHmac("sha256", "benefits-member-unlock-v1")
    .update(material)
    .digest();
}

/**
 * @param {number} [maxAgeSec]
 * @returns {string}
 */
export function createBenefitsUnlockToken(maxAgeSec = DEFAULT_MAX_AGE_SEC) {
  const exp = Math.floor(Date.now() / 1000) + maxAgeSec;
  const payload = JSON.stringify({ exp });
  const sig = createHmac("sha256", signingKey()).update(payload).digest("hex");
  return Buffer.from(JSON.stringify({ exp, sig }), "utf8").toString(
    "base64url"
  );
}

/**
 * @param {string | undefined} cookieHeader
 * @returns {boolean}
 */
export function verifyBenefitsUnlockCookie(cookieHeader) {
  if (!cookieHeader || typeof cookieHeader !== "string") return false;
  const parts = cookieHeader.split(";").map((c) => c.trim());
  let raw = null;
  for (const p of parts) {
    if (p.startsWith(`${BENEFITS_UNLOCK_COOKIE}=`)) {
      raw = p.slice(BENEFITS_UNLOCK_COOKIE.length + 1);
      break;
    }
  }
  if (!raw) return false;
  let decoded;
  try {
    decoded = JSON.parse(
      Buffer.from(decodeURIComponent(raw), "base64url").toString("utf8")
    );
  } catch {
    return false;
  }
  if (
    !decoded ||
    typeof decoded.exp !== "number" ||
    typeof decoded.sig !== "string"
  ) {
    return false;
  }
  if (Math.floor(Date.now() / 1000) > decoded.exp) return false;
  const payload = JSON.stringify({ exp: decoded.exp });
  const expected = createHmac("sha256", signingKey())
    .update(payload)
    .digest("hex");
  try {
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(decoded.sig, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/** @param {import("http").ServerResponse} res */
export function clearBenefitsUnlockCookie(res) {
  res.appendHeader(
    "Set-Cookie",
    `${BENEFITS_UNLOCK_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  );
}

/**
 * @param {import("http").ServerResponse} res
 * @param {string} token
 * @param {number} [maxAgeSec]
 */
export function setBenefitsUnlockCookie(
  res,
  token,
  maxAgeSec = DEFAULT_MAX_AGE_SEC
) {
  const secure = process.env.NODE_ENV === "production";
  const parts = [
    `${BENEFITS_UNLOCK_COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSec}`,
  ];
  if (secure) parts.push("Secure");
  res.appendHeader("Set-Cookie", parts.join("; "));
}
