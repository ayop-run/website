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

function misconfigured(res) {
  return res.status(503).json({ error: "Benefits service is not configured." });
}

function buildInsertPayload(body) {
  const kind = assertKind(body?.kind);
  const brand = assertBrand(body?.brand);
  const discountValue = assertDiscountValue(body?.discountValue);
  const category = assertCategory(body?.category);
  const storeUrl = assertStoreUrl(body?.storeUrl);
  const description = normalizeDescription(body?.description);
  const locations = normalizeLocations(body?.locations);
  const redemption = normalizeRedemption(body?.redemption);
  const expiresAt = normalizeExpiresAt(body?.expiresAt);
  const displayOrder = normalizeDisplayOrder(body?.displayOrder);
  const isPublished = normalizeIsPublished(body?.isPublished);

  let discountCode = null;
  let qrImageUrl = null;
  if (kind === "code") {
    discountCode = normalizeDiscountCode(body?.discountCode);
    if (!discountCode) {
      throw new Error("Discount code is required when kind is 'code'");
    }
  } else {
    qrImageUrl = normalizeImageUrl(body?.qrImageUrl);
    if (!qrImageUrl) {
      throw new Error("QR image URL is required when kind is 'qr'");
    }
  }

  return {
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
  };
}

export default async function handler(req, res) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return misconfigured(res);

  if (req.method === "GET") {
    try {
      const adminSession = verifyNewUnlockCookie(req.headers.cookie);
      const includeAll =
        String(req.query?.all || "").trim() === "1" && adminSession;

      let query = supabase
        .from("benefits")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false })
        .limit(500);
      if (!includeAll) {
        query = query.eq("is_published", true);
      }
      const { data, error } = await query;
      if (error) throw error;
      const benefits = (data || []).map(mapBenefitRowToDto);
      return res.status(200).json({ benefits });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Failed to list benefits." });
    }
  }

  if (req.method === "POST") {
    try {
      const sessionOk = verifyNewUnlockCookie(req.headers.cookie);
      const passwordOk = await verifyAdminPassword(req.body?.password);
      if (!sessionOk && !passwordOk) {
        return res.status(403).json({
          error:
            "Sign in on the Admin page with your admin password, or send the password with this request.",
        });
      }

      const row = buildInsertPayload(req.body);
      const { data, error } = await supabase
        .from("benefits")
        .insert(row)
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json({ benefit: mapBenefitRowToDto(data) });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to create benefit.";
      if (
        msg.includes("required") ||
        msg.includes("Invalid") ||
        msg.includes("too long") ||
        msg.includes("must use")
      ) {
        return res.status(400).json({ error: msg });
      }
      console.error(e);
      return res.status(500).json({ error: "Failed to create benefit." });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: "Method not allowed." });
}
