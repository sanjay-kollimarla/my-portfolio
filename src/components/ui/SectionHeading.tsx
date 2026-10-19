"use client";

import { motion } from "framer-motion";

export default function SectionHeading({
  index,
  eyebrow,
  title,
  highlight,
}: {
  index: string;
  eyebrow: string;
  title: string;
  highlight?: string;
}) {
  const words = title.split(" ");

  return (
    <div className="mb-16 md:mb-20">
      <motion.div
        className="mb-5 flex items-center gap-4 font-mono text-xs uppercase tracking-[0.35em] text-violet-300/80"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="text-white/40">{index}</span>
        <motion.span
          className="h-px w-16 origin-left bg-gradient-to-r from-violet-400 to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        {eyebrow}
      </motion.div>
      <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
        {words.map((w, i) => (
          <span key={i} className="mr-[0.25em] inline-block overflow-hidden pb-2 align-bottom">
            <motion.span
              className="inline-block"
              initial={{ y: "110%", rotate: 6 }}
              whileInView={{ y: "0%", rotate: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              {w}
            </motion.span>
          </span>
        ))}
        {highlight && (
          <span className="inline-block overflow-hidden pb-2 align-bottom">
            <motion.span
              className="inline-block aurora-text"
              initial={{ y: "110%", rotate: 6 }}
              whileInView={{ y: "0%", rotate: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: words.length * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              {highlight}
            </motion.span>
          </span>
        )}
      </h2>
    </div>
  );
}
