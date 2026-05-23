import type { ReactNode } from 'react'
import type { Activity } from '@/lib/data'
import { activitiesPageContent } from '@/lib/data'

function MetaRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <p className="type-caption text-muted-foreground">
      <span className="text-foreground">{label}:</span> {children}
    </p>
  )
}

export function ActivityMeta({ activity }: { activity: Activity }) {
  const { when, where } = activitiesPageContent.metaLabels

  return (
    <header className="lg:col-span-4">
      <span className="type-eyebrow text-muted-foreground">{activity.shortTitle}</span>
      <h2 className="mt-2 type-h3 font-bold">{activity.title}</h2>
      <div className="mt-6 space-y-1">
        <MetaRow label={when}>{activity.schedule}</MetaRow>
        <MetaRow label={where}>{activity.location}</MetaRow>
        {activity.staffs?.map((staff) => (
          <MetaRow key={staff.name} label={staff.title}>
            <a
              href={staff.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline hover:text-primary"
            >
              {staff.name}
            </a>
          </MetaRow>
        ))}
      </div>
    </header>
  )
}
