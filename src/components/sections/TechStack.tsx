"use client";

import { motion } from "framer-motion";
import { useLayoutEffect, useRef, useState, type MouseEvent, type CSSProperties } from "react";
import { coreConcepts, skillGroups } from "@/data/portfolio";
import { iconFor } from "@/lib/techIcons";
import { LineReveal, Rise, SectionLabel, ease } from "@/components/ui/Editorial";

const total = skillGroups.reduce((n, g) => n + g.items.length, 0);

/** grid cell for each card on desktop (core sits in the middle cell) */
const pos = [
  "lg:col-start-1 lg:row-start-1",
  "lg:col-start-2 lg:row-start-1",
  "lg:col-start-3 lg:row-start-1",
  "lg:col-start-1 lg:row-start-2",
  "lg:col-start-3 lg:row-start-2",
  "lg:col-start-1 lg:row-start-3",
  "lg:col-start-2 lg:row-start-3",
  "lg:col-start-3 lg:row-start-3",
];

const nodes = [
  ...skillGroups.map((g) => ({ title: g.title, items: g.items, kind: "tools" as const })),
  { title: "Core Concepts", items: coreConcepts as readonly string[], kind: "concepts" as const },
];

const light = (c: string) => (["#f5f5f5", "#e5e7eb", "#000000", "#171717"].includes(c.toLowerCase()) ? "#eceae4" : c);

function Logo({ name }: { name: string }) {
  const icon = iconFor(name);
  if (!icon) return null;
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-6 w-6 shrink-0" fill={light(icon.color)}>
      <path d={icon.path} />
    </svg>
  );
}

function Node({
  node,
  index,
  setRef,
  onHover,
}: {
  node: (typeof nodes)[number];
  index: number;
  setRef: (el: HTMLElement | null) => void;
  onHover: (i: number | null) => void;
}) {
  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${Math.round(e.clientX - r.left)}px`);
    e.currentTarget.style.setProperty("--my", `${Math.round(e.clientY - r.top)}px`);
  };

  return (
    <motion.article
      ref={setRef}
      onMouseMove={onMove}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      style={{ "--mx": "50%", "--my": "0%" } as CSSProperties}
      className={`group/node relative z-10 overflow-hidden rounded-2xl border border-rule bg-[#0e111a] p-5 sm:p-6 ${pos[index]}`}
      initial={{ opacity: 0, scale: 0.88, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, delay: 0.1 + (index % 3) * 0.1, ease }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/node:opacity-100"
        style={{ background: "radial-gradient(320px circle at var(--mx) var(--my), rgba(123,155,255,0.18), transparent 65%)" }}
      />
      {/* port dots on the card edges where wires plug in */}
      <span aria-hidden className="absolute left-1/2 top-0 h-1.5 w-8 -translate-x-1/2 rounded-b-full bg-accent/40 transition-colors group-hover/node:bg-accent" />
      <span aria-hidden className="absolute bottom-0 left-1/2 h-1.5 w-8 -translate-x-1/2 rounded-t-full bg-accent/40 transition-colors group-hover/node:bg-accent" />

      <header className="relative mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" style={{ animationDelay: `${index * 0.35}s` }} />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <h3 className="font-display text-2xl leading-none text-ink">{node.title}</h3>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{String(node.items.length).padStart(2, "0")}</span>
      </header>

      {node.kind === "tools" ? (
        <motion.ul
          className="relative flex flex-wrap gap-2"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.45 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {node.items.map((name) => (
            <motion.li
              key={name}
              variants={{
                hidden: { opacity: 0, scale: 0.3, y: 18 },
                show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 190, damping: 12 } },
              }}
            >
              <motion.div
                whileHover={{ y: -6, scale: 1.12 }}
                className="flex w-[74px] flex-col items-center gap-1.5 rounded-xl border border-rule bg-ink/[0.04] px-1.5 py-3 text-center sm:w-[80px]"
              >
                <Logo name={name} />
                <span className="font-mono text-[9.5px] uppercase leading-tight tracking-wide text-ink/75">{name}</span>
              </motion.div>
            </motion.li>
          ))}
        </motion.ul>
      ) : (
        <motion.ul
          className="relative flex flex-wrap gap-1.5"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.45 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {node.items.map((c) => (
            <motion.li
              key={c}
              className="rounded-md border border-rule bg-ink/[0.04] px-2.5 py-1.5 font-mono text-[10.5px] text-ink/80"
              variants={{ hidden: { opacity: 0, x: -14 }, show: { opacity: 1, x: 0, transition: { duration: 0.5, ease } } }}
              whileHover={{ y: -2, borderColor: "rgba(123,155,255,0.8)" }}
            >
              {c}
            </motion.li>
          ))}
        </motion.ul>
      )}
    </motion.article>
  );
}

