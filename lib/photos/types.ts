export type PhotoDto = {
  id: string
  title: string
  description: string
  externalAlbumUrl: string
  coverImageUrl: string | null
  shotOn: string
  category: string
  photographerDisplayName: string | null
  photographerInstagramUsername: string | null
  createdAt?: string
  updatedAt?: string
}
