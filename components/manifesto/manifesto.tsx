"use client";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { GlowOrb } from "@/components/effects/glow-orb";
import { principles } from "@/content/manifesto/principles";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { PrincipleCard } from "./principle-card";

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const orbAY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [120, -180]);
  const orbBY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-80, 140]);

  return (
    <section ref={ref} className="section-y-lg relative overflow-hidden px-6">
      <motion.div aria-hidden style={{ y: orbAY }} className="pointer-events-none absolute inset-0">
        <GlowOrb
          className="top-1/3 -left-32"
          size={620}
          color="var(--color-accent)"
          opacity={0.1}
        />
      </motion.div>
      <motion.div aria-hidden style={{ y: orbBY }} className="pointer-events-none absolute inset-0">
        <GlowOrb
          className="right-0 bottom-0"
          size={520}
          color="var(--color-violet)"
          opacity={0.1}
        />
      </motion.div>

      <div className="relative mx-auto max-w-6xl">
        <motion.header
          className="mb-20 max-w-2xl"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
        >
          <p className="text-eyebrow text-[var(--color-accent)]">{"// Manifesto"}</p>
          <h2 className="mt-4 text-4xl sm:text-5xl md:text-6xl">
            <span className="text-display text-[var(--color-ink)]">What we believe.</span>
          </h2>
        </motion.header>

        <div className="grid gap-x-12 gap-y-20 md:grid-cols-2 md:gap-y-16 lg:gap-x-24">
          {principles.map((principle, i) => (
            <PrincipleCard key={principle.id} principle={principle} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
