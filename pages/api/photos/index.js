import { getSupabaseAdmin } from "../../../lib/supabaseServer";
import { mapPhotoRowToDto } from "../../../lib/photos/mapRow";
import { verifyAdminPassword } from "../../../lib/photos/adminAuth";
import { normalizeShotOn, generateUniquePhotoId } from "../../../lib/photos/photoId";
import {
  assertHttpUrl,
  assertCategory,
  assertTitle,
  normalizeDescription,
  normalizePhotographerDisplayName,
  normalizeInstagramUsername,
  normalizeCoverImageUrl,
} from "../../../lib/photos/validation";
import { FILTER_YEARS, PHOTO_CATEGORIES } from "../../../lib/photos/constants";
import { verifyNewUnlockCookie } from "../../../lib/photos/newUnlockCookie";

function misconfigured(res) {
  return res.status(503).json({ error: "Photo service is not configured." });
}

export default async function handler(req, res) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return misconfigured(res);

  if (req.method === "GET") {
    try {
      const { year, month, category, q } = req.query;
      let query = supabase
        .from("photos")
        .select("*")
        .order("shot_on", { ascending: false })
        .limit(100);

      if (year && String(year).trim() !== "") {
        const y = String(year);
        if (!FILTER_YEARS.includes(y)) {
          return res.status(400).json({
            error: `Year must be one of: ${FILTER_YEARS.join(", ")}.`,
          });
        }
        query = query.gte("shot_on", `${y}-01-01`).lte("shot_on", `${y}-12-31`);
      }
      if (month) {
        const m = String(month).padStart(2, "0");
        if (!year || String(year).trim() === "") {
          return res.status(400).json({
            error: "Month filter requires a year query parameter.",
          });
        }
        const y = String(year);
        if (!FILTER_YEARS.includes(y)) {
          return res.status(400).json({
            error: `Year must be one of: ${FILTER_YEARS.join(", ")}.`,
          });
        }
        const last = new Date(Number(y), Number(m), 0).getDate();
        const lastPadded = String(last).padStart(2, "0");
        query = query
          .gte("shot_on", `${y}-${m}-01`)
          .lte("shot_on", `${y}-${m}-${lastPadded}`);
      }
      if (category && String(category).trim() !== "") {
        const c = String(category);
        if (!PHOTO_CATEGORIES.includes(c)) {
          return res.status(400).json({
            error: `Category must be one of: ${PHOTO_CATEGORIES.join(", ")}.`,
          });
        }
        query = query.eq("category", c);
      }
      if (q && String(q).trim()) {
        const raw = String(q)
          .trim()
          .replace(/%/g, "")
          .replace(/_/g, "")
          .replace(/[^\w\s\-]/gi, "")
          .slice(0, 80);
        if (raw) {
          const pattern = `%${raw}%`;
          query = query.or(
            `title.ilike.${pattern},description.ilike.${pattern},photographer_display_name.ilike.${pattern}`
          );
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      const photos = (data || []).map(mapPhotoRowToDto);
      return res.status(200).json({ photos });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Failed to list photos." });
    }
  }

  if (req.method === "POST") {
    try {
      const unlocked = verifyNewUnlockCookie(req.headers.cookie);
      const pwdOk = await verifyAdminPassword(req.body?.password);
      if (!unlocked && !pwdOk) {
        return res.status(403).json({
          error:
            "Unlock the add form with the admin password first, or send the password with this request.",
        });
      }

      const shotOn = normalizeShotOn(req.body?.shotOn);
      const title = assertTitle(req.body?.title);
      const externalAlbumUrl = assertHttpUrl(req.body?.externalAlbumUrl);
      const category = assertCategory(req.body?.category);
      const description = normalizeDescription(req.body?.description);
      const photographerDisplayName = normalizePhotographerDisplayName(
        req.body?.photographerDisplayName
      );
      let photographerInstagramUsername = null;
      if (
        req.body?.photographerInstagramUsername != null &&
        req.body?.photographerInstagramUsername !== ""
      ) {
        photographerInstagramUsername = normalizeInstagramUsername(
          req.body.photographerInstagramUsername
        );
      }

      let coverImageUrl = null;
      if (req.body?.coverImageUrl != null && req.body.coverImageUrl !== "") {
        coverImageUrl = normalizeCoverImageUrl(req.body.coverImageUrl);
      }

      const id = await generateUniquePhotoId(supabase, shotOn);
      const row = {
        id,
        title,
        description,
        external_album_url: externalAlbumUrl,
        cover_image_url: coverImageUrl,
        shot_on: shotOn,
        category,
        photographer_display_name: photographerDisplayName,
        photographer_instagram_username: photographerInstagramUsername,
      };

      const { data, error } = await supabase.from("photos").insert(row).select().single();
      if (error) throw error;
      return res.status(201).json({ photo: mapPhotoRowToDto(data) });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to create photo.";
      if (
        msg.includes("Invalid") ||
        msg.includes("required") ||
        msg.includes("too long") ||
        msg.includes("Album") ||
        msg.includes("cover")
      ) {
        return res.status(400).json({ error: msg });
      }
      console.error(e);
      return res.status(500).json({ error: "Failed to create photo." });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: "Method not allowed." });
}
