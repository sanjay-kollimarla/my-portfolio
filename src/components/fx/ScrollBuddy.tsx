"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLoaded } from "./LoadState";
import { burst } from "@/components/magic/confetti";

const LINES: Record<string, string> = {
  home: "Hey! 👋 I'm Byte, Sanjay's sidekick",
  about: "Meet the human behind the code ☕",
  whatido: "Backend wizardry happens here ✨",
  career: "Look at this journey! 🚀",
  work: "Keep scrolling, it slides sideways 😄",
  stack: "Hover a chip, it lights up! ⚡",
  education: "Always learning 📚",
  contact: "Say hi, he replies fast 💌",
};
const CHEERS = ["Wheee! 🎉", "You found me! 😄", "Hire him, he's great 🙌", "Beep boop 🤖💜", "Thanks for visiting! ✨"];

/** Little robot "Byte": jetpack, visor eyes, antenna. Drawn in SVG so it stays crisp. */
function Robot({ blink, eyeX, eyeY, wave, thrust }: { blink: boolean; eyeX: MotionValue<number>; eyeY: MotionValue<number>; wave: boolean; thrust: MotionValue<number> }) {
  return (
    <svg viewBox="0 0 120 150" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id="bb-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f5f3ff" />
          <stop offset="1" stopColor="#c4b5fd" />
        </linearGradient>
        <linearGradient id="bb-visor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1e1b4b" />
          <stop offset="1" stopColor="#0b0a1a" />
        </linearGradient>
        <radialGradient id="bb-flame" cx="0.5" cy="0" r="1">
          <stop offset="0" stopColor="#fff7ed" />
          <stop offset="0.35" stopColor="#facc15" />
          <stop offset="0.7" stopColor="#f97316" />
          <stop offset="1" stopColor="#f43f5e" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* jetpack flames */}
      {[38, 82].map((x) => (
        <motion.g key={x} style={{ scaleY: thrust, transformOrigin: `${x}px 114px` }}>
          <ellipse className="bb-flame" cx={x} cy={128} rx={7} ry={16} fill="url(#bb-flame)" style={{ transformOrigin: `${x}px 114px` }} />
        </motion.g>
      ))}
      {/* jetpack */}
      <rect x="28" y="78" width="20" height="40" rx="8" fill="#7c3aed" />
      <rect x="72" y="78" width="20" height="40" rx="8" fill="#7c3aed" />
      <rect x="31" y="112" width="14" height="6" rx="2" fill="#4c1d95" />
      <rect x="75" y="112" width="14" height="6" rx="2" fill="#4c1d95" />

      {/* body */}
      <rect x="38" y="74" width="44" height="44" rx="16" fill="url(#bb-body)" />
      <circle cx="60" cy="96" r="7" fill="#a855f7">
        <animate attributeName="opacity" values="1;0.4;1" dur="1.6s" repeatCount="indefinite" />
      </circle>

      {/* arms */}
      <rect x="22" y="82" width="18" height="9" rx="4.5" fill="url(#bb-body)" transform="rotate(25 40 86)" />
      <motion.g
        style={{ transformOrigin: "80px 86px" }}
        animate={wave ? { rotate: [-150, -110, -150, -110, -150] } : { rotate: -25 }}
        transition={wave ? { duration: 1.2, ease: "easeInOut" } : { duration: 0.4 }}
      >
        <rect x="80" y="82" width="20" height="9" rx="4.5" fill="url(#bb-body)" />
        <circle cx="101" cy="86.5" r="5.5" fill="#ede9fe" />
      </motion.g>

      {/* head */}
      <rect x="22" y="22" width="76" height="58" rx="26" fill="url(#bb-body)" />
      <rect x="31" y="32" width="58" height="38" rx="18" fill="url(#bb-visor)" />
      {/* eyes */}
      <motion.g style={{ x: eyeX, y: eyeY }}>
        {[48, 72].map((x) => (
          <motion.rect
            key={x}
            x={x - 5}
            width={10}
            rx={5}
            fill="#67e8f9"
            animate={{ y: blink ? 50 : 43, height: blink ? 2 : 14 }}
            transition={{ duration: 0.08 }}
          />
        ))}
        <path d="M52 61 Q60 66 68 61" stroke="#67e8f9" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </motion.g>
      {/* cheeks */}
      <circle cx="36" cy="62" r="4" fill="#f472b6" opacity="0.55" />
      <circle cx="84" cy="62" r="4" fill="#f472b6" opacity="0.55" />
      {/* antenna */}
      <line x1="60" y1="22" x2="60" y2="8" stroke="#c4b5fd" strokeWidth="3" strokeLinecap="round" />
      <circle cx="60" cy="6" r="5" fill="#f472b6">
        <animate attributeName="r" values="4;6;4" dur="1.2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

export default function ScrollBuddy() {
  const loaded = useLoaded();
  const { scrollY, scrollYProgress } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVel = useSpring(velocity, { stiffness: 120, damping: 30 });

  // ride down the right edge with the scroll position
  const progress = useSpring(scrollYProgress, { stiffness: 60, damping: 18, mass: 0.6 });
  // Flight path: wide S-curves across the screen as you scroll (right -> left -> right ...),
  // drifting down the page with a gentle vertical wave.
  const SWEEPS = 2.5;
  const xNorm = useTransform(progress, (p) => 0.5 + 0.42 * Math.cos(p * Math.PI * SWEEPS * 2));
  const yNorm = useTransform(progress, (p) => 0.16 + 0.52 * p + 0.07 * Math.sin(p * Math.PI * 9));
  // "park" = 1 while a content-heavy section (the sideways Work panels) is on screen:
  // Byte tucks into the bottom-right corner instead of crossing over the content
  const parkTarget = useMotionValue(0);
  const park = useSpring(parkTarget, { stiffness: 60, damping: 16 });
  // where to park (fractions of the screen); springs so he glides between spots
  const parkX = useSpring(useMotionValue(0.97), { stiffness: 60, damping: 16 });
  const parkY = useSpring(useMotionValue(0.8), { stiffness: 60, damping: 16 });
  const xFinal = useTransform([xNorm, park, parkX], ([x, k, px]: number[]) => x + (px - x) * k);
  const yFinal = useTransform([yNorm, park, parkY], ([y, k, py]: number[]) => y + (py - y) * k);
  const left = useTransform(xFinal, (x) => `calc(${(x * 100).toFixed(3)}vw - ${(x * 7).toFixed(3)}rem)`);
  const top = useTransform(yFinal, (y) => `${(y * 100).toFixed(3)}vh`);
  // bank into turns: lean toward the direction of horizontal travel
  const dxdp = useTransform(progress, (p) => -Math.sin(p * Math.PI * SWEEPS * 2));
  const bankRaw = useTransform([dxdp, smoothVel], ([dir, v]: number[]) =>
    Math.max(-28, Math.min(28, dir * (v / 120)))
  );
  const tilt = useSpring(bankRaw, { stiffness: 120, damping: 14 });
  const streaks = useTransform(smoothVel, [-2500, -300, 300, 2500], [1, 0, 0, 1]);

  const [section, setSection] = useState("home");
  useEffect(() => {
    // Work: bottom-right corner, clear of the sliding panels.
    // Contact/footer: the empty space on the right edge, clear of the contact details.
    if (section === "work") {
      parkX.set(0.97);
      parkY.set(0.8);
    } else if (section === "contact") {
      parkX.set(0.97);
      parkY.set(0.48);
    }
    parkTarget.set(section === "work" || section === "contact" ? 1 : 0);
  }, [section, parkTarget, parkX, parkY]);
  const [say, setSay] = useState<string | null>(null);
  const [blink, setBlink] = useState(false);
  const [wave, setWave] = useState(false);
  const flipMV = useMotionValue(1);
  const thrust = useMotionValue(1);
  const eyeX = useMotionValue(0);
  const eyeY = useMotionValue(0);
  const eyeXView = useTransform([eyeX, flipMV] as never, ([x, f]: number[]) => x * f);
  const [facingLeft, setFacingLeft] = useState(false);
  const [onRight, setOnRight] = useState(true);
  const lastX = useRef(0.92);
  useMotionValueEvent(xFinal, "change", (x) => {
    if (Math.abs(x - lastX.current) > 0.002) {
      setFacingLeft(x < lastX.current);
      flipMV.set(x < lastX.current ? -1 : 1);
    }
    lastX.current = x;
    setOnRight(x > 0.5);
  });
  const box = useRef<HTMLDivElement>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const speak = useCallback((text: string, ms = 4200) => {
    setSay(text);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setSay(null), ms);
  }, []);

  // which section holds the middle of the screen -> what Byte says / where he flies
  const pickSection = useCallback(() => {
    const mid = window.innerHeight / 2;
    for (const id of Object.keys(LINES)) {
      const r = document.getElementById(id)?.getBoundingClientRect();
      if (r && r.top <= mid && r.bottom >= mid) {
        setSection(id);
        return;
      }
    }
  }, []);
  useMotionValueEvent(scrollY, "change", pickSection);
  useEffect(() => {
    const id = requestAnimationFrame(pickSection);
    return () => cancelAnimationFrame(id);
  }, [pickSection]);

  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => speak(LINES[section] ?? "👋"), section === "home" ? 1800 : 250);
    return () => clearTimeout(t);
  }, [section, loaded, speak]);

  // blinking
  useEffect(() => {
    let alive = true;
    const loop = () => {
      if (!alive) return;
      setBlink(true);
      setTimeout(() => setBlink(false), 140);
      setTimeout(loop, 2200 + Math.random() * 2800);
    };
    const t = setTimeout(loop, 1500);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, []);

  // eyes follow the cursor
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const r = box.current?.getBoundingClientRect();
      if (!r) return;
      const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
      const dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
      eyeX.set(Math.max(-1, Math.min(1, dx * 3)) * 5);
      eyeY.set(Math.max(-1, Math.min(1, dy * 3)) * 3);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [eyeX, eyeY]);

  // thrust follows scroll speed; wave after the visitor pauses
  useMotionValueEvent(smoothVel, "change", (v) => {
    thrust.set(1 + Math.min(1.4, Math.abs(v) / 1500));
    if (Math.abs(v) > 40) {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        setWave(true);
        setTimeout(() => setWave(false), 1300);
      }, 2500);
    }
  });

  useEffect(
    () => () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    },
    []
  );

  const onClick = (e: React.MouseEvent) => {
    burst(e);
    setWave(true);
    setTimeout(() => setWave(false), 1300);
    speak(CHEERS[Math.floor(Math.random() * CHEERS.length)], 2600);
  };

  return (
    <motion.div
      ref={box}
      className="fixed z-[65] h-16 w-14 md:h-32 md:w-28"
      style={{ top, left }}
      initial={{ opacity: 0, x: 140, rotate: 30 }}
      animate={loaded ? { opacity: 1, x: 0, rotate: 0 } : {}}
      transition={{ type: "spring", stiffness: 70, damping: 12, delay: 1.4 }}
    >
      {/* speech bubble */}
      <AnimatePresence>
        {say && (
          <motion.div
            key={say}
            className={`glass-strong absolute top-0 w-max max-w-[150px] rounded-2xl px-2.5 py-1.5 text-[11px] font-medium md:px-3.5 md:py-2 leading-snug text-white shadow-[0_10px_30px_-10px_rgba(168,85,247,0.8)] md:max-w-[240px] md:text-sm ${
              onRight ? "right-[85%] rounded-tr-sm" : "left-[85%] rounded-tl-sm"
            }`}
            initial={{ opacity: 0, scale: 0.4, x: onRight ? 20 : -20, y: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, x: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            style={{ transformOrigin: onRight ? "100% 0%" : "0% 0%" }}
          >
            {say}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        aria-label="Byte, the scroll buddy"
        data-cursor="Hi!"
        onClick={onClick}
        onMouseEnter={() => speak(LINES[section] ?? "👋")}
        className="relative block h-full w-full"
        style={{ rotate: tilt }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {/* speed streaks when scrolling fast */}
        <motion.div className="pointer-events-none absolute -top-10 left-1/2 flex -translate-x-1/2 gap-3" style={{ opacity: streaks }}>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block w-[2px] rounded-full bg-gradient-to-b from-transparent to-cyan-300"
              animate={{ height: [10, 34, 10], y: [0, 8, 0] }}
              transition={{ duration: 0.35, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
        </motion.div>
        {/* gentle hover-bob */}
        <motion.div className="h-full w-full" animate={{ y: [0, -8, 0] }} transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}>
          <motion.div
            className="h-full w-full"
            animate={{ scaleX: facingLeft ? -1 : 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Robot blink={blink} eyeX={eyeXView} eyeY={eyeY} wave={wave} thrust={thrust} />
          </motion.div>
        </motion.div>
        {/* glow underneath */}
        <span className="pointer-events-none absolute -bottom-3 left-1/2 h-4 w-16 -translate-x-1/2 rounded-full bg-violet-500/40 blur-md" />
      </motion.button>
    </motion.div>
  );
}
