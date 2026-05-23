import { activitiesPageContent, socialLinks } from '@/lib/data'

export function ActivityJoinLink() {
  const { label, socialId } = activitiesPageContent.joinLink
  const href = socialLinks.find((link) => link.id === socialId)?.link

  if (!href) return null

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-6 inline-flex w-fit items-center gap-2 text-sm text-foreground link-underline"
    >
      {label}
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 8l4 4m0 0l-4 4m4-4H3"
        />
      </svg>
    </a>
  )
}
