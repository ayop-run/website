import type { ReactNode } from 'react'
import type { Activity } from '@/lib/data'
import {
  ACTIVITY_GRID,
  ACTIVITY_SECTION_PADDING,
  activityContentColSpan,
} from '@/components/activities/activity-layout'

type ActivitySubsectionProps = {
  activity: Activity
  title: string
  children: ReactNode
}

function ActivityImageSpacer({ hasImage }: { hasImage: boolean }) {
  if (!hasImage) return null
  return <div className="hidden lg:block lg:col-span-4" aria-hidden="true" />
}

export function ActivitySubsection({ activity, title, children }: ActivitySubsectionProps) {
  const hasImage = Boolean(activity.imageUrl)

  return (
    <section
      className={`${ACTIVITY_SECTION_PADDING} pb-12 pt-8 md:pb-16 md:pt-12`}
    >
      <div className={ACTIVITY_GRID}>
        <ActivityImageSpacer hasImage={hasImage} />

        <header className="lg:col-span-4">
          <h3 className="type-h4 font-bold">{title}</h3>
        </header>

        <div className={activityContentColSpan(hasImage)}>{children}</div>
      </div>
    </section>
  )
}
