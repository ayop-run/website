import { getSupabaseAdmin } from "../../../lib/supabaseServer";
import { verifyAdminPassword } from "../../../lib/photos/adminAuth";
import { verifyNewUnlockCookie } from "../../../lib/photos/newUnlockCookie";
import {
  assertMemberPassword,
  getMemberPassword,
  setMemberPassword,
} from "../../../lib/benefits/settings";

export const config = {
  api: { bodyParser: true },
};

async function assertAdmin(req) {
  const sessionOk = verifyNewUnlockCookie(req.headers.cookie);
  if (sessionOk) return true;
  const passwordOk = await verifyAdminPassword(req.body?.password);
  return passwordOk;
}

export default async function handler(req, res) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return res
      .status(503)
      .json({ error: "Benefits service is not configured." });
  }

  if (!(await assertAdmin(req))) {
    return res.status(403).json({
      error:
        "Sign in on the Admin page with your admin password to view or change member settings.",
    });
  }

  if (req.method === "GET") {
    try {
      const memberPassword = await getMemberPassword(supabase);
      return res.status(200).json({ memberPassword });
    } catch (e) {
      console.error(e);
      return res
        .status(500)
        .json({ error: "Failed to load benefits settings." });
    }
  }

  if (req.method === "PUT") {
    try {
      const value = assertMemberPassword(req.body?.memberPassword);
      await setMemberPassword(supabase, value);
      return res.status(200).json({ memberPassword: value });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to save settings.";
      if (
        msg.includes("required") ||
        msg.includes("must be") ||
        msg.includes("Invalid")
      ) {
        return res.status(400).json({ error: msg });
      }
      console.error(e);
      return res.status(500).json({ error: "Failed to save settings." });
    }
  }

  res.setHeader("Allow", ["GET", "PUT"]);
  return res.status(405).json({ error: "Method not allowed." });
}
