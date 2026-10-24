"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { whatIDo } from "@/data/portfolio";
import { BrandLogo, LineReveal, SectionLabel, ease } from "@/components/ui/Editorial";

export default function WhatIDo() {
  const [active, setActive] = useState(0);

  return (
    <section id="whatido" className="relative z-10 flex min-h-screen items-center px-5 py-24 md:px-10">
      <div className="mx-auto w-full max-w-[1400px] lg:flex lg:justify-end">
        <div className="w-full lg:w-[44%]">
          <SectionLabel n="02">Focus areas</SectionLabel>
          <h2 className="mt-6 font-display text-[clamp(2.6rem,5.2vw,4.8rem)] leading-[0.98] tracking-[-0.015em] text-ink">
            <LineReveal lines={["What I", <em key="d" className="text-accent">do best.</em>]} />
          </h2>

          <div className="mt-10 border-t border-ink/80">
            {whatIDo.map((card, i) => {
              const open = active === i;
              return (
                <motion.div
                  key={card.title}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ layout: { duration: 0.55, ease }, duration: 0.8, delay: i * 0.1, ease }}
                  onPointerEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={`group/row relative cursor-pointer border-b border-rule px-1 py-6 transition-colors duration-500 md:px-3 ${open ? "bg-white/[0.06]" : ""}`}
                >
                  {/* accent edge that grows in on the active row */}
                  <motion.span
                    aria-hidden
                    className="absolute inset-y-0 left-0 w-[2px] origin-top bg-accent"
                    initial={false}
                    animate={{ scaleY: open ? 1 : 0 }}
                    transition={{ duration: 0.5, ease }}
                  />
                  <motion.div layout="position" className="flex items-baseline justify-between gap-6 pl-3">
                    <div className="flex items-baseline gap-5">
                      <span className="font-mono text-[11px] text-accent">0{i + 1}</span>
                      <h3 className="font-display text-[clamp(1.9rem,3.2vw,2.8rem)] leading-none text-ink">
                        {card.title} <em className="text-ink/60">{card.titleAccent}</em>
                      </h3>
                    </div>
                    <motion.span className="font-mono text-xl text-ink" animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.4, ease }}>
                      +
                    </motion.span>
                  </motion.div>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.55, ease }}
                        className="overflow-hidden pl-3 md:pl-[3.2rem]"
                      >
                        <p className="max-w-lg pt-5 text-[15px] leading-relaxed text-muted">{card.blurb}</p>
                        <div className="mt-5 flex flex-wrap gap-2">
                          {card.skills.map((s, si) => (
                            <motion.span
                              key={s}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.12 + si * 0.03, duration: 0.45, ease }}
                              className="group/logo flex items-center gap-2 rounded-full border border-ink/15 bg-white/[0.06] px-3 py-1.5 text-xs text-ink transition-colors hover:border-ink/40 hover:bg-white/[0.14]"
                            >
                              <BrandLogo name={s} className="h-3.5 w-3.5" />
                              {s}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
