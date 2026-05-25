/**
 * Map a Supabase `benefits` row → public DTO (camelCase).
 * @param {Record<string, unknown>} row
 */
export function mapBenefitRowToDto(row) {
  return {
    id: row.id,
    brand: row.brand,
    description: row.description ?? null,
    kind: row.kind,
    discountCode: row.discount_code ?? null,
    qrImageUrl: row.qr_image_url ?? null,
    locations: Array.isArray(row.locations) ? row.locations : [],
    redemption:
      row.redemption === "in_store" || row.redemption === "both"
        ? row.redemption
        : "online",
    discountValue: row.discount_value,
    category: row.category,
    storeUrl: row.store_url,
    expiresAt: row.expires_at ?? null,
    displayOrder:
      typeof row.display_order === "number" ? row.display_order : 0,
    isPublished:
      typeof row.is_published === "boolean" ? row.is_published : true,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
