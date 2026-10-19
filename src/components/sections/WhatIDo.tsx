"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { whatIDo } from "@/data/portfolio";
import BorderBeam from "@/components/magic/BorderBeam";
import ScrambleText from "@/components/magic/ScrambleText";
import TechLogo from "@/components/magic/TechLogo";

const palette = [
  { a: "#a855f7", b: "#22d3ee", text: "from-violet-300 via-fuchsia-300 to-cyan-300", glyph: "⚙" },
  { a: "#f472b6", b: "#facc15", text: "from-pink-300 via-orange-300 to-amber-200", glyph: "◐" },
];

function Corners({ color }: { color: string }) {
  const base = "absolute h-4 w-4 transition-all duration-500";
  return (
    <>
      <span className={`${base} -left-px -top-px border-l-2 border-t-2`} style={{ borderColor: color }} />
      <span className={`${base} -right-px -top-px border-r-2 border-t-2`} style={{ borderColor: color }} />
      <span className={`${base} -bottom-px -left-px border-b-2 border-l-2`} style={{ borderColor: color }} />
      <span className={`${base} -bottom-px -right-px border-b-2 border-r-2`} style={{ borderColor: color }} />
    </>
  );
}

export default function WhatIDo() {
  const [active, setActive] = useState(0);

  return (
    <section id="whatido" className="relative z-10 flex min-h-screen items-center px-6 py-28 md:px-[7vw]">
      <div className="w-full lg:ml-[53%] lg:max-w-[40vw]">
        <ScrambleText text="02 // WHAT I DO" className="font-mono text-xs tracking-[0.3em] text-pink-300/80" />
        <h2 className="mt-3 font-display text-5xl font-bold uppercase leading-[0.95] md:text-7xl">
          {["What", "I do"].map((w, i) => (
            <span key={w} className="block overflow-hidden">
              <motion.span
                className={`block ${i === 1 ? "aurora-text" : ""}`}
                initial={{ y: "110%", skewY: 8 }}
                whileInView={{ y: "0%", skewY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h2>

        <div className="mt-12 flex flex-col gap-5">
          {whatIDo.map((card, i) => {
            const open = active === i;
            const c = palette[i % palette.length];
            return (
              <motion.div
                key={card.title}
                layout
                onPointerEnter={() => setActive(i)}
                onClick={() => setActive(i)}
                initial={{ opacity: 0, x: 80, rotate: 3 }}
                whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ layout: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }, duration: 0.9, delay: i * 0.12 }}
                className={`relative cursor-pointer overflow-hidden rounded-xl border border-dashed p-7 transition-colors duration-500 md:p-9 ${
                  open ? "glass border-transparent" : "border-white/20 bg-transparent"
                }`}
              >
                {open && <BorderBeam size={220} duration={6} from={c.a} to={c.b} width={2} />}
                <Corners color={open ? c.a : "rgba(255,255,255,0.4)"} />
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full blur-3xl transition-opacity duration-700"
                  style={{ background: `radial-gradient(circle, ${c.a}, ${c.b})`, opacity: open ? 0.3 : 0 }}
                />
                <motion.div layout="position" className="relative flex items-start justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <motion.span
                      className="neo flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
                      style={{ color: c.a }}
                      animate={open ? { rotate: [0, 360] } : { rotate: 0 }}
                      transition={open ? { duration: 8, repeat: Infinity, ease: "linear" } : { duration: 0.5 }}
                    >
                      {c.glyph}
                    </motion.span>
                    <h3 className="font-display text-3xl font-bold uppercase leading-none md:text-[2.4rem]">
                      {card.title}
                      <span className={`mt-2 block bg-gradient-to-r bg-clip-text text-lg font-medium normal-case tracking-wide text-transparent md:text-xl ${c.text}`}>
                        {card.titleAccent}
                      </span>
                    </h3>
                  </div>
                  <motion.span
                    className="neo-btn flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl"
                    style={{ color: c.a }}
                    animate={{ rotate: open ? 45 : 0 }}
                  >
                    +
                  </motion.span>
                </motion.div>
                <motion.div
                  initial={false}
                  animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="relative overflow-hidden"
                >
                  <p className="pt-6 text-[15px] leading-relaxed text-white/70">{card.blurb}</p>
                  <p className="mt-6 text-xs uppercase tracking-[0.25em] text-white/40">Skillset & tools</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {card.skills.map((s, si) => (
                      <motion.span
                        key={s}
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={open ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.8 }}
                        transition={{ delay: open ? 0.15 + si * 0.035 : 0, type: "spring", stiffness: 260, damping: 18 }}
                        whileHover={{ y: -4, scale: 1.08 }}
                        className="neo-btn flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-white/85"
                      >
                        <TechLogo name={s} className="h-3.5 w-3.5" />
                        {s}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
