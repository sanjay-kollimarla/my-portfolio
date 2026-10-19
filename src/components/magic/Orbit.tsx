import type { CSSProperties, ReactNode } from "react";

/** Items evenly spaced on a rotating ring; each item counter-rotates to stay upright. */
export function OrbitRing({
  radius,
  duration = 24,
  reverse = false,
  children,
  showPath = true,
}: {
  radius: number;
  duration?: number;
  reverse?: boolean;
  children: ReactNode[];
  showPath?: boolean;
}) {
  const n = children.length;
  return (
    <>
      {showPath && (
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10"
          style={{ width: `${(radius * 2).toFixed(2)}px`, height: `${(radius * 2).toFixed(2)}px` }}
        />
      )}
      <div
        className={`pointer-events-none absolute left-1/2 top-1/2 h-0 w-0 ${reverse ? "orbit-reverse" : "orbit"}`}
        style={{ "--orbit-duration": `${duration}s` } as CSSProperties}
      >
        {children.map((child, i) => {
          const a = (i / n) * Math.PI * 2;
          return (
            <div
              key={i}
              className="absolute"
              style={{ left: `${(Math.cos(a) * radius).toFixed(2)}px`, top: `${(Math.sin(a) * radius).toFixed(2)}px`, transform: "translate(-50%, -50%)" }}
            >
              <div
                className={`pointer-events-auto ${reverse ? "orbit" : "orbit-reverse"}`}
                style={{ "--orbit-duration": `${duration}s` } as CSSProperties}
              >
                {child}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export function Ripple({ base = 220, rings = 5, color = "rgba(192,132,252,0.35)" }: { base?: number; rings?: number; color?: string }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(circle,#000_40%,transparent_75%)]">
      {Array.from({ length: rings }, (_, i) => (
        <span
          key={i}
          className="ripple-ring border"
          style={{
            width: base + i * 70,
            height: base + i * 70,
            borderColor: color,
            background: `radial-gradient(circle, transparent 60%, ${color.replace(/[\d.]+\)$/, "0.06)")})`,
            animationDelay: `${i * 0.35}s`,
          }}
        />
      ))}
    </div>
  );
}
