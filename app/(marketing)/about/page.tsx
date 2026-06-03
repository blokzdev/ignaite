import type { Metadata } from "next";
import { AppsPreview } from "@/components/apps/apps-preview";
import { Hero } from "@/components/hero/hero";
import { HowWeWork } from "@/components/home/how-we-work";
import { NowNextBand } from "@/components/home/now-next-band";
import { StatsStrip } from "@/components/home/stats-strip";
import { Manifesto } from "@/components/manifesto/manifesto";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Blokz Development Co. — vibecoding studio building AI apps. Manifesto, current Now/Next focus, how we work, and the portfolio of shipped projects.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <NowNextBand />
      <HowWeWork />
      <Manifesto />
      <AppsPreview />
    </>
  );
}
