"use client";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { MagneticButton } from "@/components/effects/magnetic-button";
import { brand } from "@/data/brand";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

export function HeroCopy() {
  const reduced = useReducedMotion();
  const titleWords = brand.headline.title.split(" ");
  const accentWords = brand.headline.titleAccent.split(" ");

  const base = reduced ? { duration: 0 } : { duration: 0.7, ease: EASE_OUT_EXPO };

  return (
    <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
      <motion.p
        className="text-eyebrow text-[var(--color-accent)]"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...base, duration: 0.5 }}
      >
        {brand.headline.eyebrow}
      </motion.p>

      <h1 className="mt-6 text-5xl leading-[1.05] sm:text-6xl md:text-7xl lg:text-[7.5rem]">
        <motion.span
          className="block font-sans font-medium tracking-[-0.035em] text-[var(--color-ink)]"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: reduced ? 0 : 0.08, delayChildren: 0.2 },
            },
          }}
        >
          {titleWords.map((word, i) => (
            <Word key={i} reduced={reduced}>
              {word}
            </Word>
          ))}
        </motion.span>
        <motion.span
          className="text-display block text-[var(--color-accent)]"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: reduced ? 0 : 0.08, delayChildren: 0.55 },
            },
          }}
        >
          {accentWords.map((word, i) => (
            <Word key={i} reduced={reduced}>
              {word}
            </Word>
          ))}
        </motion.span>
      </h1>

      <motion.p
        className="mx-auto mt-8 max-w-xl text-base text-[var(--color-ink-dim)] sm:text-lg"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...base, delay: reduced ? 0 : 1.15 }}
      >
        {brand.headline.sub}
      </motion.p>

      <motion.div
        className="mt-12 flex flex-wrap items-center justify-center gap-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...base, delay: reduced ? 0 : 1.25 }}
      >
        <MagneticButton strength={0.25}>
          <Link
            href="#how-we-work"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--color-accent)] px-7 font-mono text-xs tracking-[0.08em] text-[var(--color-canvas)] uppercase transition-colors hover:bg-[var(--color-accent-hot)]"
          >
            See how we ship
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </MagneticButton>
        <MagneticButton strength={0.2}>
          <Link
            href="/"
            className="inline-flex h-12 items-center rounded-full bg-white/[0.04] px-7 font-mono text-xs tracking-[0.08em] text-[var(--color-ink)] uppercase ring-1 ring-white/[0.08] transition-colors ring-inset hover:bg-white/[0.08]"
          >
            Browse our apps
          </Link>
        </MagneticButton>
      </motion.div>
    </div>
  );
}

function Word({ children, reduced }: { children: string; reduced: boolean }) {
  return (
    <motion.span
      className="mr-[0.25em] inline-block"
      variants={{
        hidden: { opacity: 0, y: reduced ? 0 : 24, filter: reduced ? "blur(0px)" : "blur(8px)" },
        visible: { opacity: 1, y: 0, filter: "blur(0px)" },
      }}
      transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
    >
      {children}
    </motion.span>
  );
}
