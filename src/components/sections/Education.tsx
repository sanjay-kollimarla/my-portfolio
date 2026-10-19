"use client";

import { motion } from "framer-motion";
import { certifications, education } from "@/data/portfolio";
import SectionHeading from "@/components/ui/SectionHeading";
import TiltCard from "@/components/ui/TiltCard";
import BorderBeam from "@/components/magic/BorderBeam";

const certColors = ["#a855f7", "#22d3ee", "#f472b6", "#facc15"];

export default function Education() {
  return (
    <section id="education" className="relative z-10 mx-auto max-w-7xl px-6 pb-28 pt-20 md:pb-40 md:pt-24 lg:px-10">
      <SectionHeading index="✦" eyebrow="Foundations" title="Education &" highlight="certifications." />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <TiltCard className="group glass-strong h-full rounded-[2rem] p-8 md:p-10" max={7}>
            <BorderBeam size={240} duration={8} from="#a855f7" to="#facc15" width={2} />
            <BorderBeam size={240} duration={8} delay={4} from="#22d3ee" to="#f472b6" width={2} />
            <div className="relative z-10 flex h-full flex-col">
              <div className="flex items-center gap-4">
                <motion.div
                  className="neo flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
                  animate={{ rotate: [0, -8, 8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  🎓
                </motion.div>
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-violet-300/80">{education.period}</p>
                  <p className="text-sm text-white/50">{education.location}</p>
                </div>
              </div>
              <h3 className="mt-8 font-display text-3xl font-bold leading-tight md:text-4xl">{education.school}</h3>
              <p className="mt-3 text-lg text-white/65">{education.degree}</p>

              <div className="mt-auto pt-10">
                <div className="mb-3 flex items-end justify-between">
                  <span className="text-sm text-white/50">CGPA</span>
                  <span className="aurora-text font-display text-3xl font-bold">{education.cgpa}</span>
                </div>
                <div className="neo-inset h-3 overflow-hidden rounded-full">
                  <motion.div
                    className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-violet-500 via-cyan-400 to-pink-400"
                    initial={{ width: 0 }}
                    whileInView={{ width: "78%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            </div>
          </TiltCard>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {certifications.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 50, rotate: i % 2 ? 3 : -3 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -10 }}
              className="neo group relative overflow-hidden rounded-3xl p-6"
            >
              <BorderBeam size={110} duration={7} delay={i * 1.7} from={certColors[i]} to={certColors[(i + 1) % 4]} />
              <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full opacity-25 blur-2xl transition-all duration-700 group-hover:scale-[2] group-hover:opacity-50" style={{ background: certColors[i] }} />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="glass rounded-lg px-2.5 py-1 font-mono text-[11px]" style={{ color: certColors[i] }}>{c.issuer}</span>
                  <motion.span
                    className="text-2xl"
                    animate={{ y: [0, -4, 0], rotate: [0, 8, -8, 0] }}
                    transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    🏅
                  </motion.span>
                </div>
                <h4 className="mt-6 font-display text-lg font-semibold leading-snug">{c.title}</h4>
                <p className="mt-2 text-sm text-white/50">{c.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
