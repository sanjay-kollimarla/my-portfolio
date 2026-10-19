"use client";

import { motion, useInView } from "framer-motion";
import { useCallback, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { coreConcepts, skillGroups } from "@/data/portfolio";
import TechLogo from "@/components/magic/TechLogo";
import ScrambleText from "@/components/magic/ScrambleText";
import BorderBeam from "@/components/magic/BorderBeam";
import { iconFor, techIcons } from "@/lib/techIcons";

const ease = [0.22, 1, 0.36, 1] as const;
const allTech = skillGroups.flatMap((g) => g.items);
const logoRow = Object.keys(techIcons).filter((k, i, all) => all.findIndex((o) => techIcons[o].path === techIcons[k].path) === i);

type Chip = { key: string; title: string; icon: string; color: string; items: string[]; concepts?: boolean };
const chips: Chip[] = [
  ...skillGroups.map((g) => ({ key: g.title, title: g.title, icon: g.icon, color: g.color, items: g.items })),
  { key: "concepts", title: "Core Concepts", icon: "✳", color: "#f472b6", items: coreConcepts, concepts: true },
];
// 3×3 board: chips around the CPU (centre cell)
const SLOTS = ["1 / 1", "1 / 2", "1 / 3", "2 / 1", "2 / 3", "3 / 1", "3 / 2", "3 / 3"];

type Trace = { d: string; color: string; chip: number; delay: number; via: [number, number] };

/** Gold pins along a chip edge. */
function Pins({ side, count, color }: { side: "top" | "bottom" | "left" | "right"; count: number; color: string }) {
  const horizontal = side === "top" || side === "bottom";
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute flex justify-around ${
        horizontal ? "inset-x-6 h-2 flex-row" : "inset-y-6 w-2 flex-col"
      } ${side === "top" ? "-top-2" : side === "bottom" ? "-bottom-2" : side === "left" ? "-left-2" : "-right-2"}`}
    >
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={`${horizontal ? "h-2 w-[5px]" : "h-[5px] w-2"} rounded-[1px]`}
          style={{ background: `linear-gradient(${horizontal ? "180deg" : "90deg"}, #fde68a, #b45309)`, boxShadow: `0 0 6px ${color}55` }}
        />
      ))}
    </div>
  );
}

function Part({ name, i, color, on }: { name: string; i: number; color: string; on: boolean }) {
  const brand = iconFor(name)?.color ?? color;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.3, y: 12 }}
      animate={on ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.9 + i * 0.07 }}
      whileHover={{ y: -6, scale: 1.12, transition: { type: "spring", stiffness: 420, damping: 12 } }}
      className="group/part relative flex flex-col items-center gap-1.5 rounded-lg border border-white/10 bg-black/40 px-1.5 pb-2 pt-2.5"
      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }}
    >
      {/* solder pads */}
      <span className="absolute -left-[3px] top-1/2 h-1.5 w-[5px] -translate-y-1/2 rounded-sm bg-amber-400/70" />
      <span className="absolute -right-[3px] top-1/2 h-1.5 w-[5px] -translate-y-1/2 rounded-sm bg-amber-400/70" />
      <span
        className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover/part:opacity-100"
        style={{ boxShadow: `0 0 22px -2px ${brand}, inset 0 0 14px -4px ${brand}` }}
      />
      <span className="float-y relative" style={{ animationDuration: `${2.4 + (i % 4) * 0.4}s`, animationDelay: `${-i * 0.5}s` }}>
        <TechLogo name={name} className="h-7 w-7 transition-transform duration-500 group-hover/part:rotate-[360deg]" />
      </span>
      <span className="relative text-center font-mono text-[10px] leading-tight text-white/75 group-hover/part:text-white">{name}</span>
    </motion.div>
  );
}

