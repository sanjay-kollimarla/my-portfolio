"use client";

import confetti from "canvas-confetti";

const colors = ["#a855f7", "#22d3ee", "#f472b6", "#facc15", "#34d399"];

export function burst(e?: { clientX: number; clientY: number }) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const origin = e
    ? { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight }
    : { x: 0.5, y: 0.6 };
  confetti({ particleCount: 90, spread: 75, startVelocity: 38, origin, colors, zIndex: 300, scalar: 0.9 });
  confetti({ particleCount: 40, spread: 120, startVelocity: 25, origin, colors, zIndex: 300, shapes: ["star"], scalar: 1.1 });
}
