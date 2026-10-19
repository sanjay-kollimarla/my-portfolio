"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/portfolio";
import { useLoaded } from "@/components/fx/LoadState";
import { scrollToId } from "@/components/fx/SmoothScroll";
import Meteors from "@/components/magic/Meteors";
import { RainbowLink, ShimmerButton } from "@/components/magic/Buttons";
import { ArrowIcon } from "@/components/ui/Icons";
import Magnetic from "@/components/ui/Magnetic";

const ease = [0.22, 1, 0.36, 1] as const;
const roleSize = "font-display text-[clamp(1.5rem,3.5vw,3.8rem)] font-bold uppercase leading-none tracking-tight";
const roleColors = ["from-violet-300 via-fuchsia-300 to-pink-300", "from-cyan-300 via-sky-300 to-violet-300", "from-amber-200 via-orange-300 to-pink-300"];
const letterColors = ["#c084fc", "#f472b6", "#22d3ee", "#facc15", "#34d399", "#fb923c"];

function RoleSwapper({ enabled }: { enabled: boolean }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => setI((v) => (v + 1) % profile.roles.length), 3000);
    return () => clearInterval(id);
  }, [enabled]);

  const role = profile.roles[i];
  const next = profile.roles[(i + 1) % profile.roles.length];

  return (
    <div className="relative">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={next}
          className={`pointer-events-none absolute -top-[0.62em] left-0 select-none whitespace-nowrap text-violet-500/30 [mask-image:linear-gradient(to_bottom,transparent_5%,#000_60%)] ${roleSize}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease }}
        >
          {next}
        </motion.div>
      </AnimatePresence>
      <div className={`relative h-[1.08em] min-w-[10ch] whitespace-nowrap [clip-path:inset(0_-50%_0_-5%)] ${roleSize}`}>
        <AnimatePresence initial={false}>
          <motion.span key={role} className="absolute left-0 top-0 flex">
            {role.split("").map((c, ci) => (
              <motion.span
                key={ci}
                className={`inline-block bg-gradient-to-b bg-clip-text text-transparent ${roleColors[i % roleColors.length]}`}
                initial={{ y: "110%", rotateX: -90 }}
                animate={{ y: "0%", rotateX: 0 }}
                exit={{ y: "-110%", rotateX: 90 }}
                transition={{ duration: 0.7, ease, delay: ci * 0.022 }}
              >
                {c === " " ? " " : c}
              </motion.span>
            ))}
          </motion.span>
        </AnimatePresence>
        <span className="invisible">{role}</span>
      </div>
    </div>
  );
}

function BouncyWord({ word, delay, gradient }: { word: string; delay: number; gradient?: boolean }) {
  const loaded = useLoaded();
  return (
    <span className="block overflow-hidden pb-1">
      {word.split("").map((c, i) => (
        <motion.span
          key={i}
          className={`inline-block ${gradient ? "aurora-text" : ""}`}
          initial={{ y: "110%", rotate: 12 }}
          animate={loaded ? { y: "0%", rotate: 0 } : {}}
          transition={{ duration: 0.9, ease, delay: delay + i * 0.035 }}
          whileHover={{
            y: -10,
            scale: 1.15,
            color: letterColors[i % letterColors.length],
            transition: { type: "spring", stiffness: 400, damping: 10 },
          }}
        >
          {c === " " ? " " : c}
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero() {
  const loaded = useLoaded();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const leftX = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const rightX = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const fade = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section id="home" ref={ref} className="relative z-10 h-[100svh] min-h-[640px] overflow-hidden">
      <Meteors count={16} />

      {/* name, left */}
      <motion.div style={{ x: leftX, opacity: fade }} className="absolute left-6 top-[13%] z-10 md:left-[7vw] lg:top-[33%]">
        <motion.div
          className="relative mb-5 inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs backdrop-blur-md"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={loaded ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, ease, delay: 0.4 }}
        >
          <span className="absolute inset-0 rounded-full bg-[linear-gradient(90deg,#a855f733,#22d3ee33,#f472b633,#a855f733)] bg-[length:300%_100%] [animation:aurora-x_6s_linear_infinite_alternate]" />
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="relative shiny-text font-medium">✨ Open to opportunities · {profile.location}</span>
        </motion.div>

        <motion.p
          className="font-display text-xl tracking-[0.12em] text-violet-300 md:text-3xl"
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={loaded ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.9, ease, delay: 0.5 }}
        >
          Hello! I&apos;m{" "}
          <motion.span
            className="inline-block origin-[70%_70%]"
            animate={loaded ? { rotate: [0, 18, -8, 18, -4, 12, 0] } : {}}
            transition={{ duration: 1.8, delay: 1.4, repeat: Infinity, repeatDelay: 4 }}
          >
            👋
          </motion.span>
        </motion.p>
        <h1 className="mt-1 font-display text-[clamp(2.3rem,4vw,3.9rem)] font-bold uppercase leading-[0.98] tracking-tight">
          <BouncyWord word="Sai Sanjay" delay={0.65} />
          <BouncyWord word="Kollimarla" delay={0.8} gradient />
        </h1>

        <motion.div
          className="mt-8 hidden flex-wrap items-center gap-4 lg:flex"
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease, delay: 1.5 }}
        >
          <Magnetic>
            <ShimmerButton onClick={() => scrollToId("work")} data-cursor="View">
              View my work <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </ShimmerButton>
          </Magnetic>
          <Magnetic>
            <RainbowLink href={`mailto:${profile.email}?subject=Let's%20work%20together`} data-cursor="Hi!">
              Hire me
            </RainbowLink>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* role, right */}
      <motion.div
        style={{ x: rightX, opacity: fade }}
        className="absolute bottom-[12%] left-6 z-10 md:left-auto md:right-[5vw] lg:bottom-auto lg:top-[56%]"
      >
        <motion.p
          className="font-display text-2xl text-violet-300 md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={loaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease, delay: 0.9 }}
        >
          A
        </motion.p>
        <motion.div
          className="mt-[1.3em] pr-[0.3em]"
          initial={{ opacity: 0, x: 60 }}
          animate={loaded ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1.1, ease, delay: 1 }}
        >
          <RoleSwapper enabled={loaded} />
        </motion.div>
      </motion.div>

      <motion.div style={{ opacity: fade }} className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 md:block">
        <motion.button
          onClick={() => scrollToId("about")}
          aria-label="Scroll down"
          className="flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/50"
          initial={{ opacity: 0 }}
          animate={loaded ? { opacity: 1 } : {}}
          transition={{ delay: 2 }}
        >
          <span className="relative flex h-12 w-7 justify-center overflow-hidden rounded-full p-[1.5px]">
            <span className="shimmer-spin absolute inset-[-60%] bg-[conic-gradient(from_0deg,transparent_0_250deg,#a855f7,#22d3ee,transparent)]" />
            <span className="relative flex h-full w-full justify-center rounded-full bg-[#0d0a14] pt-2">
              <motion.span
                className="h-2 w-1 rounded-full bg-gradient-to-b from-violet-300 to-cyan-300"
                animate={{ y: [0, 18, 0], opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </span>
          Scroll
        </motion.button>
      </motion.div>
    </section>
  );
}