function Core({ setRef }: { setRef: (el: HTMLElement | null) => void }) {
  return (
    <motion.div
      ref={setRef}
      className="relative z-10 order-first flex items-center justify-center py-6 lg:order-none lg:col-start-2 lg:row-start-2"
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
    >
      <div className="relative flex h-[210px] w-[210px] items-center justify-center">
        <span aria-hidden className="absolute inset-0 animate-ping rounded-full border border-accent/30 [animation-duration:3.2s]" />
        <span aria-hidden className="ring-spin absolute -inset-3 rounded-full border border-dashed border-ink/20" />
        <span aria-hidden className="ring-spin-rev absolute inset-3 rounded-full border border-accent/30" />
        <div className="relative h-[150px] w-[150px] overflow-hidden rounded-[2rem] p-[2px]">
          <span className="shimmer-spin absolute inset-[-60%] bg-[conic-gradient(from_0deg,transparent_0_220deg,#7b9bff_320deg,#ffb86b_350deg,transparent_360deg)]" />
          <div className="relative flex h-full w-full flex-col items-center justify-center rounded-[1.9rem] bg-[#0b0e16]">
            <span className="font-display text-5xl leading-none text-ink">SK</span>
            <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-accent">{total} tools</span>
            <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em] text-muted">{skillGroups.length} areas</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function TechStack() {
  const wrap = useRef<HTMLDivElement>(null);
  const core = useRef<HTMLElement | null>(null);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const [paths, setPaths] = useState<string[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [hot, setHot] = useState<number | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const w = wrap.current;
      const c = core.current;
      if (!w || !c || window.innerWidth < 1024) {
        setPaths([]);
        return;
      }
      const wr = w.getBoundingClientRect();
      const cr = c.getBoundingClientRect();
      const cx = Math.round(cr.left - wr.left + cr.width / 2);
      const cy = Math.round(cr.top - wr.top + cr.height / 2);
      setSize({ w: Math.round(wr.width), h: Math.round(wr.height) });
      setPaths(
        cards.current.map((el) => {
          if (!el) return "";
          const r = el.getBoundingClientRect();
          const x = Math.round(r.left - wr.left + r.width / 2);
          const y = Math.round(r.top - wr.top + r.height / 2);
          const dx = x - cx;
          const dy = y - cy;
          if (dx === 0 || dy === 0) return `M${cx} ${cy} L${x} ${y}`;
          return `M${cx} ${cy} C${cx + Math.round(dx * 0.7)} ${cy}, ${x} ${cy + Math.round(dy * 0.7)}, ${x} ${y}`;
        }),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (wrap.current) ro.observe(wrap.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section id="stack" className="relative overflow-hidden py-28 md:py-40">
      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
        <SectionLabel n="05">Skills</SectionLabel>

        <div className="mt-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="font-display text-5xl leading-[0.98] text-ink sm:text-6xl md:text-8xl">
            <LineReveal lines={["Tools I build", <em key="w" className="accent-grad pr-[0.06em]">with.</em>]} />
          </h2>
          <Rise delay={0.2} className="max-w-xs text-sm leading-relaxed text-muted">
            One system, live. Signals flow between every layer of the stack — hover a node to trace its wire.
          </Rise>
        </div>

        <div ref={wrap} className="relative mt-16 grid grid-cols-1 gap-5 pl-7 lg:grid-cols-3 lg:gap-x-16 lg:gap-y-14 lg:pl-0">
          {/* mobile: a spine with a light running down it */}
          <span aria-hidden className="absolute bottom-0 left-2 top-0 w-px bg-rule lg:hidden" />
          <span aria-hidden className="spine-run absolute left-2 h-24 w-px bg-gradient-to-b from-transparent via-accent to-transparent lg:hidden" />

          {/* desktop: wires from the core to every node */}
          <svg
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-0 hidden overflow-visible lg:block"
            width={size.w}
            height={size.h}
          >
            {paths.map((d, i) => {
              if (!d) return null;
              const on = hot === i;
              return (
                <g key={i}>
                  <motion.path
                    d={d}
                    fill="none"
                    stroke="rgba(236,234,228,0.16)"
                    strokeWidth={1.5}
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, delay: 0.3 + i * 0.1, ease }}
                  />
                  <path
                    d={d}
                    fill="none"
                    stroke="#7b9bff"
                    strokeWidth={on ? 2.5 : 1.5}
                    strokeDasharray="4 10"
                    strokeLinecap="round"
                    className="wire-flow"
                    style={{ opacity: on ? 1 : 0.4, transition: "opacity .3s, stroke-width .3s" }}
                  />
                  <circle r={on ? 5 : 3.5} fill="#ffb86b">
                    <animateMotion dur={`${3.2 + (i % 3) * 0.6}s`} begin={`${i * 0.5}s`} repeatCount="indefinite" path={d} />
                  </circle>
                  <circle r={on ? 5 : 3.5} fill="#7b9bff">
                    <animateMotion
                      dur={`${3.8 + (i % 3) * 0.5}s`}
                      begin={`${i * 0.4 + 1}s`}
                      repeatCount="indefinite"
                      path={d}
                      keyPoints="1;0"
                      keyTimes="0;1"
                      calcMode="linear"
                    />
                  </circle>
                </g>
              );
            })}
          </svg>

          <Core setRef={(el) => (core.current = el)} />
          {nodes.map((n, i) => (
            <Node key={n.title} node={n} index={i} setRef={(el) => (cards.current[i] = el)} onHover={setHot} />
          ))}
        </div>
      </div>
    </section>
  );
}
