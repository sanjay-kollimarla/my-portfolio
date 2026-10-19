"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { experience } from "@/data/portfolio";
import BorderBeam from "@/components/magic/BorderBeam";
import ScrambleText from "@/components/magic/ScrambleText";
import TechLogo from "@/components/magic/TechLogo";

const ease = [0.22, 1, 0.36, 1] as const;
const accents = [
  { a: "#a855f7", b: "#22d3ee", year: "aurora-text" },
  { a: "#f472b6", b: "#facc15", year: "bg-gradient-to-r from-pink-300 to-amber-200 bg-clip-text text-transparent" },
  { a: "#22d3ee", b: "#34d399", year: "bg-gradient-to-r from-cyan-300 to-emerald-300 bg-clip-text text-transparent" },
  { a: "#fb923c", b: "#f472b6", year: "bg-gradient-to-r from-orange-300 to-pink-300 bg-clip-text text-transparent" },
];

export default function Career() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 65%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const dotTop = useTransform(fill, (v) => `${v * 100}%`);
  const dotHue = useTransform(fill, [0, 1], [0, 200]);
  const dotFilter = useTransform(dotHue, (h) => `hue-rotate(${h}deg)`);

  return (
    <section id="career" className="relative z-10 mx-auto max-w-6xl px-6 py-32 md:px-10">
      <div className="text-center">
        <ScrambleText text="03 // JOURNEY" className="font-mono text-xs tracking-[0.3em] text-cyan-300/80" />
      </div>
      <motion.h2
        className="mt-3 text-center font-display text-5xl font-bold leading-[1.05] md:text-7xl"
        initial={{ opacity: 0, y: 50, scale: 0.92 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease }}
      >
        My career <span className="text-white/50">&</span>
        <br />
        <span className="aurora-text">experience</span>
      </motion.h2>

      <div ref={ref} className="relative mt-24">
        <div className="absolute bottom-0 left-3 top-0 w-px bg-white/10 md:left-[44%]" />
        <motion.div
          className="absolute left-3 top-0 w-[2px] origin-top -translate-x-[0.5px] bg-gradient-to-b from-violet-500 via-cyan-400 via-60% to-pink-400 shadow-[0_0_14px_rgba(34,211,238,0.7)] md:left-[44%]"
          style={{ scaleY: fill, height: "100%" }}
        />
        <motion.div className="absolute left-3 z-10 -translate-x-1/2 -translate-y-1/2 md:left-[44%]" style={{ top: dotTop, filter: dotFilter }}>
          <span className="block h-4 w-4 rounded-full bg-violet-300 shadow-[0_0_25px_10px_rgba(192,132,252,0.7)]" />
          <span className="absolute inset-0 animate-ping rounded-full bg-violet-300/60" />
        </motion.div>

        <div className="space-y-16 md:space-y-24">
          {experience.map((job, i) => {
            const c = accents[i % accents.length];
            return (
              <div key={job.company} className="relative grid grid-cols-1 pl-10 md:grid-cols-[44%_56%] md:pl-0">
                <motion.div
                  className="flex items-start justify-between gap-6 md:pr-12"
                  initial={{ opacity: 0, x: -60, filter: "blur(8px)" }}
                  whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-120px" }}
                  transition={{ duration: 1, ease }}
                >
                  <div>
                    <h3 className="font-display text-2xl font-semibold leading-tight md:text-[1.9rem]">{job.role}</h3>
                    <p className="mt-2 text-base font-semibold" style={{ color: c.a }}>
                      {job.company}
                    </p>
                    <p className="mt-1 font-mono text-xs text-white/40">{job.period}</p>
                    {job.current && (
                      <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-[11px] text-emerald-300">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Current
                      </span>
                    )}
                  </div>
                  <motion.span
                    className={`font-display text-4xl font-bold md:text-6xl ${c.year}`}
                    initial={{ scale: 0.4, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 140, damping: 12, delay: 0.2 }}
                  >
                    {job.year}
                  </motion.span>
                </motion.div>

                <motion.div
                  className="relative mt-6 md:ml-10 md:mt-0"
                  initial={{ opacity: 0, x: 60, rotateY: -12 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                  viewport={{ once: true, margin: "-120px" }}
                  transition={{ duration: 1, ease }}
                >
                  <motion.div whileHover={{ y: -6 }} className="glass group relative overflow-hidden rounded-2xl p-6">
                    <BorderBeam size={160} duration={9} delay={i * 2} from={c.a} to={c.b} />
                    <div
                      className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full opacity-20 blur-3xl transition-opacity duration-700 group-hover:opacity-40"
                      style={{ background: `radial-gradient(circle, ${c.a}, ${c.b})` }}
                    />
                    <motion.ul
                      className="relative space-y-2.5"
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: "-120px" }}
                      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } } }}
                    >
                      {job.points.map((p) => (
                        <motion.li
                          key={p}
                          variants={{ hidden: { opacity: 0, x: 30, filter: "blur(6px)" }, show: { opacity: 1, x: 0, filter: "blur(0px)" } }}
                          transition={{ duration: 0.7, ease }}
                          className="flex gap-3 text-[14px] leading-relaxed text-white/70"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: c.a, boxShadow: `0 0 8px ${c.a}` }} />
                          {p}
                        </motion.li>
                      ))}
                    </motion.ul>
                    <div className="relative mt-5 flex flex-wrap gap-2">
                      {job.tags.map((t) => (
                        <span key={t} className="neo-btn flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-[11px] text-white/75">
                          <TechLogo name={t} className="h-3 w-3" />
                          {t}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