function ChipCard({
  chip,
  index,
  on,
  active,
  dimmed,
  onHover,
  innerRef,
}: {
  chip: Chip;
  index: number;
  on: boolean;
  active: boolean;
  dimmed: boolean;
  onHover: (i: number | null) => void;
  innerRef: (el: HTMLDivElement | null) => void;
}) {
  const c = chip.color;
  return (
    <motion.div
      ref={innerRef}
      className="relative"
      style={{ gridArea: SLOTS[index] }}
      initial={{ opacity: 0, scale: 0.85, filter: "brightness(0.2)" }}
      animate={on ? { opacity: dimmed ? 0.4 : 1, scale: active ? 1.03 : 1, filter: "brightness(1)" } : {}}
      transition={{ duration: 0.6, delay: on && !dimmed && !active ? 0.5 + index * 0.12 : 0, ease }}
      onPointerEnter={() => onHover(index)}
      onPointerLeave={() => onHover(null)}
    >
      <div
        className="relative rounded-2xl border p-4 pt-5 transition-shadow duration-500"
        style={{
          borderColor: active ? c : `${c}40`,
          background: "linear-gradient(160deg, rgba(48,34,110,0.78), rgba(28,19,72,0.85))",
          boxShadow: active ? `0 0 45px -8px ${c}, inset 0 0 30px -12px ${c}` : `0 10px 40px -20px ${c}`,
        }}
      >
        <Pins side="top" count={8} color={c} />
        <Pins side="bottom" count={8} color={c} />
        <Pins side="left" count={4} color={c} />
        <Pins side="right" count={4} color={c} />

        {/* boot scanline */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 h-10 rounded-2xl"
          style={{ background: `linear-gradient(180deg, transparent, ${c}55, transparent)` }}
          initial={{ top: "-20%", opacity: 0 }}
          animate={on ? { top: ["-20%", "110%"], opacity: [0, 1, 0] } : {}}
          transition={{ duration: 1.1, delay: 0.5 + index * 0.12, ease: "easeInOut" }}
        />

        {/* header: chip id, title, status LED */}
        <div className="relative mb-3 flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md font-mono text-sm" style={{ background: `${c}1f`, color: c, boxShadow: `inset 0 0 0 1px ${c}55` }}>
            {chip.icon}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/35">U{index + 1} · {chip.concepts ? "firmware" : "module"}</p>
            <h3 className="font-display text-[15px] font-bold leading-tight">{chip.title}</h3>
          </div>
          <span className="relative flex h-2.5 w-2.5">
            {on && <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: c }} />}
            <motion.span
              className="relative inline-flex h-2.5 w-2.5 rounded-full"
              initial={{ background: "#27272a" }}
              animate={on ? { background: c, boxShadow: `0 0 10px ${c}` } : {}}
              transition={{ delay: 0.8 + index * 0.12 }}
            />
          </span>
        </div>

        {chip.concepts ? (
          <div className="relative flex flex-wrap gap-1.5">
            {chip.items.map((t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, y: 8 }}
                animate={on ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.9 + i * 0.04 }}
                whileHover={{ scale: 1.08 }}
                className="rounded border px-2 py-1 font-mono text-[10px] text-white/75"
                style={{ borderColor: `${skillGroups[i % skillGroups.length].color}55`, background: `${skillGroups[i % skillGroups.length].color}10` }}
              >
                {t}
              </motion.span>
            ))}
          </div>
        ) : (
          <div className="relative grid grid-cols-3 gap-2.5 sm:grid-cols-4">
            {chip.items.map((name, i) => (
              <Part key={name} name={name} i={i} color={c} on={on} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Cpu({ on, hoverColor, innerRef }: { on: boolean; hoverColor: string | null; innerRef: (el: HTMLDivElement | null) => void }) {
  const glow = hoverColor ?? "#a855f7";
  return (
    <motion.div
      ref={innerRef}
      className="relative flex items-center justify-center"
      style={{ gridArea: "2 / 2" }}
      initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
      animate={on ? { opacity: 1, scale: 1, rotate: 0 } : {}}
      transition={{ type: "spring", stiffness: 90, damping: 14 }}
    >
      <div className="relative aspect-square w-full max-w-[290px]">
        {/* heartbeat rings */}
        {[0, 1, 2].map((r) => (
          <motion.span
            key={r}
            aria-hidden
            className="absolute inset-0 rounded-[2rem] border"
            style={{ borderColor: glow }}
            animate={on ? { scale: [1, 1.35], opacity: [0.5, 0] } : {}}
            transition={{ duration: 2.4, repeat: Infinity, delay: r * 0.8, ease: "easeOut" }}
          />
        ))}
        {/* spinning conic rim */}
        <div className="absolute inset-0 overflow-hidden rounded-[2rem] p-[2px]">
          <div className="orbit absolute inset-[-50%] [--orbit-duration:6s]" style={{ background: `conic-gradient(from 0deg, transparent 0 55%, ${glow}, #22d3ee, transparent 90%)` }} />
          <div className="relative h-full w-full rounded-[calc(2rem-2px)] bg-[linear-gradient(160deg,#2c1e64,#1d1445)]" />
        </div>
        <Pins side="top" count={10} color={glow} />
        <Pins side="bottom" count={10} color={glow} />
        <Pins side="left" count={10} color={glow} />
        <Pins side="right" count={10} color={glow} />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
          {/* die with grid */}
          <motion.div
            className="relative mb-1 flex h-16 w-16 items-center justify-center rounded-xl border border-white/15 bg-[length:8px_8px]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)",
              boxShadow: `0 0 30px -4px ${glow}, inset 0 0 20px -6px ${glow}`,
            }}
            animate={{ rotate: [0, 90, 180, 270, 360] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          >
            <span className="aurora-text font-display text-xl font-bold" style={{ display: "inline-block" }}>
              SK
            </span>
          </motion.div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">SK-9000 core</p>
          <p className="font-display text-lg font-bold leading-tight">Full-Stack<br />Engine</p>
          <div className="mt-1 flex gap-3 font-mono text-[10px] text-white/55">
            <span>
              <span className="text-cyan-300">{allTech.length}</span> parts
            </span>
            <span>
              <span className="text-pink-300">{skillGroups.length}</span> modules
            </span>
          </div>
          <div className="mt-1 flex h-4 items-end gap-[3px]">
            {Array.from({ length: 12 }, (_, i) => (
              <motion.span
                key={i}
                className="h-full w-[3px] origin-bottom rounded-sm"
                style={{ background: glow }}
                animate={on ? { scaleY: [0.2, 1, 0.35] } : {}}
                transition={{ duration: 0.6 + (i % 4) * 0.15, repeat: Infinity, repeatType: "mirror", delay: i * 0.05 }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Board() {
  const wrap = useRef<HTMLDivElement>(null);
  const cpuRef = useRef<HTMLDivElement | null>(null);
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const on = useInView(wrap, { once: true, amount: 0.12 });
  const [hover, setHover] = useState<number | null>(null);
  const [traces, setTraces] = useState<Trace[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const measure = useCallback(() => {
    const box = wrap.current?.getBoundingClientRect();
    const cpuEl = cpuRef.current?.firstElementChild as HTMLElement | null | undefined;
    const cpu = cpuEl?.getBoundingClientRect();
    if (!box || !cpu) return;
    const rel = (r: DOMRect) => ({ l: r.left - box.left, r: r.right - box.left, t: r.top - box.top, b: r.bottom - box.top, cx: r.left - box.left + r.width / 2, cy: r.top - box.top + r.height / 2 });
    const C = rel(cpu);
    const out: Trace[] = [];
    chipRefs.current.forEach((el, i) => {
      if (!el) return;
      const K = rel(el.getBoundingClientRect());
      const color = chips[i].color;
      const sameRow = Math.abs(K.cy - C.cy) < (C.b - C.t) / 2;
      for (let k = -1; k <= 1; k++) {
        const o = k * 12;
        let d: string;
        let via: [number, number];
        if (sameRow) {
          const sx = K.cx < C.cx ? C.l : C.r;
          const ex = K.cx < C.cx ? K.r : K.l;
          const mx = (sx + ex) / 2 + o * 0.6;
          d = `M ${sx} ${C.cy + o} H ${mx} V ${K.cy + o} H ${ex}`;
          via = [ex, K.cy + o];
        } else {
          const up = K.cy < C.cy;
          const sy = up ? C.t : C.b;
          const ey = up ? K.b : K.t;
          const dx = K.cx - C.cx;
          const sx = C.cx + Math.max(-(C.r - C.l) / 2 + 30, Math.min((C.r - C.l) / 2 - 30, dx * 0.22)) + o;
          const my = (sy + ey) / 2 + (up ? -1 : 1) * o * 0.4;
          d = `M ${sx} ${sy} V ${my} H ${K.cx + o} V ${ey}`;
          via = [K.cx + o, ey];
        }
        out.push({ d, color, chip: i, delay: (i * 0.37 + (k + 1) * 0.61) % 2.4, via });
      }
    });
    setTraces(out);
    setSize({ w: box.width, h: box.height });
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (wrap.current) ro.observe(wrap.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  return (
    <div ref={wrap} className="relative mx-auto mt-16 hidden max-w-7xl px-10 lg:block">
      {/* PCB substrate */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-[2.5rem] border border-emerald-400/10 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(16,185,129,0.08), transparent 60%), linear-gradient(rgba(52,211,153,0.05) 1px, transparent 1px) 0 0 / 28px 28px, linear-gradient(90deg, rgba(52,211,153,0.05) 1px, transparent 1px) 0 0 / 28px 28px",
        }}
      />

      {/* copper traces + data pulses */}
      <svg className="pointer-events-none absolute inset-0 overflow-visible" width={size.w} height={size.h} aria-hidden>
        <defs>
          <filter id="trace-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {traces.map((t, i) => {
          const lit = hover === null || hover === t.chip;
          const hot = hover === t.chip;
          return (
            <g key={i} style={{ opacity: lit ? 1 : 0.18, transition: "opacity .4s" }}>
              <motion.path
                d={t.d}
                fill="none"
                stroke="#b8860b"
                strokeOpacity={0.35}
                strokeWidth={hot ? 3 : 2}
                strokeLinejoin="round"
                pathLength={1}
                initial={{ pathLength: 0 }}
                animate={on ? { pathLength: 1 } : {}}
                transition={{ duration: 1, delay: 0.1 + t.chip * 0.08, ease: "easeInOut" }}
              />
              {on && (
                <path
                  d={t.d}
                  fill="none"
                  stroke={t.color}
                  strokeWidth={hot ? 4 : 2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength={1}
                  strokeOpacity={0.95}
                  className="trace-pulse"
                  style={{ animationDelay: `${1 + t.delay}s`, animationDuration: hot ? "0.9s" : "2.4s" } as CSSProperties}
                />
              )}
              <motion.circle
                cx={t.via[0]}
                cy={t.via[1]}
                r={hot ? 5 : 3.5}
                fill="#1d1445"
                stroke={t.color}
                strokeWidth={2}
                initial={{ scale: 0 }}
                animate={on ? { scale: 1 } : {}}
                transition={{ delay: 1 + t.chip * 0.08 }}
              />
            </g>
          );
        })}
      </svg>

      <div className="relative grid grid-cols-3 items-center gap-x-28 gap-y-16 py-10">
        {chips.map((chip, i) => (
          <ChipCard
            key={chip.key}
            chip={chip}
            index={i}
            on={on}
            active={hover === i}
            dimmed={hover !== null && hover !== i}
            onHover={setHover}
            innerRef={(el) => {
              chipRefs.current[i] = el;
            }}
          />
        ))}
        <Cpu on={on} hoverColor={hover !== null ? chips[hover].color : null} innerRef={(el) => (cpuRef.current = el)} />
      </div>
    </div>
  );
}

/** Narrow screens: the same chips stacked on a vertical data bus. */
function MobileBoard() {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, margin: "-10%" });
  return (
    <div ref={ref} className="relative mx-auto mt-12 max-w-xl px-6 lg:hidden">
      <div className="absolute bottom-0 left-9 top-0 w-[2px] overflow-hidden bg-amber-700/30">
        <span className="bus-pulse absolute left-0 h-24 w-full bg-gradient-to-b from-transparent via-cyan-300 to-transparent" />
      </div>
      <div className="space-y-10 pl-8">
        {chips.map((chip, i) => (
          <div key={chip.key} className="relative">
            <span className="absolute -left-[22px] top-8 h-[2px] w-6" style={{ background: chip.color, boxShadow: `0 0 8px ${chip.color}` }} />
            <ChipCard chip={chip} index={i} on={on} active={false} dimmed={false} onHover={() => {}} innerRef={() => {}} />
          </div>
        ))}
      </div>
    </div>
  );
}

function LogoRow({ items, reverse = false, duration }: { items: string[]; reverse?: boolean; duration: number }) {
  return (
    <div className="marquee overflow-hidden py-3">
      <div className={`marquee-track gap-12 ${reverse ? "reverse" : ""}`} style={{ "--duration": `${duration}s` } as CSSProperties}>
        {[...items, ...items].map((n, i) => {
          const brand = iconFor(n)?.color ?? "#ffffff";
          return (
            <span
              key={i}
              className="group flex shrink-0 cursor-default items-center gap-2.5 text-[15px] font-medium text-white/60 grayscale-[55%] transition-all duration-300 hover:text-white hover:grayscale-0"
              style={{ "--brand": brand } as CSSProperties}
            >
              <TechLogo
                name={n}
                className="h-6 w-6 opacity-85 transition-all duration-300 group-hover:scale-125 group-hover:opacity-100 group-hover:[filter:drop-shadow(0_0_10px_var(--brand))]"
              />
              {n}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/** A contained "toolbelt" logo cloud: two straight rows drifting in opposite directions. */
function Toolbelt() {
  const half = Math.ceil(logoRow.length / 2);
  return (
    <motion.div
      className="mx-auto mt-20 max-w-6xl px-6"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease }}
    >
      <div className="glass relative overflow-hidden rounded-3xl px-2 py-8">
        <BorderBeam size={260} duration={10} from="#a855f7" to="#22d3ee" width={1.5} />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.12),transparent_60%)]" />
        <p className="relative mb-4 text-center font-mono text-[11px] uppercase tracking-[0.35em] text-white/40">
          <span className="text-violet-300">{"//"}</span> the rest of the toolbelt
        </p>
        <div className="relative [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
          <LogoRow items={logoRow.slice(0, half)} duration={60} />
          <LogoRow items={logoRow.slice(half)} reverse duration={55} />
        </div>
      </div>
    </motion.div>
  );
}

export default function TechStack() {
  return (
    <section id="stack" className="relative z-10 pb-12 pt-28">
      <div className="text-center">
        <ScrambleText text="05 // TOOLBOX" className="font-mono text-xs tracking-[0.3em] text-emerald-300/80" />
      </div>
      <motion.h2
        className="mt-3 text-center font-display text-5xl font-bold uppercase tracking-tight md:text-8xl"
        initial={{ opacity: 0, scale: 0.8, filter: "blur(14px)" }}
        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.1, ease }}
      >
        Tech <span className="aurora-text">Stack</span>
      </motion.h2>
      <p className="mt-4 text-center font-mono text-xs text-white/45">
        {">"} booting {allTech.length} components across {skillGroups.length} modules — hover a chip to route power
      </p>

      <Board />
      <MobileBoard />

      <Toolbelt />
    </section>
  );
}
