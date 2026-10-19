"use client";

import { useEffect, useState, type CSSProperties } from "react";

type M = { left: string; top: string; delay: string; duration: string };

export default function Meteors({ count = 14 }: { count?: number }) {
  const [meteors, setMeteors] = useState<M[]>([]);

  // random placement is generated client-side only to keep SSR markup stable
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      setMeteors(
        Array.from({ length: count }, () => ({
          left: `${Math.random() * 110 - 5}%`,
          top: `${Math.random() * 40 - 10}%`,
          delay: `${Math.random() * 8}s`,
          duration: `${3 + Math.random() * 6}s`,
        }))
      )
    );
    return () => cancelAnimationFrame(id);
  }, [count]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {meteors.map((m, i) => (
        <span
          key={i}
          className="meteor"
          style={{ left: m.left, top: m.top, animationDelay: m.delay, animationDuration: m.duration } as CSSProperties}
        />
      ))}
    </div>
  );
}
