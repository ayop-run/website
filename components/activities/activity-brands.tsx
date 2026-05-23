import { ActivitySubsection } from '@/components/activities/activity-subsection'
import type { ActivityBlockProps } from '@/components/activities/activity-layout'
import { activitiesPageContent } from '@/lib/data'

export function ActivityBrands({ activity }: ActivityBlockProps) {
  if (!activity.brands) return null

  const { groups } = activity.brands

  return (
    <ActivitySubsection
      activity={activity}
      title={activitiesPageContent.subsectionTitles.brands}
    >
      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group.category}>
            <p className="text-sm font-medium text-foreground">{group.category}</p>
            <p className="mt-1 text-sm text-muted-foreground">{group.brands.join(', ')}</p>
          </div>
        ))}
      </div>
    </ActivitySubsection>
  )
}
