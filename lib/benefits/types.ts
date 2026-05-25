export type BenefitKind = 'code' | 'qr'

/** Where the offer can be redeemed. */
export type BenefitRedemption = 'online' | 'in_store' | 'both'

export interface BenefitDto {
  id: string
  brand: string
  description: string | null
  kind: BenefitKind
  /** Set when kind === 'code'. */
  discountCode: string | null
  /** Set when kind === 'qr'. Public URL (e.g. /images/...). */
  qrImageUrl: string | null
  /** Free-text locations, e.g. ["Kollwitzstraße", "Schwedter Straße"]. */
  locations: string[]
  redemption: BenefitRedemption
  discountValue: string
  category: string
  storeUrl: string
  /** ISO yyyy-mm-dd or null. */
  expiresAt: string | null
  displayOrder: number
  isPublished: boolean
  createdAt?: string
  updatedAt?: string
}

export interface BenefitInput {
  brand: string
  description?: string | null
  kind: BenefitKind
  discountCode?: string | null
  qrImageUrl?: string | null
  locations?: string[]
  redemption?: BenefitRedemption
  discountValue: string
  category: string
  storeUrl: string
  expiresAt?: string | null
  displayOrder?: number
  isPublished?: boolean
}
