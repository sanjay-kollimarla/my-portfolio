"use client";

import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";

/** Dark pill with a spark of light spinning around its border. */
export function ShimmerButton({
  children,
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      {...rest}
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full p-[1.5px] shadow-[0_0_40px_-10px_rgba(168,85,247,0.8)] transition-transform duration-300 active:scale-95 ${className}`}
    >
      <span className="shimmer-spin absolute inset-[-120%] bg-[conic-gradient(from_0deg,transparent_0_300deg,#f0abfc_330deg,#22d3ee_350deg,transparent_360deg)]" />
      <span className="relative inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-[#1b1030] via-[#120b20] to-[#0d0a16] px-7 py-3.5 font-semibold text-white transition-colors group-hover:from-[#2a1550]">
        <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_-8px_14px_rgba(192,132,252,0.25)]" />
        {children}
      </span>
    </button>
  );
}

/** Animated rainbow border with a glow underneath. */
export function RainbowLink({
  children,
  className = "",
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode }) {
  return (
    <a
      {...rest}
      className={`rainbow-btn inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-semibold text-white transition-transform duration-300 hover:scale-[1.03] active:scale-95 ${className}`}
    >
      {children}
    </a>
  );
}
