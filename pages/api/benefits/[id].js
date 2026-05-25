import { getSupabaseAdmin } from "../../../lib/supabaseServer";
import { mapBenefitRowToDto } from "../../../lib/benefits/mapRow";
import { verifyAdminPassword } from "../../../lib/photos/adminAuth";
import { verifyNewUnlockCookie } from "../../../lib/photos/newUnlockCookie";
import {
  assertBrand,
  assertDiscountValue,
  assertCategory,
  assertStoreUrl,
  assertKind,
  normalizeDescription,
  normalizeDiscountCode,
  normalizeImageUrl,
  normalizeLocations,
  normalizeExpiresAt,
  normalizeDisplayOrder,
  normalizeIsPublished,
  normalizeRedemption,
} from "../../../lib/benefits/validation";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function handler(req, res) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return res
      .status(503)
      .json({ error: "Benefits service is not configured." });
  }
  const { id } = req.query;
  if (!id || typeof id !== "string" || !UUID.test(id)) {
    return res.status(400).json({ error: "Invalid id." });
  }

  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("benefits")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      if (!data) return res.status(404).json({ error: "Benefit not found." });
      return res.status(200).json({ benefit: mapBenefitRowToDto(data) });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Failed to load benefit." });
    }
  }

  const sessionOk = verifyNewUnlockCookie(req.headers.cookie);
  const passwordOk = await verifyAdminPassword(req.body?.password);
  if (!sessionOk && !passwordOk) {
    return res.status(403).json({
      error:
        "Sign in on the Admin page with your admin password, or send the password with this request.",
    });
  }

  if (req.method === "PATCH") {
    try {
      const { data: existing, error: fetchErr } = await supabase
        .from("benefits")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (fetchErr) throw fetchErr;
      if (!existing) return res.status(404).json({ error: "Benefit not found." });

      const body = req.body || {};
      const kind = body.kind !== undefined ? assertKind(body.kind) : existing.kind;
      const brand =
        body.brand !== undefined ? assertBrand(body.brand) : existing.brand;
      const discountValue =
        body.discountValue !== undefined
          ? assertDiscountValue(body.discountValue)
          : existing.discount_value;
      const category =
        body.category !== undefined
          ? assertCategory(body.category)
          : existing.category;
      const storeUrl =
        body.storeUrl !== undefined
          ? assertStoreUrl(body.storeUrl)
          : existing.store_url;
      const description =
        body.description !== undefined
          ? normalizeDescription(body.description)
          : existing.description;
      const locations =
        body.locations !== undefined
          ? normalizeLocations(body.locations)
          : existing.locations || [];
      const redemption =
        body.redemption !== undefined
          ? normalizeRedemption(body.redemption)
          : existing.redemption || "online";
      const expiresAt =
        body.expiresAt !== undefined
          ? normalizeExpiresAt(body.expiresAt)
          : existing.expires_at;
      const displayOrder =
        body.displayOrder !== undefined
          ? normalizeDisplayOrder(body.displayOrder)
          : existing.display_order || 0;
      const isPublished =
        body.isPublished !== undefined
          ? normalizeIsPublished(body.isPublished)
          : existing.is_published !== false;

      let discountCode = existing.discount_code;
      let qrImageUrl = existing.qr_image_url;

      if (kind === "code") {
        const next =
          body.discountCode !== undefined
            ? normalizeDiscountCode(body.discountCode)
            : existing.discount_code;
        if (!next) {
          throw new Error("Discount code is required when kind is 'code'");
        }
        discountCode = next;
        qrImageUrl = null;
      } else {
        const next =
          body.qrImageUrl !== undefined
            ? normalizeImageUrl(body.qrImageUrl)
            : existing.qr_image_url;
        if (!next) {
          throw new Error("QR image URL is required when kind is 'qr'");
        }
        qrImageUrl = next;
        discountCode = null;
      }

      const payload = {
        brand,
        description,
        kind,
        discount_code: discountCode,
        qr_image_url: qrImageUrl,
        locations,
        redemption,
        discount_value: discountValue,
        category,
        store_url: storeUrl,
        expires_at: expiresAt,
        display_order: displayOrder,
        is_published: isPublished,
        updated_at: new Date().toISOString(),
      };

      const { data: upd, error: updErr } = await supabase
        .from("benefits")
        .update(payload)
        .eq("id", id)
        .select()
        .single();
      if (updErr) throw updErr;
      return res.status(200).json({ benefit: mapBenefitRowToDto(upd) });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to update benefit.";
      if (
        msg.includes("required") ||
        msg.includes("Invalid") ||
        msg.includes("too long") ||
        msg.includes("must use")
      ) {
        return res.status(400).json({ error: msg });
      }
      console.error(e);
      return res.status(500).json({ error: "Failed to update benefit." });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { error } = await supabase.from("benefits").delete().eq("id", id);
      if (error) throw error;
      return res.status(204).end();
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Failed to delete benefit." });
    }
  }

  res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
  return res.status(405).json({ error: "Method not allowed." });
}
