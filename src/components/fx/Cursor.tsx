"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState, useSyncExternalStore } from "react";

const finePointer = "(pointer: fine)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(finePointer);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/** Small ink dot + trailing ring; the ring grows over links and shows a label for data-cursor targets. */
export default function Cursor() {
  const enabled = useSyncExternalStore(subscribe, () => window.matchMedia(finePointer).matches, () => false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 200, damping: 22, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 200, damping: 22, mass: 0.5 });
  const gx = useSpring(x, { stiffness: 45, damping: 22, mass: 1 });
  const gy = useSpring(y, { stiffness: 45, damping: 22, mass: 1 });

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("custom-cursor");
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("a, button, [data-cursor]");
      setHovering(!!t);
      setLabel(t?.dataset.cursor && t.dataset.cursor !== "hover" ? t.dataset.cursor : null);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("pointermove", move);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;
  const size = label ? 78 : hovering ? 46 : 30;

  return (
    <>
      {/* soft spotlight that lags behind the cursor */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[5] h-[560px] w-[560px] rounded-full"
        style={{ x: gx, y: gy, translateX: "-50%", translateY: "-50%", background: "radial-gradient(circle, rgba(123,155,255,0.13), rgba(123,155,255,0.04) 45%, transparent 70%)" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] flex items-center justify-center rounded-full border"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: size,
          height: size,
          backgroundColor: label ? "rgba(236,234,228,1)" : hovering ? "rgba(123,155,255,0.12)" : "rgba(236,234,228,0)",
          borderColor: hovering ? "rgba(123,155,255,0.8)" : "rgba(236,234,228,0.45)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        {label && <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-[#0a0c12]">{label}</span>}
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[101] h-1.5 w-1.5 rounded-full bg-ink"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: hovering ? 0 : 1 }}
      />
    </>
  );
}
