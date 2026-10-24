"use client";

import { motion } from "framer-motion";
import { experience } from "@/data/portfolio";
import { BrandLogo, LineReveal, Rise, SectionLabel, ease } from "@/components/ui/Editorial";

export default function Career() {
  return (
    <section id="career" className="relative z-10 px-5 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-[1400px] lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionLabel n="03">Experience</SectionLabel>
          <h2 className="mt-6 font-display text-[clamp(2.8rem,6vw,5.6rem)] leading-[0.95] tracking-[-0.02em] text-ink">
            <LineReveal lines={["Where I’ve", <em key="s" className="text-accent">shipped.</em>]} />
          </h2>
          <Rise delay={0.3}>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-muted">
              Production backends, multi-tenant platforms and real-time systems, owned end to end: design, build, deploy and support.
            </p>
          </Rise>
        </div>

        <div className="mt-14 lg:mt-0">
          {experience.map((job, i) => (
            <motion.article
              key={job.company}
              className="group relative py-9 transition-colors duration-500 hover:bg-white/[0.05] md:grid md:grid-cols-[150px_minmax(0,1fr)] md:gap-8 md:px-4"
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease, delay: 0.05 }}
            >
              {/* top rule draws in; accent rule grows on hover */}
              <motion.span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px origin-left bg-ink/80"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease }}
              />
              <span aria-hidden className="absolute left-0 top-0 h-px w-0 bg-accent transition-all duration-700 group-hover:w-full" />

              <div className="mb-4 md:mb-0">
                <p className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-muted">{job.period}</p>
                {job.current && (
                  <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white/[0.08] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink">
                    <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-green-600" />
                    Current
                  </span>
                )}
                <p className="mt-5 hidden font-display text-6xl leading-none text-ink/[0.12] md:block">0{i + 1}</p>
              </div>

              <div>
                <h3 className="font-display text-[clamp(1.8rem,3vw,2.5rem)] leading-tight text-ink">{job.role}</h3>
                <p className="mt-1 font-display text-xl italic text-accent">{job.company}</p>

                <motion.ul
                  className="mt-6 space-y-3"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-80px" }}
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } } }}
                >
                  {job.points.map((p) => (
                    <motion.li
                      key={p}
                      variants={{ hidden: { opacity: 0, x: 18 }, show: { opacity: 1, x: 0 } }}
                      transition={{ duration: 0.7, ease }}
                      className="flex gap-3 text-[14.5px] leading-relaxed text-ink/80"
                    >
                      <span className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" />
                      {p}
                    </motion.li>
                  ))}
                </motion.ul>

                <div className="mt-6 flex flex-wrap gap-2">
                  {job.tags.map((t) => (
                    <span key={t} className="group/logo flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1 font-mono text-[11px] text-ink/80">
                      <BrandLogo name={t} className="h-3 w-3" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
          <div className="h-px bg-ink/80" />
        </div>
      </div>
    </section>
  );
}
