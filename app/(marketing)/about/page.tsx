import type { Metadata } from "next";
import { Hero } from "@/components/hero/hero";
import { HowWeWork } from "@/components/home/how-we-work";
import { NowNextBand } from "@/components/home/now-next-band";
import { Manifesto } from "@/components/manifesto/manifesto";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "How Ignaite works — an AI-managed directory of AI apps researched, written, and audited by Claude Code. What it is, how it stays current, and the studio that operates it.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Hero />
      <NowNextBand />
      <HowWeWork />
      <Manifesto />
    </>
  );
}
