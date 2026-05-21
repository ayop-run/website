'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { PageHero } from '@/components/page-hero'
import { values, faqs } from '@/lib/data'
import { siteData } from '@/lib/site-data'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main>
        <PageHero title="WHY WE RUN" description={siteData.aboutpara} />

        {/* Main Content */}
        <section className="py-16 md:py-24 border-t border-border">
          <div className="px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
              {/* Left Column - Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <p className="type-body text-foreground whitespace-pre-line">
                  {siteData.aboutparaTwo}
                </p>
                <p className="mt-6 type-body text-muted-foreground">
                  Founded in Berlin, AYOP grew from a simple idea: that running should be accessible, sustainable, and meaningful. We believe in rhythm over speed, connection over performance, and movement as culture.
                </p>
                <p className="mt-6 type-body text-muted-foreground">
                  Every session we host is an invitation to run at your own pace while being part of something larger. Whether you&apos;re chasing a personal best or simply seeking connection, there&apos;s space for you here.
                </p>
              </motion.div>

              {/* Right Column - Image */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src="https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=800&q=80"
                    alt="AYOP Community"
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 md:py-24 border-t border-border bg-card">
          <div className="px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <h2 className="type-h2">What we believe</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {values.map((value, i) => (
                <motion.div
                  key={value}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="p-6 border border-border bg-background"
                >
                  <span className="text-xs text-muted-foreground">
                    0{i + 1}
                  </span>
                  <p className="mt-3 type-h3">
                    {value}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        {siteData.showOurTeam !== false && siteData.teams?.length > 0 && (
          <section className="py-16 md:py-24 border-t border-border">
            <div className="px-6 md:px-12">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="type-h2 mb-12"
              >
                Our team
              </motion.h2>
              {Array.from(new Set(siteData.teams.map((m) => m.tag))).map((tag) => (
                <div key={tag} className="mb-16">
                  <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                    {tag}
                  </h3>
                  {siteData.teamMissions?.[tag as keyof typeof siteData.teamMissions] && (
                    <p className="type-body text-muted-foreground max-w-2xl mb-8">
                      {siteData.teamMissions[tag as keyof typeof siteData.teamMissions]}
                    </p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {siteData.teams
                      .filter((m) => m.tag === tag)
                      .map((member, i) => (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: i * 0.05 }}
                          className="p-6 border border-border"
                        >
                          <p className="type-h3">{member.name}</p>
                          <p className="type-caption mt-1">{member.bio}</p>
                          {member.instagram && (
                            <a
                              href={member.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-3 inline-block text-sm underline underline-offset-2 hover:text-muted-foreground"
                            >
                              Instagram
                            </a>
                          )}
                        </motion.div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="py-16 md:py-24 border-t border-border">
          <div className="px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="type-h2">Questions?</h2>
                <p className="mt-4 type-body text-muted-foreground">
                  Everything you need to know before your first AYOP session.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`item-${i}`} className="border-border">
                      <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="type-body text-muted-foreground pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
