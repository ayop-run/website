export const BENEFIT_KINDS = ['code', 'qr'] as const

export const BENEFIT_REDEMPTION_VALUES = [
  'online',
  'in_store',
  'both',
] as const

export const BENEFIT_REDEMPTION_LABEL: Record<
  (typeof BENEFIT_REDEMPTION_VALUES)[number],
  string
> = {
  online: 'Online',
  in_store: 'In-store',
  both: 'Online & in-store',
}

/** Suggested categories — admins may type others; the dashboard derives
 * the filter list from whatever values actually appear in the data. */
export const BENEFIT_CATEGORY_SUGGESTIONS = [
  'Footwear',
  'Apparel',
  'Nutrition',
  'Tech',
  'Accessories',
  'Café',
] as const
