import Image from 'next/image'
import type { Activity } from '@/lib/data'
import {
  ACTIVITY_GRID,
  ACTIVITY_SECTION_PADDING,
  activityDescriptionColSpan,
} from '@/components/activities/activity-layout'
import { ActivityMeta } from '@/components/activities/activity-meta'
import { ActivityJoinLink } from '@/components/activities/activity-join-link'

export function ActivityDetail({ activity }: { activity: Activity }) {
  const hasImage = Boolean(activity.imageUrl)

  return (
    <div className={`${ACTIVITY_GRID} ${ACTIVITY_SECTION_PADDING} py-12 md:py-16`}>
      <ActivityMeta activity={activity} />

      {hasImage && (
        <div className="lg:col-span-4">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={activity.imageUrl!}
              alt={activity.title}
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      <div className={`flex flex-col justify-center ${activityDescriptionColSpan(hasImage)}`}>
        <p className="type-body text-foreground">{activity.description}</p>
        <p className="mt-4 type-caption italic text-muted-foreground">{activity.details}</p>
        <ActivityJoinLink />
      </div>
    </div>
  )
}
