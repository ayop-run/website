import { getSupabaseAdmin } from "../../../lib/supabaseServer";
import {
  getMemberPassword,
  passwordsMatch,
} from "../../../lib/benefits/settings";
import {
  createBenefitsUnlockToken,
  setBenefitsUnlockCookie,
  clearBenefitsUnlockCookie,
  verifyBenefitsUnlockCookie,
  BENEFITS_UNLOCK_MAX_AGE_DEFAULT_SEC,
  BENEFITS_UNLOCK_MAX_AGE_REMEMBER_SEC,
} from "../../../lib/benefits/memberUnlockCookie";

export const config = {
  api: { bodyParser: true },
};

function readPassword(req) {
  const b = req.body;
  if (b && typeof b === "object" && typeof b.password === "string") {
    return b.password;
  }
  return undefined;
}

function readRemember(req) {
  const b = req.body;
  return Boolean(b && typeof b === "object" && b.remember === true);
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const unlocked = verifyBenefitsUnlockCookie(req.headers.cookie);
    return res.status(200).json({ unlocked });
  }

  if (req.method === "POST") {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return res
        .status(503)
        .json({ error: "Benefits service is not configured." });
    }

    const candidate = readPassword(req);
    if (typeof candidate !== "string" || !candidate.trim()) {
      return res.status(400).json({ error: "Password is required." });
    }

    const expected = await getMemberPassword(supabase);
    if (!passwordsMatch(candidate.trim(), expected)) {
      return res
        .status(403)
        .json({ error: "Incorrect password. Please try again." });
    }

    const remember = readRemember(req);
    const maxAgeSec = remember
      ? BENEFITS_UNLOCK_MAX_AGE_REMEMBER_SEC
      : BENEFITS_UNLOCK_MAX_AGE_DEFAULT_SEC;
    const token = createBenefitsUnlockToken(maxAgeSec);
    setBenefitsUnlockCookie(res, token, maxAgeSec);
    return res.status(200).json({ unlocked: true });
  }

  if (req.method === "DELETE") {
    clearBenefitsUnlockCookie(res);
    return res.status(200).json({ unlocked: false });
  }

  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  return res.status(405).json({ error: "Method not allowed." });
}
