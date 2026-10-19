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
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-[#160e38]"
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      initial={{ clipPath: "inset(0 0 0% 0)" }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="absolute inset-0 grid-bg opacity-60" />
      <motion.div
        className="absolute h-[60vmin] w-[60vmin] rounded-full bg-purple-600/30 blur-[100px]"
        animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative flex flex-col items-center gap-8">
        <motion.div
          className="glass-strong neo relative flex h-28 w-28 items-center justify-center rounded-3xl"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
        >
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
            <motion.rect
              x="3"
              y="3"
              width="94"
              height="94"
              rx="22"
              fill="none"
              stroke="url(#pl-grad)"
              strokeWidth="2.5"
              style={{ pathLength }}
            />
            <defs>
              <linearGradient id="pl-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7c5cff" />
                <stop offset="50%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#f472b6" />
              </linearGradient>
            </defs>
          </svg>
          <span className="font-display text-4xl font-bold text-gradient">SK</span>
        </motion.div>

        <div className="h-10 overflow-hidden text-center">
          <motion.p
            key={wordIndex}
            className="font-display text-3xl font-semibold tracking-tight text-white/90"
            initial={{ y: 40, opacity: 0, filter: "blur(8px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {words[wordIndex]}
            <span className="text-violet-400">.</span>
          </motion.p>
        </div>

        <div className="neo-inset h-2 w-64 overflow-hidden rounded-full">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 via-purple-400 to-fuchsia-400"
            style={{ width }}
          />
        </div>
      </div>

      <motion.span className="absolute bottom-8 right-10 font-display text-[18vw] font-bold leading-none text-stroke md:text-[12vw]">
        {rounded}
      </motion.span>
      <span className="absolute bottom-10 left-10 font-mono text-xs uppercase tracking-[0.3em] text-white/40">
        Kollimarla Sai Sanjay — Portfolio
      </span>
    </motion.div>
  );
}
