"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

/** Twinkling, slowly drifting multi-coloured stars. */
function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const hues = [270, 190, 320, 45, 150];
    let stars: { x: number; y: number; r: number; h: number; tw: number; vy: number }[] = [];
    let raf = 0;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      const n = Math.min(90, Math.floor((window.innerWidth * window.innerHeight) / 16000));
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: (Math.random() * 1.2 + 0.3) * dpr,
        h: hues[Math.floor(Math.random() * hues.length)],
        tw: Math.random() * Math.PI * 2,
        vy: (Math.random() * 0.08 + 0.02) * dpr,
      }));
    };

    let last = 0;
    const draw = (t: number) => {
      // ~30fps is plenty for twinkling stars
      if (t - last < 33) {
        raf = requestAnimationFrame(draw);
        return;
      }
      last = t;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        s.y -= s.vy;
        if (s.y < -5) s.y = canvas.height + 5;
        const a = 0.35 + 0.65 * Math.abs(Math.sin(t / 1400 + s.tw));
        ctx.beginPath();
        ctx.fillStyle = `hsla(${s.h}, 95%, 78%, ${a})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}

export default function Background() {
  const { scrollYProgress } = useScroll();
  const orbY = useTransform(scrollYProgress, [0, 1], ["0vh", "-60vh"]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[linear-gradient(160deg,#1f1150_0%,#160e38_45%,#10183f_100%)]">
      {/* aurora blobs */}
      <div className="absolute inset-0">
        <div className="blob blob-1 left-[-12%] top-[-15%] h-[42vw] w-[42vw] bg-[#7c3aed] opacity-60!" />
        <div className="blob blob-2 right-[-14%] top-[5%] h-[38vw] w-[38vw] bg-[#d946ef] opacity-50!" />
        <div className="blob blob-3 bottom-[-20%] left-[20%] h-[40vw] w-[40vw] bg-[#0891b2] opacity-50!" />
      </div>

      {/* lilac orb, top-left */}
      <motion.div className="absolute left-[12%] top-[-3%]" style={{ y: orbY }}>
        <motion.div
          className="h-16 w-16 rounded-full bg-gradient-to-br from-[#f5d0fe] to-[#c4b5fd] shadow-[0_0_80px_30px_rgba(192,132,252,0.45)]"
          animate={{ x: [0, 40, -10, 0], y: [0, 25, 50, 0], scale: [1, 1.15, 0.95, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <Starfield />
      <div className="grid-bg absolute inset-0 opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(22,14,56,0.45)_100%)]" />
      <div className="noise absolute inset-0 mix-blend-normal!" />
    </div>
  );
}
