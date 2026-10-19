"use client";

import Lenis from "lenis";
import { useEffect } from "react";

let lenisInstance: Lenis | null = null;

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisInstance) {
    lenisInstance.scrollTo(el, { offset: id === "home" ? 0 : -40, duration: 1.6 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

/** Smoothly scroll the page to an absolute Y position (through Lenis when active). */
export function scrollToY(target: number) {
  if (lenisInstance) lenisInstance.scrollTo(target, { duration: 0.5 });
  else window.scrollTo({ top: target });
}

export function currentScroll() {
  return lenisInstance ? lenisInstance.targetScroll : window.scrollY;
}

export function setScrollLocked(locked: boolean) {
  if (!lenisInstance) return;
  if (locked) lenisInstance.stop();
  else lenisInstance.start();
}

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisInstance = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return null;
}
