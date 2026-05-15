import { normalizeDescription } from "./validation";

/**
 * @param {Record<string, unknown>} row
 */
export function mapPhotoRowToDto(row) {
  return {
    id: row.id,
    title: row.title,
    description: normalizeDescription(row.description ?? ""),
    externalAlbumUrl: row.external_album_url,
    coverImageUrl: row.cover_image_url ?? null,
    shotOn: row.shot_on,
    category: row.category,
    photographerDisplayName: row.photographer_display_name ?? null,
    photographerInstagramUsername: row.photographer_instagram_username ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
