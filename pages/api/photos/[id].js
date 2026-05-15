import { getSupabaseAdmin } from "../../../lib/supabaseServer";
import { mapPhotoRowToDto } from "../../../lib/photos/mapRow";
import { verifyAdminPassword } from "../../../lib/photos/adminAuth";
import { verifyNewUnlockCookie } from "../../../lib/photos/newUnlockCookie";
import { normalizeShotOn, generateUniquePhotoId, idDatePrefixMatchesShotOn } from "../../../lib/photos/photoId";
import {
  assertHttpUrl,
  assertCategory,
  assertTitle,
  normalizeDescription,
  normalizePhotographerDisplayName,
  normalizeInstagramUsername,
  normalizeCoverImageUrl,
} from "../../../lib/photos/validation";

export default async function handler(req, res) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return res.status(503).json({ error: "Photo service is not configured." });
  }
  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid id." });
  }

  if (req.method === "GET") {
    try {
      const { data, error } = await supabase.from("photos").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      if (!data) return res.status(404).json({ error: "Photo not found." });
      if (!idDatePrefixMatchesShotOn(data.id, data.shot_on)) {
        return res.status(500).json({ error: "Photo data is inconsistent." });
      }
      return res.status(200).json({ photo: mapPhotoRowToDto(data) });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: "Failed to load photo." });
    }
  }

  if (req.method === "PATCH") {
    try {
      const sessionOk = verifyNewUnlockCookie(req.headers.cookie);
      const passwordOk = await verifyAdminPassword(req.body?.password);
      if (!sessionOk && !passwordOk) {
        return res.status(403).json({
          error:
            "Sign in on the Photos page with your admin password, or enter the admin password here to save.",
        });
      }

      const { data: existing, error: fetchErr } = await supabase
        .from("photos")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (fetchErr) throw fetchErr;
      if (!existing) return res.status(404).json({ error: "Photo not found." });

      let shotOn = existing.shot_on;
      if (req.body.shotOn !== undefined) {
        shotOn = normalizeShotOn(req.body.shotOn);
      }

      const title =
        req.body.title !== undefined ? assertTitle(req.body.title) : existing.title;
      const externalAlbumUrl =
        req.body.externalAlbumUrl !== undefined
          ? assertHttpUrl(req.body.externalAlbumUrl)
          : existing.external_album_url;
      const category =
        req.body.category !== undefined
          ? assertCategory(req.body.category)
          : existing.category;
      const description =
        req.body.description !== undefined
          ? normalizeDescription(req.body.description)
          : normalizeDescription(existing.description);
      const photographerDisplayName =
        req.body.photographerDisplayName !== undefined
          ? normalizePhotographerDisplayName(req.body.photographerDisplayName)
          : existing.photographer_display_name;
      let photographerInstagramUsername = existing.photographer_instagram_username;
      if (req.body.photographerInstagramUsername !== undefined) {
        if (
          req.body.photographerInstagramUsername === null ||
          req.body.photographerInstagramUsername === ""
        ) {
          photographerInstagramUsername = null;
        } else {
          photographerInstagramUsername = normalizeInstagramUsername(
            req.body.photographerInstagramUsername
          );
        }
      }

      let coverImageUrl = existing.cover_image_url;
      if (req.body.coverImageUrl !== undefined) {
        if (req.body.coverImageUrl === null || req.body.coverImageUrl === "") {
          coverImageUrl = null;
        } else {
          coverImageUrl = normalizeCoverImageUrl(req.body.coverImageUrl);
        }
      }

      let newId = existing.id;
      if (shotOn !== existing.shot_on) {
        newId = await generateUniquePhotoId(supabase, shotOn);
      }

      const payload = {
        title,
        description,
        external_album_url: externalAlbumUrl,
        cover_image_url: coverImageUrl,
        shot_on: shotOn,
        category,
        photographer_display_name: photographerDisplayName,
        photographer_instagram_username: photographerInstagramUsername,
        updated_at: new Date().toISOString(),
      };
      if (newId !== existing.id) {
        payload.id = newId;
      }

      const { data: upd, error: updErr } = await supabase
        .from("photos")
        .update(payload)
        .eq("id", existing.id)
        .select()
        .single();
      if (updErr) throw updErr;
      return res.status(200).json({
        photo: mapPhotoRowToDto(upd),
        idChanged: newId !== existing.id,
        newId: newId !== existing.id ? newId : undefined,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to update photo.";
      if (
        msg.includes("Invalid") ||
        msg.includes("required") ||
        msg.includes("too long") ||
        msg.includes("Album") ||
        msg.toLowerCase().includes("cover")
      ) {
        return res.status(400).json({ error: msg });
      }
      console.error(e);
      return res.status(500).json({ error: "Failed to update photo." });
    }
  }

  res.setHeader("Allow", ["GET", "PATCH"]);
  return res.status(405).json({ error: "Method not allowed." });
}
