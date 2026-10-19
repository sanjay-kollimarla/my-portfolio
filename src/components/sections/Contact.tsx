"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { profile } from "@/data/portfolio";
import Magnetic from "@/components/ui/Magnetic";
import { ArrowIcon, CheckIcon, CopyIcon } from "@/components/ui/Icons";
import { scrollToId } from "@/components/fx/SmoothScroll";
import { RainbowLink, ShimmerButton } from "@/components/magic/Buttons";
import { burst } from "@/components/magic/confetti";
import FlickeringGrid from "@/components/magic/FlickeringGrid";
import ProfileOrbit from "@/components/magic/ProfileOrbit";
import ScrambleText from "@/components/magic/ScrambleText";
import Meteors from "@/components/magic/Meteors";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["-10%", "0%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["10%", "0%"]);

  const copy = async (e: React.MouseEvent) => {
    burst(e);
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const socials = [
    { label: "GitHub", href: profile.github, color: "#e5e7eb" },
    { label: "LinkedIn", href: profile.linkedin, color: "#38bdf8" },
    { label: "Email", href: `mailto:${profile.email}`, color: "#f472b6" },
    { label: "Call", href: `tel:${profile.phone.replace(/\s/g, "")}`, color: "#34d399" },
  ];

  return (
    <section id="contact" ref={ref} className="relative z-10 overflow-hidden px-6 pb-10 pt-32 md:px-[7vw]">
      <div className="absolute inset-x-0 top-0 -z-10 h-[70vh] opacity-50 [mask-image:linear-gradient(to_bottom,transparent,#000_30%,#000_60%,transparent)]">
        <FlickeringGrid />
      </div>
      <Meteors count={10} />

      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <ScrambleText text="06 // GET IN TOUCH" className="font-mono text-xs tracking-[0.3em] text-pink-300/80" />
          <h2 className="mt-4 font-display text-[12vw] font-bold leading-[0.92] tracking-tighter md:text-[6.5vw]">
            <motion.span style={{ x: x1 }} className="block">
              Let&apos;s build
            </motion.span>
            <motion.span style={{ x: x2 }} className="aurora-text block pb-[0.12em]">
              something great.
            </motion.span>
          </h2>

          <motion.p
            className="mt-6 max-w-lg text-lg text-white/65"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Have a backend that needs to scale, a SaaS to architect, or a role you think I&apos;d fit? My inbox is always open.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
          >
            <Magnetic>
              <ShimmerButton onClick={copy}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? "y" : "n"}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    {copied ? <CheckIcon className="h-4 w-4 text-emerald-400" /> : <CopyIcon />}
                    {copied ? "Copied! 🎉" : "Copy email"}
                  </motion.span>
                </AnimatePresence>
              </ShimmerButton>
            </Magnetic>
            <Magnetic>
              <RainbowLink
                href={`mailto:${profile.email}?subject=Let's%20work%20together`}
                data-cursor="Say hi"
                onClick={(e) => burst(e)}
                className="group"
              >
                Hire me
                <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </RainbowLink>
            </Magnetic>
          </motion.div>
        </div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.6, rotate: 20 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, damping: 14 }}
        >
          <ProfileOrbit size={170} />
        </motion.div>
      </div>

      <div className="mt-24 border-t border-white/10 pt-14">
        <motion.p
          className="font-display text-4xl font-bold uppercase tracking-tight md:text-6xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease }}
        >
          Kollimarla <span className="aurora-text">Sai Sanjay</span>
        </motion.p>

        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <p className="text-xs uppercase tracking-[0.25em] text-white/40">Email</p>
            <a href={`mailto:${profile.email}`} className="mt-2 block text-white/85 transition-colors hover:text-pink-300">
              {profile.email}
            </a>
            <p className="mt-6 text-xs uppercase tracking-[0.25em] text-white/40">Phone</p>
            <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="mt-2 block text-white/85 transition-colors hover:text-emerald-300">
              {profile.phone}
            </a>
            <p className="mt-6 text-xs uppercase tracking-[0.25em] text-white/40">Location</p>
            <p className="mt-2 text-white/85">📍 {profile.location}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <p className="text-xs uppercase tracking-[0.25em] text-white/40">Social</p>
            <ul className="mt-3 space-y-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="group relative inline-flex items-center gap-2 pb-1 font-display text-2xl text-white/85 transition-colors"
                    style={{ ["--c" as string]: s.color }}
                  >
                    <span className="transition-colors group-hover:text-[var(--c)]">{s.label}</span>
                    <ArrowIcon className="h-4 w-4 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
                    <span className="absolute bottom-0 left-0 h-px w-full bg-white/20" />
                    <span className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" style={{ background: s.color }} />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <p className="font-display text-2xl leading-snug">
              Designed and Developed
              <br />
              by <span className="aurora-text">{profile.firstName}</span>
            </p>
            <p className="mt-3 text-sm text-white/40">Next.js · Three.js · Framer Motion</p>
            <button onClick={() => scrollToId("home")} className="glass mt-8 rounded-full px-5 py-2.5 text-sm text-white/75 transition-all hover:-translate-y-1 hover:text-white">
              Back to top ↑
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
