"use client";

import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { iconFor } from "@/lib/techIcons";

export const ease = [0.22, 1, 0.36, 1] as const;

/** Small mono section label: "01 — About" with a line that draws in. */
export function SectionLabel({ n, children, className = "" }: { n: string; children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={`flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-muted ${className}`}
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease }}
    >
      <span className="text-accent">{n}</span>
      <motion.span
        className="h-px w-10 origin-left bg-ink/40"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.15, ease }}
      />
      {children}
    </motion.div>
  );
}

/** Headline whose lines slide up out of a mask. Pass lines as an array; wrap emphasis in <em>. */
export function LineReveal({
  lines,
  className = "",
  delay = 0,
  immediate = false,
}: {
  lines: ReactNode[];
  className?: string;
  delay?: number;
  /** animate on mount instead of on scroll (hero) */
  immediate?: boolean;
}) {
  return (
    <span className={`block ${className}`}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
          <motion.span
            className="block"
            initial={{ y: "108%", rotate: 2 }}
            {...(immediate
              ? { animate: { y: "0%", rotate: 0 } }
              : { whileInView: { y: "0%", rotate: 0 }, viewport: { once: true, margin: "-80px" } })}
            transition={{ duration: 1.05, delay: delay + i * 0.1, ease }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Fade + rise on scroll. */
export function Rise({
  children,
  delay = 0,
  className = "",
  y = 28,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/** Monochrome tech logo that picks up its brand colour on hover of the nearest `group/logo`. */
export function BrandLogo({ name, className = "h-4 w-4" }: { name: string; className?: string }) {
  const icon = iconFor(name);
  if (!icon) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={`${className} shrink-0 text-ink/55 transition-colors duration-300 group-hover/logo:text-[var(--b)]`}
      style={{ "--b": icon.color === "#f5f5f5" || icon.color === "#e5e7eb" || icon.color === "#f5f5f5" ? "#eceae4" : icon.color } as CSSProperties}
      fill="currentColor"
    >
      <path d={icon.path} />
    </svg>
  );
}
