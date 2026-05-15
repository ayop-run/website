import { verifyAdminPassword, isAdminPasswordConfigured } from "../../../lib/photos/adminAuth";
import {
  createNewUnlockToken,
  verifyNewUnlockCookie,
  setNewUnlockCookie,
  clearNewUnlockCookie,
} from "../../../lib/photos/newUnlockCookie";

/** Ensure JSON body is parsed (Pages API default; explicit for clarity). */
export const config = {
  api: {
    bodyParser: true,
  },
};

function readPasswordFromBody(req) {
  const b = req.body;
  if (b && typeof b === "object" && typeof b.password === "string") {
    return b.password;
  }
  return undefined;
}

function readRememberFromBody(req) {
  const b = req.body;
  return Boolean(b && typeof b === "object" && b.remember === true);
}

const SESSION_MAX_AGE_DEFAULT_SEC = 60 * 60;
const SESSION_MAX_AGE_REMEMBER_SEC = 60 * 60 * 24 * 30;

export default async function handler(req, res) {
  if (req.method === "GET") {
    const unlocked = verifyNewUnlockCookie(req.headers.cookie);
    return res.status(200).json({ unlocked });
  }

  if (req.method === "POST") {
    if (!isAdminPasswordConfigured()) {
      return res.status(503).json({
        error:
          "Admin password is not configured. Set ADMIN_PASSWORD (or ADMIN_PASSWORD_BCRYPT) in .env.local and restart `yarn dev`.",
      });
    }

    const password = readPasswordFromBody(req);
    const ok = await verifyAdminPassword(password);
    if (!ok) {
      return res.status(403).json({
        error:
          "Invalid password. If you use ADMIN_PASSWORD_BCRYPT, that value takes precedence over ADMIN_PASSWORD. Restart the dev server after changing .env.local.",
      });
    }
    const remember = readRememberFromBody(req);
    const maxAgeSec = remember ? SESSION_MAX_AGE_REMEMBER_SEC : SESSION_MAX_AGE_DEFAULT_SEC;
    const token = createNewUnlockToken(maxAgeSec);
    setNewUnlockCookie(res, token, maxAgeSec);
    return res.status(200).json({ ok: true });
  }

  if (req.method === "DELETE") {
    clearNewUnlockCookie(res);
    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  return res.status(405).json({ error: "Method not allowed." });
}
