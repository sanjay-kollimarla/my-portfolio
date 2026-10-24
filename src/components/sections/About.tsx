"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { profile, stats } from "@/data/portfolio";
import Counter from "@/components/ui/Counter";
import { LineReveal, Rise, SectionLabel } from "@/components/ui/Editorial";

const highlight = new Set(["Node.js,", "TypeScript,", "MongoDB,", "Redis", "AWS.", "multi-tenant", "SaaS", "distributed", "real-time"]);

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  const y = useTransform(progress, range, [6, 0]);
  return (
    <motion.span style={{ opacity, y }} className={`mr-[0.28em] inline-block ${highlight.has(word) ? "font-medium text-accent" : "text-ink"}`}>
      {word}
    </motion.span>
  );
}

export default function About() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const words = profile.summary.split(" ");

  return (
    <section id="about" className="relative z-10 flex min-h-screen flex-col justify-center px-5 py-28 md:px-10 lg:flex-row lg:items-center">
      {/* phones: leave room for the 3D desk scene before the text */}
      <div aria-hidden className="h-[70svh] lg:hidden" />
      <div className="mx-auto w-full max-w-[1400px] lg:flex lg:justify-end">
        <div className="w-full lg:w-[44%]">
          <SectionLabel n="01">About</SectionLabel>
          <h2 className="mt-6 font-display text-[clamp(2.6rem,5.2vw,4.8rem)] leading-[0.98] tracking-[-0.015em] text-ink">
            <LineReveal lines={["Building systems", <em key="s" className="text-accent">that scale.</em>]} />
          </h2>

          <p ref={ref} className="mt-8 text-[1.05rem] leading-[1.7] md:text-[1.12rem]">
            {words.map((w, i) => (
              <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
            ))}
          </p>

          <div className="mt-12 grid grid-cols-2 border-t border-rule">
            {stats.map((s, i) => (
              <Rise key={s.label} delay={i * 0.08} y={16} className={`py-6 ${i % 2 === 0 ? "border-r border-rule pr-5" : "pl-5"} ${i < 2 ? "border-b border-rule" : ""}`}>
                <div className="font-display text-[3.2rem] leading-none text-ink">
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <p className="mt-2.5 font-mono text-[10.5px] uppercase leading-snug tracking-[0.14em] text-muted">{s.label}</p>
              </Rise>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
