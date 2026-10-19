"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { profile, stats } from "@/data/portfolio";
import Counter from "@/components/ui/Counter";
import BorderBeam from "@/components/magic/BorderBeam";
import ProfileOrbit from "@/components/magic/ProfileOrbit";
import ScrambleText from "@/components/magic/ScrambleText";

const highlight: Record<string, string> = {
  "Node.js,": "#5FA04E",
  "TypeScript,": "#60a5fa",
  "MongoDB,": "#4ade80",
  Redis: "#f87171",
  "AWS.": "#fb923c",
  "multi-tenant": "#c084fc",
  SaaS: "#c084fc",
  distributed: "#22d3ee",
  "real-time": "#f472b6",
  "Scalability,": "#facc15",
};

const statColors = [
  { from: "#a855f7", to: "#22d3ee", text: "from-violet-300 to-cyan-300" },
  { from: "#f472b6", to: "#facc15", text: "from-pink-300 to-amber-200" },
  { from: "#22d3ee", to: "#34d399", text: "from-cyan-300 to-emerald-300" },
  { from: "#fb923c", to: "#f472b6", text: "from-orange-300 to-pink-300" },
];

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [10, 0]);
  const color = highlight[word];
  return (
    <motion.span
      style={{ opacity, y, color, textShadow: color ? `0 0 24px ${color}66` : undefined }}
      className={`mr-[0.26em] inline-block ${color ? "font-semibold" : ""}`}
    >
      {word}
    </motion.span>
  );
}

export default function About() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 50%"] });
  const words = profile.summary.split(" ");

  return (
    <section id="about" className="relative z-10 flex min-h-screen flex-col justify-center px-6 py-28 md:px-[7vw] lg:flex-row lg:items-center">
      {/* phones: leave room for the 3D desk scene before the text */}
      <div aria-hidden className="h-[70svh] lg:hidden" />
      <div className="w-full lg:ml-[53%] lg:max-w-[41vw]">
        <div className="flex flex-col-reverse items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <ScrambleText text="01 // WHO AM I" className="font-mono text-xs tracking-[0.3em] text-cyan-300/80" />
            <motion.h2
              className="mt-3 font-display text-5xl font-bold md:text-6xl"
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              About <span className="aurora-text">Me</span>
            </motion.h2>
          </div>
          <motion.div
            className="-my-10 self-center sm:-mr-10"
            initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 90, damping: 14 }}
          >
            <ProfileOrbit size={110} />
          </motion.div>
        </div>

        <p ref={ref} className="mt-6 font-display text-xl leading-relaxed text-white md:text-[1.5rem] md:leading-[1.5]">
          {words.map((w, i) => (
            <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
          ))}
        </p>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 40, scale: 0.8, rotate: i % 2 ? 4 : -4 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 120, damping: 14, delay: i * 0.08 }}
              whileHover={{ y: -8, scale: 1.04 }}
              className="glass group relative overflow-hidden rounded-2xl p-4"
            >
              <BorderBeam size={90} duration={6 + i} delay={i * 1.5} from={statColors[i].from} to={statColors[i].to} />
              <div
                className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-40 blur-xl transition-transform duration-700 group-hover:scale-[2.5]"
                style={{ background: statColors[i].from }}
              />
              <div className={`relative bg-gradient-to-r bg-clip-text font-display text-3xl font-bold text-transparent ${statColors[i].text}`}>
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <p className="relative mt-1 text-xs leading-snug text-white/60">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
