"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { profile } from "@/data/portfolio";
import { scrollToId } from "@/components/fx/SmoothScroll";
import { useLoaded } from "@/components/fx/LoadState";
import Magnetic from "@/components/ui/Magnetic";

const ease = [0.22, 1, 0.36, 1] as const;

const links = [
  { id: "about", label: "About" },
  { id: "career", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "stack", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export default function Header({ hasResume }: { hasResume: boolean }) {
  const loaded = useLoaded();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  // current section = the one holding the middle of the screen
  const pick = useCallback(() => {
    const mid = window.innerHeight * 0.45;
    let found = "";
    for (const l of links) {
      const r = document.getElementById(l.id)?.getBoundingClientRect();
      if (r && r.top <= mid && r.bottom >= mid) found = l.id;
    }
    setActive(found);
  }, []);
  useMotionValueEvent(scrollY, "change", pick);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-[80]"
        initial={{ y: -80, opacity: 0 }}
        animate={loaded ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.9, ease, delay: 0.5 }}
      >
        <div
          className={`mx-auto flex max-w-[1400px] items-center justify-between px-5 py-3.5 transition-all duration-500 md:px-10 ${
            scrolled ? "glass-strong !rounded-none !border-x-0 !border-t-0 !shadow-[0_1px_0_rgba(255,255,255,0.08)]" : "border-b border-transparent"
          }`}
          style={scrolled ? { maxWidth: "100%" } : undefined}
        >
          <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between">
            <button onClick={() => go("home")} aria-label="Back to top" className="group flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center border border-ink/80 bg-ink font-display text-lg leading-none text-paper transition-transform duration-500 group-hover:rotate-[8deg]">
                SK
              </span>
              <span className="hidden text-sm font-medium tracking-tight text-ink sm:block">Sai Sanjay Kollimarla</span>
            </button>

            <nav className="hidden items-center gap-8 md:flex">
              {links.map((l, i) => (
                <button
                  key={l.id}
                  onClick={() => go(l.id)}
                  className="group relative py-1 text-[13px] text-muted transition-colors hover:text-ink data-[on=true]:text-ink"
                  data-on={active === l.id}
                >
                  <span className="mr-1.5 font-mono text-[10px] text-accent/80">0{i + 1}</span>
                  {l.label}
                  {active === l.id && <motion.span layoutId="nav-line" className="absolute inset-x-0 -bottom-0.5 h-px bg-ink" transition={{ type: "spring", stiffness: 380, damping: 34 }} />}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {hasResume && (
                <a href="/resume.pdf" target="_blank" rel="noreferrer" className="link-u hidden text-[13px] text-ink lg:block">
                  Résumé ↗
                </a>
              )}
              <Magnetic strength={0.25}>
                <a
                  href={`mailto:${profile.email}`}
                  data-cursor="Mail"
                  className="hidden rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-paper transition-colors duration-300 hover:bg-accent md:block"
                >
                  Let&apos;s talk
                </a>
              </Magnetic>
              <button
                onClick={() => setOpen((o) => !o)}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-white/[0.08] md:hidden"
                aria-label="Toggle menu"
                aria-expanded={open}
              >
                <motion.span className="absolute h-px w-4 bg-ink" animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -3 }} />
                <motion.span className="absolute h-px w-4 bg-ink" animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 3 }} />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[70] md:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <button aria-label="Close menu" onClick={() => setOpen(false)} className="absolute inset-0 bg-paper/80 backdrop-blur-md" />
            <motion.nav
              className="glass-strong absolute inset-x-3 top-[72px] rounded-2xl p-3"
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
            >
              <ul>
                {links.map((l, i) => (
                  <motion.li key={l.id} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.05 }} className="border-b border-rule last:border-0">
                    <button onClick={() => go(l.id)} className="flex w-full items-center gap-4 px-3 py-4 text-left">
                      <span className="font-mono text-[11px] text-accent">0{i + 1}</span>
                      <span className="font-display text-3xl text-ink">{l.label}</span>
                      <span className="ml-auto text-muted">↗</span>
                    </button>
                  </motion.li>
                ))}
              </ul>
              <a href={`mailto:${profile.email}`} className="mt-3 block rounded-xl bg-ink px-4 py-3.5 text-center text-sm font-medium text-paper">
                {profile.email}
              </a>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
