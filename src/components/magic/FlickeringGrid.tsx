"use client";

import { useEffect, useRef } from "react";

const COLORS = ["168,85,247", "34,211,238", "244,114,182", "250,204,21"];

/** Canvas grid of squares that softly flicker in a few accent colours. */
export default function FlickeringGrid({
  square = 4,
  gap = 7,
  chance = 0.25,
  maxOpacity = 0.35,
  className = "",
}: {
  square?: number;
  gap?: number;
  chance?: number;
  maxOpacity?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let cols = 0;
    let rows = 0;
    let cells = new Float32Array(0);
    let hues = new Uint8Array(0);
    let raf = 0;
    let visible = false;
    let last = 0;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      cols = Math.ceil(r.width / (square + gap));
      rows = Math.ceil(r.height / (square + gap));
      cells = new Float32Array(cols * rows).map(() => Math.random() * maxOpacity);
      hues = new Uint8Array(cols * rows).map(() => Math.floor(Math.random() * COLORS.length));
    };

    const draw = (now: number) => {
      if (now - last < 50) {
        if (visible) raf = requestAnimationFrame(draw);
        return;
      }
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < cells.length; i++) {
        if (Math.random() < chance * dt) {
          cells[i] = Math.random() * maxOpacity;
          hues[i] = Math.floor(Math.random() * COLORS.length);
        }
        const x = (i % cols) * (square + gap) * dpr;
        const y = Math.floor(i / cols) * (square + gap) * dpr;
        ctx.fillStyle = `rgba(${COLORS[hues[i]]},${cells[i]})`;
        ctx.fillRect(x, y, square * dpr, square * dpr);
      }
      if (visible) raf = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver(([e]) => {
      const was = visible;
      visible = e.isIntersecting;
      if (visible && !was) {
        last = performance.now();
        raf = requestAnimationFrame(draw);
      }
    });
    resize();
    io.observe(canvas);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [square, gap, chance, maxOpacity]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none h-full w-full ${className}`} />;
}
