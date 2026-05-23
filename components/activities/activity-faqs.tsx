import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ActivitySubsection } from '@/components/activities/activity-subsection'
import type { ActivityBlockProps } from '@/components/activities/activity-layout'
import { activitiesPageContent } from '@/lib/data'

export function ActivityFaqs({ activity }: ActivityBlockProps) {
  if (!activity.faqs?.length) return null

  return (
    <ActivitySubsection activity={activity} title={activitiesPageContent.subsectionTitles.faq}>
      <Accordion type="single" collapsible className="w-full">
        {activity.faqs.map((faq, faqIndex) => (
          <AccordionItem
            key={faq.question}
            value={`${activity.id}-faq-${faqIndex}`}
            className="border-border"
          >
            <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground whitespace-pre-line">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </ActivitySubsection>
  )
}
