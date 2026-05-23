'use client'

import { motion } from 'framer-motion'
import { ActivityBrands } from '@/components/activities/activity-brands'
import { ActivityDetail } from '@/components/activities/activity-detail'
import { ActivityFaqs } from '@/components/activities/activity-faqs'
import type { ActivityBlockProps } from '@/components/activities/activity-layout'

export function ActivitySection({
  activity,
  imagePriority = false,
}: ActivityBlockProps & { imagePriority?: boolean }) {
  return (
    <motion.article
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="border-b border-border"
    >
      <ActivityDetail activity={activity} imagePriority={imagePriority} />
      <ActivityBrands activity={activity} />
      <ActivityFaqs activity={activity} />
    </motion.article>
  )
}
