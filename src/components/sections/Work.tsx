"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import { profile, projects } from "@/data/portfolio";
import { ArrowIcon, GithubIcon } from "@/components/ui/Icons";
import Magnetic from "@/components/ui/Magnetic";
import BorderBeam from "@/components/magic/BorderBeam";
import FlickeringGrid from "@/components/magic/FlickeringGrid";
import TechLogo from "@/components/magic/TechLogo";
import { RainbowLink } from "@/components/magic/Buttons";
import ScrambleText from "@/components/magic/ScrambleText";

type Project = (typeof projects)[number];
const beamTo = ["#22d3ee", "#facc15", "#a855f7"];

function FlowRow({ flow, accent }: { flow: string[]; accent: string }) {
  return (
    <div className="neo-inset relative overflow-hidden rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-white/40">
        <span>Architecture</span>
        <span className="flex items-center gap-1.5 text-emerald-300/80">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> live
        </span>
      </div>
      <div className="flex items-center">
        {flow.map((node, i) => (
          <div key={node} className="flex min-w-0 flex-1 items-center">
            <motion.div
              className="glass relative flex min-h-14 min-w-0 flex-1 items-center justify-center rounded-xl px-1.5 text-center font-mono text-[10px] leading-tight text-white/90 md:text-[10.5px]"
            >
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-xl border"
                style={{ borderColor: accent, boxShadow: `0 0 22px ${accent}cc` }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.6 }}
              />
              {node}
            </motion.div>
            {i < flow.length - 1 && (
              <div className="relative mx-1 h-px w-5 shrink-0 bg-white/15 md:w-7">
                <motion.span
                  className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full"
                  style={{ background: accent, boxShadow: `0 0 10px ${accent}` }}
                  animate={{ left: ["0%", "100%"], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.35, ease: "easeInOut" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 flex h-8 items-end gap-1">
        {Array.from({ length: 24 }, (_, i) => (
          <motion.span
            key={i}
            className="h-full flex-1 origin-bottom rounded-t-sm"
            style={{ background: `linear-gradient(to top, ${accent}22, ${accent})` }}
            animate={{ scaleY: [(20 + ((i * 37) % 60)) / 100, (40 + ((i * 53) % 60)) / 100, (15 + ((i * 29) % 50)) / 100] }}
            transition={{ duration: 1.4 + (i % 5) * 0.25, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  );
}

function Panel({ project, index }: { project: Project; index: number }) {
  return (
    <article className="group relative flex h-full w-[86vw] shrink-0 flex-col border-r border-white/10 px-6 py-8 sm:w-[60vw] md:px-10 lg:w-[38vw] xl:w-[34vw]">
      <BorderBeam size={260} duration={10} delay={index * 3} from={project.accent} to={beamTo[index % beamTo.length]} width={1} />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full opacity-20 blur-[90px] transition-opacity duration-700 group-hover:opacity-60"
        style={{ background: project.accent }}
      />
      <div className="relative flex items-start justify-between gap-4">
        <motion.span
          className="font-display text-5xl font-bold md:text-6xl"
          style={{ color: project.accent, textShadow: `0 0 30px ${project.accent}88` }}
          whileHover={{ scale: 1.15, rotate: -6 }}
        >
          0{index + 1}
        </motion.span>
        <div className="text-right">
          <h3 className="font-display text-xl font-semibold leading-tight md:text-2xl">{project.short}</h3>
          <p className="mt-1 text-xs text-white/45">System Design · Backend</p>
        </div>
      </div>

      <p className="relative mt-5 text-sm font-medium" style={{ color: project.accent }}>
        {project.tagline}
      </p>

      <div className="relative mt-5">
        <p className="font-display text-base font-semibold">Tools and features</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {project.stack.map((s, i) => (
            <motion.span
              key={s}
              className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/75"
              whileHover={{ y: -3, borderColor: project.accent }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <TechLogo name={s} className="h-3 w-3" />
              {s}
            </motion.span>
          ))}
        </div>
      </div>

      <ul className="relative mt-5 space-y-2">
        {project.points.map((p, pi) => (
          <li key={p} className={`gap-2.5 text-[13px] leading-snug text-white/65 ${pi >= 3 ? "hidden sm:flex" : "flex"}`}>
            <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rotate-45" style={{ background: project.accent }} />
            {p}
          </li>
        ))}
      </ul>

      <div className="relative mt-auto pt-6 transition-transform duration-700 group-hover:-translate-y-1">
        <FlowRow flow={project.flow} accent={project.accent} />
      </div>
    </article>
  );
}

export default function Work() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const [vh, setVh] = useState(800);

  useLayoutEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setDist(Math.max(0, track.current.scrollWidth - window.innerWidth));
      setVh(window.innerHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const smoothP = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const x = useTransform(smoothP, (v) => -v * dist);
  const bar = useTransform(smoothP, [0, 1], ["0%", "100%"]);

  return (
    <section id="work" ref={section} className="relative z-10" style={{ height: dist + vh }}>
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pt-24">
        <div className="absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_75%)]">
          <FlickeringGrid />
        </div>
        <div className="flex items-end justify-between px-6 md:px-[7vw]">
          <div>
            <ScrambleText text="04 // SELECTED WORK" className="font-mono text-xs tracking-[0.3em] text-amber-300/80" />
            <h2 className="mt-2 font-display text-5xl font-bold md:text-7xl">
              My <span className="aurora-text">Work</span>
            </h2>
          </div>
          <div className="mb-3 hidden w-56 md:block">
            <div className="h-[3px] overflow-hidden rounded-full bg-white/10">
              <motion.div className="h-full bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400" style={{ width: bar }} />
            </div>
            <p className="mt-2 text-right font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">scroll →</p>
          </div>
        </div>

        <div className="mt-8 flex-1 border-y border-white/10">
          <motion.div ref={track} style={{ x }} className="flex h-full w-max pl-6 md:pl-[7vw]">
            {projects.map((p, i) => (
              <Panel key={p.title} project={p} index={i} />
            ))}
            <div className="relative flex h-full w-[86vw] shrink-0 flex-col items-center justify-center px-10 text-center sm:w-[50vw] lg:w-[30vw]">
              <motion.div
                className="mb-6 text-6xl"
                animate={{ rotate: [0, -10, 10, 0], y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🚀
              </motion.div>
              <p className="aurora-text font-display text-4xl font-bold">Want to see more?</p>
              <p className="mt-3 max-w-xs text-sm text-white/55">Explore the code, experiments and system design write-ups on my GitHub.</p>
              <Magnetic className="mt-8 inline-block">
                <RainbowLink href={profile.github} target="_blank" rel="noreferrer" data-cursor="Open">
                  <GithubIcon className="h-4 w-4" /> See all work <ArrowIcon className="h-4 w-4" />
                </RainbowLink>
              </Magnetic>
            </div>
          </motion.div>
        </div>
        <div className="h-10" />
      </div>
    </section>
  );
}
