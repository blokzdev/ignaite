import type { Metadata } from "next";
import { Suspense } from "react";
import { ArrowUpRight } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactFormSkeleton } from "@/components/contact/contact-form-skeleton";
import { GlowOrb } from "@/components/effects/glow-orb";
import { brand } from "@/data/brand";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: `Got an idea, a brief, or a half-finished side quest? Tell us about it — we reply within 48 hours.`,
  path: "/contact",
});

const CHANNELS: ReadonlyArray<{ label: string; href: string; display: string }> = [
  { label: "Email", href: `mailto:${brand.social.email}`, display: brand.social.email },
  { label: "Telegram", href: brand.social.telegram, display: "@blokzdev" },
  { label: "GitHub", href: brand.social.github, display: "github.com/blokzdev" },
  { label: "LinkedIn", href: brand.social.linkedin, display: "linkedin.com/company/blokzdev" },
];

export default function ContactPage() {
  return (
    <div className="relative overflow-hidden px-6 pt-32 pb-32 sm:pt-40">
      <GlowOrb
        className="-top-40 left-1/2 -translate-x-1/2"
        size={720}
        color="var(--color-accent)"
        opacity={0.09}
      />
      <GlowOrb
        className="-right-32 bottom-0"
        size={520}
        color="var(--color-violet)"
        opacity={0.07}
      />

      <div className="relative mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <p className="text-eyebrow text-[var(--color-accent)]">{"// Let's talk"}</p>
          <h1 className="mt-4 text-5xl sm:text-6xl md:text-7xl">
            <span className="text-display text-[var(--color-ink)]">Got an idea?</span>{" "}
            <span className="text-display text-[var(--color-accent)]">Pitch us.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base text-[var(--color-ink-dim)] sm:text-lg">
            We partner with founders building AI apps for B2B or B2C, teams shipping research-rooted
            software, OSS authors looking for an agentic co-pilot, and product orgs that want their
            roadmap audited by someone fluent in both the spec and the shipping. Tell us the shape
            of it.
          </p>
        </header>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
          {/* useSearchParams() inside ContactForm requires a Suspense boundary
              for SSG. The skeleton reserves the column so it doesn't pop in. */}
          <Suspense fallback={<ContactFormSkeleton />}>
            <ContactForm />
          </Suspense>

          <aside className="flex flex-col gap-8">
            <section>
              <h2 className="font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
                Or skip the form
              </h2>
              <ul className="mt-4 flex flex-col gap-2">
                {CHANNELS.map((c) => (
                  <li key={c.label}>
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group flex items-center justify-between gap-4 rounded-2xl bg-white/[0.03] px-4 py-3 ring-1 ring-white/[0.06] transition-colors ring-inset hover:bg-white/[0.06] hover:ring-[var(--color-accent)]/30"
                    >
                      <div>
                        <p className="font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
                          {c.label}
                        </p>
                        <p className="mt-1 text-sm text-[var(--color-ink)]">{c.display}</p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-[var(--color-ink-dim)] transition-colors group-hover:text-[var(--color-accent)]" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl bg-[var(--color-surface)]/60 p-5 ring-1 ring-white/[0.08] backdrop-blur-xl ring-inset">
              <h2 className="font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
                Response time
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-dim)]">
                Most messages get a reply from a human within 48 hours. Anything urgent —
                production-down, security — flag it in the message and we&apos;ll move it to the top
                of the stack.
              </p>
            </section>

            <section>
              <h2 className="font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
                Who we don&apos;t work with
              </h2>
              <ul className="mt-4 space-y-1.5 text-sm leading-relaxed text-[var(--color-ink-dim)]">
                <li>Anything predatory, exploitative, or against users&apos; interest.</li>
                <li>Cash-grab token launches without a real product behind them.</li>
                <li>Projects that need us to skip the receipts.</li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
