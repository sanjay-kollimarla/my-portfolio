import type { CSSProperties } from "react";

export default function BorderBeam({
  size = 180,
  duration = 8,
  delay = 0,
  width = 1.5,
  from = "#a855f7",
  to = "#22d3ee",
}: {
  size?: number;
  duration?: number;
  delay?: number;
  width?: number;
  from?: string;
  to?: string;
}) {
  return (
    <div
      aria-hidden
      className="beam-wrap"
      style={
        {
          "--beam-width": `${width}px`,
          "--beam-size": `${size}px`,
          "--beam-duration": `${duration}s`,
          "--beam-delay": `${-delay}s`,
          "--beam-from": from,
          "--beam-to": to,
        } as CSSProperties
      }
    >
      <div className="beam" />
    </div>
  );
}
