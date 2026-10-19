"use client";

import { useInView } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>/";

/**
 * Letters scramble and resolve left-to-right when the text scrolls into view,
 * and again on hover.
 */
export default function ScrambleText({
  text,
  className = "",
  duration = 900,
  hover = true,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  duration?: number;
  hover?: boolean;
  as?: "span" | "p" | "h2" | "h3";
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(text);
  const raf = useRef(0);

  const run = useCallback(() => {
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const revealed = Math.floor(p * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === " " || i < revealed) out += ch;
        else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setDisplay(out);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [text, duration]);

  useEffect(() => {
    if (!inView) return;
    const id = requestAnimationFrame(run);
    return () => cancelAnimationFrame(id);
  }, [inView, run]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return (
    <Tag
      ref={ref as never}
      className={className}
      onMouseEnter={hover ? run : undefined}
      aria-label={text}
    >
      <span aria-hidden>{display}</span>
    </Tag>
  );
}
