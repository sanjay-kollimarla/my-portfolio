"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/portfolio";
import { useLoaded } from "@/components/fx/LoadState";
import { scrollToId } from "@/components/fx/SmoothScroll";
import Magnetic from "@/components/ui/Magnetic";
import { LineReveal, ease } from "@/components/ui/Editorial";

function RoleSwapper({ enabled }: { enabled: boolean }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => setI((v) => (v + 1) % profile.roles.length), 2800);
    return () => clearInterval(id);
  }, [enabled]);
  return (
    <div className="relative h-7 overflow-hidden font-mono text-[13px] uppercase tracking-[0.2em] text-ink md:text-sm">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={profile.roles[i]}
          className="absolute left-0 top-0 whitespace-nowrap"
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-110%", opacity: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <span className="mr-2 text-accent">/</span>
          {profile.roles[i]}
        </motion.span>
      </AnimatePresence>
      <span className="invisible whitespace-nowrap">/ Full-Stack Developer</span>
    </div>
  );
}

const chips = [
  { k: "3+", v: "years in production", pos: "right-[2.5%] top-[24%]", delay: 0 },
  { k: "40+", v: "RBAC permissions designed", pos: "right-[3.5%] bottom-[20%]", delay: 1.4 },
];

export default function Hero() {
  const loaded = useLoaded();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const fade = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section id="home" ref={ref} className="relative z-10 h-[100svh] min-h-[680px] overflow-hidden">
      {/* concentric rings behind the avatar */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[70%] hidden aspect-square w-[min(120vw,520px)] -translate-x-1/2 -translate-y-1/2 sm:block lg:left-[70%] lg:top-[54%] lg:w-[min(46vw,700px)]">
        {[1, 0.78, 0.56].map((s, i) => (
          <motion.div
            key={s}
            className="absolute inset-0 rounded-full border border-ink/[0.09]"
            style={{ transform: `scale(${s})` }}
            initial={{ opacity: 0, scale: s * 0.8 }}
            animate={loaded ? { opacity: 1, scale: s } : {}}
            transition={{ duration: 1.4, delay: 0.4 + i * 0.18, ease }}
          />
        ))}
        <div className="ring-spin absolute inset-0">
          <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_14px_rgba(123,155,255,0.9)]" />
        </div>
        <div className="ring-spin-rev absolute inset-[11%]">
          <span className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-ink/70" />
        </div>
        <div className="absolute -inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(110,140,255,0.38),rgba(110,140,255,0.12)_45%,transparent_70%)]" />
      </div>

      {/* floating glass stat chips */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
        {chips.map((c) => (
          <motion.div
            key={c.k}
            className={`glass absolute ${c.pos} rounded-2xl px-5 py-4`}
            initial={{ opacity: 0, y: 24 }}
            animate={loaded ? { opacity: 1, y: [0, -10, 0] } : {}}
            transition={{ opacity: { duration: 0.8, delay: 1.5 + c.delay * 0.3 }, y: { duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: c.delay } }}
          >
            <div className="font-display text-4xl leading-none text-ink">{c.k}</div>
            <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{c.v}</div>
          </motion.div>
        ))}
      </div>

      <motion.div style={{ y, opacity: fade }} className="relative mx-auto flex h-full max-w-[1400px] flex-col justify-center px-5 pb-16 pt-24 md:px-10 lg:pb-8">
        <div className="max-w-[640px] self-start max-lg:-mt-[26svh]">
          <motion.div
            className="glass mb-7 inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-xs text-ink"
            initial={{ opacity: 0, y: 14 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.3 }}
          >
            <span className="pulse-dot h-2 w-2 rounded-full bg-green-600" />
            Available for new opportunities
            <span className="text-muted">· {profile.location}</span>
          </motion.div>

          <h1 className="font-display text-[clamp(3.4rem,9.6vw,9.4rem)] leading-[0.88] tracking-[-0.02em] text-ink">
            {loaded ? (
              <LineReveal immediate delay={0.45} lines={["Sai Sanjay", <em key="k" className="accent-grad pr-[0.06em]">Kollimarla</em>]} />
            ) : (
              <span className="invisible block">Sai Sanjay<br />Kollimarla</span>
            )}
          </h1>

          <motion.div className="mt-8" initial={{ opacity: 0 }} animate={loaded ? { opacity: 1 } : {}} transition={{ delay: 1.2, duration: 0.8 }}>
            <RoleSwapper enabled={loaded} />
          </motion.div>

          <motion.p
            className="mt-5 hidden max-w-[30rem] text-[15px] leading-relaxed text-muted sm:block md:text-base"
            initial={{ opacity: 0, y: 16 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease, delay: 1.3 }}
          >
            Software engineer building scalable backend systems, multi-tenant SaaS and real-time services, from architecture to production.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4"
            initial={{ opacity: 0, y: 16 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease, delay: 1.45 }}
          >
            <Magnetic strength={0.3}>
              <button
                onClick={() => scrollToId("work")}
                data-cursor="View"
                className="group flex items-center gap-3 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-paper transition-colors duration-300 hover:bg-accent"
              >
                Selected work
                <span className="transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
              </button>
            </Magnetic>
            <button onClick={() => scrollToId("contact")} className="link-u group flex items-center gap-2 pb-1 text-sm font-medium text-ink">
              Get in touch
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </motion.div>
        </div>

        <motion.div
          className="absolute inset-x-5 bottom-7 flex items-end justify-between md:inset-x-10"
          initial={{ opacity: 0 }}
          animate={loaded ? { opacity: 1 } : {}}
          transition={{ delay: 1.9, duration: 0.8 }}
        >
          <div className="flex gap-6 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            <a href={profile.github} target="_blank" rel="noreferrer" className="link-u hover:text-ink">GitHub</a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="link-u hover:text-ink">LinkedIn</a>
            <a href={`mailto:${profile.email}`} className="link-u hover:text-ink">Email</a>
          </div>
          <button onClick={() => scrollToId("about")} aria-label="Scroll down" className="hidden items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted md:flex">
            Scroll
            <span className="relative h-10 w-px overflow-hidden bg-ink/15">
              <motion.span className="absolute inset-x-0 top-0 h-4 bg-ink" animate={{ y: [-16, 40] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />
            </span>
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
