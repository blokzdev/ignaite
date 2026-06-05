"use client";
import dynamic from "next/dynamic";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { HeroCopy } from "./hero-copy";
import { HeroFallback } from "./hero-fallback";
import { ScrollCue } from "./scroll-cue";

const R3FHero = dynamic(() => import("./r3f-hero").then((m) => m.R3FHero), {
  ssr: false,
  loading: () => <HeroFallback />,
});

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section className="relative flex min-h-dvh items-center justify-center overflow-hidden">
      <div aria-hidden className="absolute inset-0 z-0">
        {reduced ? <HeroFallback /> : <R3FHero />}
      </div>
      <HeroCopy />
      <ScrollCue />
    </section>
  );
}
