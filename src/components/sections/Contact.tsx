"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { profile } from "@/data/portfolio";
import { scrollToId } from "@/components/fx/SmoothScroll";
import Magnetic from "@/components/ui/Magnetic";
import { LineReveal, Rise, SectionLabel, ease } from "@/components/ui/Editorial";

const socials = [
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "Email", href: `mailto:${profile.email}` },
];

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" className="relative z-10 overflow-hidden px-5 pb-8 pt-28 md:px-10 md:pt-40">
      {/* oversized watermark */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 select-none overflow-hidden text-center">
        <motion.p
          className="font-display text-[22vw] leading-[0.8] text-ink/[0.045]"
          initial={{ y: "30%", opacity: 0 }}
          whileInView={{ y: "0%", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease }}
        >
          Sanjay
        </motion.p>
      </div>

      <div className="relative mx-auto max-w-[1400px]">
        <SectionLabel n="06">Contact</SectionLabel>
        <h2 className="mt-6 font-display text-[clamp(3rem,8.5vw,8.5rem)] leading-[0.9] tracking-[-0.02em] text-ink">
          <LineReveal lines={["Let’s build", <em key="s" className="text-accent">something great.</em>]} />
        </h2>

        <Rise delay={0.3} className="mt-12">
          <p className="max-w-md text-[15px] leading-relaxed text-muted">
            Have a backend that needs to scale, a platform to architect, or a role you think I&apos;d fit? My inbox is always open.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href={`mailto:${profile.email}?subject=Let's%20work%20together`}
              data-cursor="Write"
              className="link-u group inline-flex items-center gap-3 pb-1 font-display text-[clamp(1.5rem,3.6vw,3.2rem)] text-ink"
            >
              {profile.email}
              <span className="text-accent transition-transform duration-500 group-hover:translate-x-1.5 group-hover:-translate-y-1.5">↗</span>
            </a>
            <Magnetic strength={0.25}>
              <button onClick={copy} className="glass flex items-center gap-2 overflow-hidden rounded-full px-5 py-2.5 text-[13px] font-medium text-ink">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={copied ? "y" : "n"} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.25 }}>
                    {copied ? "Copied ✓" : "Copy email"}
                  </motion.span>
                </AnimatePresence>
              </button>
            </Magnetic>
          </div>
        </Rise>

        <div className="relative mt-24 grid gap-10 border-t border-ink/80 pt-10 md:grid-cols-3">
          <Rise>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted">Details</p>
            <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="link-u mt-4 block w-fit text-[15px] text-ink">
              {profile.phone}
            </a>
            <p className="mt-2 text-[15px] text-ink">{profile.location}</p>
          </Rise>

          <Rise delay={0.1}>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted">Elsewhere</p>
            <ul className="mt-4 space-y-2.5">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="group inline-flex items-center gap-2 font-display text-[1.6rem] text-ink">
                    <span className="link-u pb-0.5">{s.label}</span>
                    <span className="text-accent opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </Rise>

          <Rise delay={0.2} className="md:text-right">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted">Colophon</p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink">
              Designed &amp; built by {profile.firstName}.
              <br />
              <span className="text-muted">Next.js · Three.js · Framer Motion</span>
            </p>
            <button onClick={() => scrollToId("home")} className="link-u mt-5 pb-0.5 text-[13px] font-medium text-ink">
              Back to top ↑
            </button>
          </Rise>
        </div>

        <p className="relative mt-16 font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted">© 2026 {profile.name}</p>
      </div>
    </section>
  );
}
