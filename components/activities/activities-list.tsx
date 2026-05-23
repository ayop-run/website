'use client'

import type { Activity } from '@/lib/data'
import { ActivitySection } from '@/components/activities/activity-section'

export function ActivitiesList({ activities }: { activities: Activity[] }) {
  return (
    <section className="border-t border-border">
      {activities.map((activity) => (
        <ActivitySection key={activity.id} activity={activity} />
      ))}
    </section>
  )
}
