"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { navLinks, profile } from "@/data/portfolio";
import { scrollToId } from "@/components/fx/SmoothScroll";
import { useLoaded } from "@/components/fx/LoadState";
import { GithubIcon, LinkedinIcon, MailIcon, PhoneIcon } from "@/components/ui/Icons";
import ScrambleText from "@/components/magic/ScrambleText";

const ease = [0.22, 1, 0.36, 1] as const;

function DockItem({
  mouseY,
  href,
  label,
  color,
  children,
}: {
  mouseY: MotionValue<number>;
  href: string;
  label: string;
  color: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const distance = useTransform(mouseY, (y) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return 999;
    return y - (r.top + r.height / 2);
  });
  const sizeRaw = useTransform(distance, [-120, 0, 120], [42, 64, 42]);
  const size = useSpring(sizeRaw, { stiffness: 260, damping: 18, mass: 0.2 });
  const [hover, setHover] = useState(false);

  return (
    <motion.a
      ref={ref}
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      aria-label={label}
      style={{ width: size, height: size }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="glass relative flex items-center justify-center rounded-2xl text-white/85 [&_svg]:h-[45%] [&_svg]:w-[45%]"
    >
      <span
        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300"
        style={{ background: `radial-gradient(circle at 50% 120%, ${color}88, transparent 70%)`, opacity: hover ? 1 : 0 }}
      />
      <span className="relative flex h-full w-full items-center justify-center" style={{ color: hover ? color : undefined }}>
        {children}
      </span>
      <AnimatePresence>
        {hover && (
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            className="glass absolute left-full ml-3 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
  );
}

export default function Header({ hasResume }: { hasResume: boolean }) {
  const loaded = useLoaded();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [railHidden, setRailHidden] = useState(false);
  const { scrollY } = useScroll();
  const mouseY = useMotionValue(Infinity);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 40));

  // the rail would sit on top of the horizontally scrolling work panels
  useEffect(() => {
    const work = document.getElementById("work");
    if (!work) return;
    const io = new IntersectionObserver(([e]) => setRailHidden(e.isIntersecting), { rootMargin: "-20% 0px -20% 0px" });
    io.observe(work);
    return () => io.disconnect();
  }, []);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  const socials = [
    { href: profile.github, icon: <GithubIcon />, label: "GitHub", color: "#e5e7eb" },
    { href: profile.linkedin, icon: <LinkedinIcon />, label: "LinkedIn", color: "#38bdf8" },
    { href: `mailto:${profile.email}`, icon: <MailIcon />, label: "Email", color: "#f472b6" },
    { href: `tel:${profile.phone.replace(/\s/g, "")}`, icon: <PhoneIcon />, label: "Call", color: "#34d399" },
  ];

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-[80] px-3 md:px-6"
        initial={{ y: -100, opacity: 0 }}
        animate={loaded ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 1, ease, delay: 0.6 }}
      >
        <div
          className={`relative mx-auto mt-3 flex w-full max-w-[1500px] items-center justify-between rounded-2xl px-5 py-3 transition-all duration-500 md:px-8 ${
            scrolled ? "glass" : "border border-transparent"
          }`}
        >
          <button onClick={() => go("home")} aria-label="Back to top" className="group relative flex items-center gap-2">
            <motion.span
              className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl"
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
            >
              <span className="orbit absolute inset-[-40%] bg-[conic-gradient(#a855f7,#22d3ee,#f472b6,#facc15,#a855f7)] [--orbit-duration:4s]" />
              <span className="absolute inset-[2px] rounded-[10px] bg-[#1e1548]" />
              <span className="relative font-display text-sm font-bold aurora-text">SK</span>
            </motion.span>
          </button>

          <a href={`mailto:${profile.email}`} className="hidden text-[15px] font-medium tracking-wide md:block" data-cursor="Mail">
            <span className="shiny-text">{profile.email}</span>
          </a>

          <nav className="hidden items-center gap-10 md:flex">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="group relative font-mono text-sm font-semibold uppercase tracking-[0.18em] text-white/85 hover:text-white"
              >
                <ScrambleText text={l.label} duration={500} />
                <span className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 transition-transform duration-500 group-hover:scale-x-100" />
              </button>
            ))}
          </nav>

          <button
            onClick={() => setOpen((o) => !o)}
            className="neo-btn relative flex h-11 w-11 items-center justify-center rounded-full md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <motion.span className="absolute h-[2px] w-4 rounded bg-white" animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }} />
            <motion.span className="absolute h-[2px] w-4 rounded bg-white" animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }} />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* dimmed backdrop, tap to close */}
            <button aria-label="Close menu" onClick={() => setOpen(false)} className="absolute inset-0 bg-[#140c34]/70 backdrop-blur-md" />
            <motion.nav
              className="glass-strong absolute inset-x-3 top-20 overflow-hidden rounded-3xl p-3"
              initial={{ y: -24, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -16, opacity: 0, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-600/30 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl" />
              <p className="relative px-3 pb-2 pt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Navigate</p>
              <ul className="relative space-y-1">
                {[{ id: "home", label: "Home" }, ...navLinks].map((l, i) => (
                  <motion.li
                    key={l.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + i * 0.05 }}
                  >
                    <button
                      onClick={() => go(l.id)}
                      className="group flex w-full items-center gap-4 rounded-2xl px-3 py-3.5 text-left transition-colors active:bg-white/10"
                    >
                      <span className="font-mono text-xs text-violet-300/70">0{i + 1}</span>
                      <span className="font-display text-2xl font-semibold text-white/90">{l.label}</span>
                      <span className="ml-auto flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-white/50 transition-transform group-active:translate-x-1">
                        →
                      </span>
                    </button>
                  </motion.li>
                ))}
              </ul>
              <div className="relative mt-3 border-t border-white/10 px-3 pb-2 pt-4">
                <a href={`mailto:${profile.email}`} className="block truncate text-sm text-white/70">
                  {profile.email}
                </a>
                <div className="mt-3 flex gap-2.5">
                  {socials.map((s, i) => (
                    <motion.a
                      key={s.label}
                      href={s.href}
                      target={s.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      aria-label={s.label}
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 [&_svg]:h-5 [&_svg]:w-5"
                      style={{ color: s.color }}
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 + i * 0.05, type: "spring", stiffness: 300, damping: 18 }}
                    >
                      {s.icon}
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dock-style social rail (desktop): icons magnify as the cursor passes */}
      <motion.div
        className="fixed bottom-10 left-5 z-[60] hidden flex-col items-start gap-3 lg:flex xl:left-8"
        onMouseMove={(e) => mouseY.set(e.clientY)}
        onMouseLeave={() => mouseY.set(Infinity)}
        initial={{ opacity: 0, x: -30 }}
        animate={loaded ? (railHidden ? { opacity: 0, x: -40 } : { opacity: 1, x: 0 }) : {}}
        transition={{ duration: 0.6, ease, delay: loaded && !railHidden && !scrolled ? 1.2 : 0 }}
      >
        {socials.map((s) => (
          <DockItem key={s.label} mouseY={mouseY} href={s.href} label={s.label} color={s.color}>
            {s.icon}
          </DockItem>
        ))}
        <span className="ml-5 mt-1 h-16 w-px bg-gradient-to-b from-violet-400/60 to-transparent" />
      </motion.div>

      {hasResume && (
        <motion.a
          href="/resume.pdf"
          target="_blank"
          rel="noreferrer"
          data-cursor="Open"
          className="group fixed bottom-8 right-6 z-[60] hidden items-center gap-3 font-display text-lg font-semibold tracking-[0.35em] lg:flex xl:right-10"
          initial={{ opacity: 0, x: 30 }}
          animate={loaded ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease, delay: 1.3 }}
        >
          <span className="aurora-text">RESUME</span>
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-violet-300 transition-transform group-hover:-translate-y-1" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M7 3h7l4 4v14H7z" strokeLinejoin="round" />
            <path d="M10 12h5M10 16h5" strokeLinecap="round" />
          </svg>
        </motion.a>
      )}
    </>
  );
}
