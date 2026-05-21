'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { values, faqs } from '@/lib/data'
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
        {/* Hero Section */}
        <section className="pt-8 pb-16 md:pt-12 md:pb-24 px-6 md:px-12">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="headline-xl max-w-4xl"
          >
            WHY WE RUN
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8 max-w-xl text-muted-foreground leading-relaxed"
          >
            We run with our lives, our rhythms, and our choices — shaping a culture where every step reflects who we are.
          </motion.p>
        </section>

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
                <p className="text-lg text-foreground leading-relaxed">
                  AYOP is a Berlin-based running community built around consistency, inclusivity, and respect for individual pace.
                </p>
                <p className="mt-6 text-muted-foreground leading-relaxed">
                  We train together on the track, explore trails beyond the city, and create space where running connects people, culture, and everyday life.
                </p>
                <p className="mt-6 text-muted-foreground leading-relaxed">
                  Founded in Berlin, AYOP grew from a simple idea: that running should be accessible, sustainable, and meaningful. We believe in rhythm over speed, connection over performance, and movement as culture.
                </p>
                <p className="mt-6 text-muted-foreground leading-relaxed">
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
              <h2 className="headline-md">What we believe</h2>
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
                  <p className="mt-3 text-lg font-medium">
                    {value}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

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
                <h2 className="headline-md">Questions?</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
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
                      <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
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
