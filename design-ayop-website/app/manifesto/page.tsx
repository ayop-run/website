'use client'

import { motion } from 'framer-motion'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { socialLinks } from '@/lib/data'

const manifestoLines = [
  { text: 'A crew, a community, a movement.', highlight: true },
  { text: 'At your own pace, we find our improvement.', highlight: false },
  { text: 'Not a race, not a chase — this is our space.', highlight: false },
  { text: 'No chasing. No changing.', highlight: false },
  { text: 'We rise while remaining.', highlight: false },
  { text: 'The rat race dangles,', highlight: false },
  { text: "but it won't shape our angles.", highlight: false },
]

const manifestoLines2 = [
  'We run the streets — city beats beneath our feet.',
  'We run the track — rhythm over records, never looking back.',
  'We run the trails — where the air grows thin and the spirit prevails.',
]

const manifestoLines3 = [
  'Some days fast, some days slow,',
  'still we move, still we grow.',
]

const manifestoLines4 = [
  'Step by step, stride by stride,',
  'freedom and joy are what we ride.',
]

const manifestoLines5 = [
  'Together we run. Together we rise.',
  'No one alone. No one denied.',
]

export default function ManifestoPage() {
  return (
    <>
      <Navigation />
      <main>
        {/* Opening Section */}
        <section className="min-h-[70vh] flex items-center justify-center px-6 md:px-12 pt-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="headline-xl"
            >
              AYOP
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-4 text-lg text-muted-foreground"
            >
              At Your Own Pace. Always.
            </motion.p>
          </motion.div>
        </section>

        {/* Section 1 */}
        <section className="py-24 md:py-32 px-6 md:px-12 border-t border-border">
          <div className="max-w-4xl mx-auto">
            {manifestoLines.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-[1.3] mb-2 ${
                  line.highlight ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {line.text}
              </motion.p>
            ))}
          </div>
        </section>

        {/* Section 2 */}
        <section className="py-24 md:py-32 px-6 md:px-12 bg-card">
          <div className="max-w-4xl mx-auto">
            {manifestoLines2.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-xl md:text-2xl lg:text-3xl font-medium tracking-tight leading-[1.4] text-foreground mb-4 last:mb-0"
              >
                {line}
              </motion.p>
            ))}
          </div>
        </section>

        {/* Section 3 */}
        <section className="py-24 md:py-32 px-6 md:px-12 border-t border-border">
          <div className="max-w-3xl mx-auto text-center">
            {manifestoLines3.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-[1.3] text-muted-foreground"
              >
                {line}
              </motion.p>
            ))}
          </div>
        </section>

        {/* Section 4 */}
        <section className="py-24 md:py-32 px-6 md:px-12 bg-secondary/30">
          <div className="max-w-3xl mx-auto text-center">
            {manifestoLines4.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-[1.3] text-foreground"
              >
                {line}
              </motion.p>
            ))}
          </div>
        </section>

        {/* Section 5 - Final */}
        <section className="py-32 md:py-48 px-6 md:px-12 border-t border-border">
          <div className="max-w-4xl mx-auto text-center">
            {manifestoLines5.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.2]"
              >
                {line}
              </motion.p>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-12"
            >
              <p className="text-xl md:text-2xl font-bold">
                AYOP.
              </p>
              <p className="mt-1 text-muted-foreground">
                At Your Own Pace. Always.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Social Links */}
        <section className="py-16 md:py-24 border-t border-border bg-card">
          <div className="px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-xl mx-auto text-center"
            >
              <h2 className="text-xl font-bold">Join the movement</h2>
              <div className="mt-6 flex flex-wrap justify-center gap-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.id}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-muted-foreground transition-colors link-underline"
                  >
                    {social.title}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
