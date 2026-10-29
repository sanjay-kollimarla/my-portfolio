"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { currentScroll, scrollToY } from "@/components/fx/SmoothScroll";
import { projects } from "@/data/portfolio";
import { profile } from "@/data/portfolio";
import BorderBeam from "@/components/magic/BorderBeam";
import Magnetic from "@/components/ui/Magnetic";
import { BrandLogo, SectionLabel } from "@/components/ui/Editorial";

type Project = (typeof projects)[number];
const SH = "[@media(max-height:820px)]:";

function Flow({ flow }: { flow: string[] }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className={`mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted ${SH}mb-2`}>
        <span>Architecture</span>
        <span className="flex items-center gap-1.5 text-ink/70">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-green-600" /> live
        </span>
      </div>
      <div className="flex items-center">
        {flow.map((node, i) => (
          <div key={node} className="flex min-w-0 flex-1 items-center">
            <div className={`relative flex min-h-12 ${SH}min-h-9 min-w-0 flex-1 items-center justify-center rounded-lg border border-ink/15 bg-white/[0.09] px-1.5 text-center font-mono text-[10px] leading-tight text-ink md:text-[10.5px]`}>
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-lg border border-accent"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.6 }}
              />
              {node}
            </div>
            {i < flow.length - 1 && (
              <div className="relative mx-1 h-px w-4 shrink-0 bg-ink/25 md:w-6">
                <motion.span
                  className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent"
                  animate={{ left: ["0%", "100%"], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.35, ease: "easeInOut" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Panel({ project, index }: { project: Project; index: number }) {
  const [hover, setHover] = useState(false);
  const [scale, setScale] = useState(1);
  const box = useRef<HTMLElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  // if the content is taller than the pinned viewport, shrink it to fit instead of clipping the bottom
  useLayoutEffect(() => {
    const fit = () => {
      const a = box.current;
      const c = inner.current;
      if (!a || !c) return;
      const prev = c.style.cssText;
      c.style.cssText = "width:100%;height:100%;transform:none";
      const need = c.scrollHeight;
      const have = a.clientHeight;
      c.style.cssText = prev;
      setScale(need > have + 1 ? Math.max(0.4, have / need) : 1);
    };
    fit();
    const ro = new ResizeObserver(fit);
    if (box.current) ro.observe(box.current);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, []);

  return (
    <article
      ref={box}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      className={`relative h-full w-[86vw] shrink-0 overflow-hidden border-r border-rule transition-colors duration-500 sm:w-[60vw] lg:w-[38vw] xl:w-[34vw] ${hover ? "bg-white/[0.05]" : ""}`}
    >
      {hover && <BorderBeam size={240} duration={5} from="#7b9bff" to="#5eead4" width={1.5} />}
      <div
        ref={inner}
        className={`flex flex-col px-6 py-8 md:px-9 ${SH}py-4`}
        style={{ width: `${100 / scale}%`, height: `${100 / scale}%`, transform: `scale(${scale})`, transformOrigin: "0 0" }}
      >
      <div className="flex items-start justify-between gap-4">
        <span className={`font-display text-[4.2rem] leading-none text-transparent [-webkit-text-stroke:1px_rgba(236,234,228,0.5)] ${SH}text-[3rem]`}>0{index + 1}</span>
        <div className="pt-2 text-right font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          System design
          <br />
          Backend
        </div>
      </div>

      <div className={`mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 ${SH}mt-2`}>
        <h3 className="font-display text-[clamp(1.8rem,2.6vw,2.4rem)] leading-[1.02] text-ink">{project.short}</h3>
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            data-cursor="Open"
            className="group inline-flex items-center gap-1.5 rounded-full border border-accent/60 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-accent transition-colors duration-300 hover:bg-accent hover:text-paper"
          >
            Live demo <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
          </a>
        )}
      </div>
      <p className="mt-2 font-display text-lg italic text-accent">{project.tagline}</p>

      <div className={`mt-5 flex flex-wrap gap-1.5 ${SH}mt-3`}>
        {project.stack.map((s) => (
          <span key={s} className="group/logo flex items-center gap-1.5 rounded-full border border-ink/15 px-2.5 py-1 font-mono text-[10.5px] text-ink/80">
            <BrandLogo name={s} className="h-3 w-3" />
            {s}
          </span>
        ))}
      </div>

      <ul className={`mt-5 space-y-2 ${SH}mt-3 ${SH}space-y-1`}>
        {project.points.map((p, pi) => (
          <li
            key={p}
            className="flex gap-3 text-[13px] leading-snug text-ink/75"
          >
            <span className="mt-[0.62em] h-px w-3 shrink-0 bg-accent" />
            {p}
          </li>
        ))}
      </ul>

      <div className={`mt-auto pt-6 ${SH}pt-3`}>
        <Flow flow={project.flow} />
      </div>
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

  // extra scroll at each end where the panels stay put, so the page doesn't jump the moment you reach the last project
  const hold = Math.round(vh * 0.35);
  const total = dist + hold * 2;
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const smoothP = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const along = useTransform(smoothP, (v) => (dist ? Math.min(1, Math.max(0, (v * total - hold) / dist)) : 0));
  const x = useTransform(along, (v) => -v * dist);
  const bar = useTransform(along, [0, 1], ["0%", "100%"]);

  // sideways trackpad swipes / shift+wheel move the panels only and stop at the ends
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const dx = e.shiftKey && !e.deltaX ? e.deltaY : e.deltaX;
      if (Math.abs(dx) <= Math.abs(e.deltaY) && !e.shiftKey) return;
      const start = el.getBoundingClientRect().top + window.scrollY;
      const now = currentScroll();
      if (now < start - 2 || now > start + total + 2) return;
      e.preventDefault();
      e.stopPropagation();
      scrollToY(Math.min(start + hold + dist, Math.max(start + hold, now + dx * 1.4)));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [dist, hold, total]);

  return (
    <section id="work" ref={section} className="relative z-10" style={{ height: total + vh }}>
      <div className={`sticky top-0 flex h-[100svh] flex-col overflow-hidden pt-24 ${SH}pt-20`}>
        <div className="mx-auto flex w-full max-w-[1400px] items-end justify-between px-5 md:px-10">
          <div>
            <SectionLabel n="04">Selected work</SectionLabel>
            <h2 className={`mt-3 font-display text-[clamp(2.4rem,5vw,4.4rem)] leading-none tracking-[-0.02em] text-ink ${SH}text-4xl`}>
              Systems I&apos;ve <em className="text-accent">architected.</em>
            </h2>
          </div>
          <div className="mb-2 hidden w-52 md:block">
            <div className="h-px overflow-hidden bg-ink/15">
              <motion.div className="h-px bg-ink" style={{ width: bar }} />
            </div>
            <p className="mt-2 text-right font-mono text-[10px] uppercase tracking-[0.22em] text-muted">Scroll →</p>
          </div>
        </div>

        <div className={`mt-8 min-h-0 flex-1 border-y border-rule ${SH}mt-4`}>
          <motion.div ref={track} style={{ x }} className="flex h-full w-max pl-5 md:pl-[max(2.5rem,calc((100vw-1400px)/2+2.5rem))]">
            <div className="w-0 shrink-0 border-l border-rule" />
            {projects.map((p, i) => (
              <Panel key={p.title} project={p} index={i} />
            ))}
            <div className="flex h-full w-[86vw] shrink-0 flex-col justify-center px-10 sm:w-[50vw] lg:w-[30vw]">
              <p className="font-display text-[clamp(2rem,3vw,3rem)] leading-tight text-ink">
                More on <em className="text-accent">GitHub.</em>
              </p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">Code, experiments and system design write-ups.</p>
              <Magnetic className="mt-7 inline-block" strength={0.3}>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="Open"
                  className="group inline-flex items-center gap-3 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors duration-300 hover:bg-accent"
                >
                  View profile <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
              </Magnetic>
            </div>
          </motion.div>
        </div>
        <div className="h-8" />
      </div>
    </section>
  );
}
