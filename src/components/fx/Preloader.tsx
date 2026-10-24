"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { setScrollLocked } from "./SmoothScroll";

const words = ["Design", "Architect", "Scale", "Ship"];

export default function Preloader({ onDone }: { onDone: () => void }) {
  const progress = useMotionValue(0);
  const rounded = useTransform(progress, (v) => Math.round(v).toString().padStart(3, "0"));
  const width = useTransform(progress, (v) => `${v}%`);
  const pathLength = useTransform(progress, [0, 100], [0, 1]);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    setScrollLocked(true);
    window.scrollTo(0, 0);
    const controls = animate(progress, 100, {
      duration: 2.4,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setWordIndex(Math.min(words.length - 1, Math.floor((v / 100) * words.length))),
      onComplete: () => setTimeout(onDone, 250),
    });
    return () => {
      controls.stop();
      document.documentElement.style.overflow = "";
      setScrollLocked(false);
    };
  }, [onDone, progress]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-paper"
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      initial={{ clipPath: "inset(0 0 0% 0)" }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
    >
      <div
        className="absolute inset-0 opacity-60"
        style={{ backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "calc(100% / 12) 100%" }}
      />

      <div className="relative flex flex-col items-center gap-8">
        {/* CSS-only ring and text: visible and moving even before JavaScript has loaded */}
        <div className="pl-pop relative h-36 w-36 overflow-hidden rounded-[1.75rem] p-[2px]">
          <span className="shimmer-spin absolute inset-[-60%] bg-[conic-gradient(from_0deg,transparent_0_230deg,#7b9bff_330deg,transparent_360deg)]" />
          <div className="relative flex h-full w-full flex-col items-center justify-center gap-1 rounded-[1.6rem] bg-paper">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
              <motion.rect x="3" y="3" width="94" height="94" rx="22" fill="none" stroke="#eceae4" strokeOpacity="0.55" strokeWidth="1.2" style={{ pathLength }} />
            </svg>
            <span className="font-display text-5xl leading-none text-ink">SK</span>
            <span className="pl-loading font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-muted">
              Loading<span className="pl-dots" />
            </span>
          </div>
        </div>

        <div className="h-9 overflow-hidden text-center">
          <motion.p
            key={wordIndex}
            className="font-display text-3xl italic text-ink"
            initial={{ y: 36, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {words[wordIndex]}
            <span className="text-accent">.</span>
          </motion.p>
        </div>

        <div className="h-px w-64 overflow-hidden bg-rule">
          <motion.div className="h-full bg-ink" style={{ width }} />
        </div>
      </div>

      <motion.span className="absolute bottom-6 right-8 font-display text-[16vw] leading-none text-ink/[0.07] md:text-[10vw]">{rounded}</motion.span>
      <span className="absolute bottom-8 left-8 font-mono text-[11px] uppercase tracking-[0.3em] text-muted">Kollimarla Sai Sanjay — Portfolio</span>
    </motion.div>
  );
}
