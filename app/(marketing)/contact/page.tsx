import type { Metadata } from "next";
import { Suspense } from "react";
import { ArrowUpRight, Check, X } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactFormSkeleton } from "@/components/contact/contact-form-skeleton";
import { GlowOrb } from "@/components/effects/glow-orb";
import { brand } from "@/data/brand";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: `Compare apps, suggest one we're missing, sponsor a slot, or flag a correction — the front desk for the AI-apps directory. We reply within 48 hours.`,
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
          <h1 className="font-mono text-3xl font-medium tracking-[0.04em] text-[var(--color-ink)] uppercase sm:text-4xl md:text-5xl">
            Let&apos;s talk
          </h1>
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
              <h2 className="font-mono text-[10px] tracking-[0.12em] text-[var(--color-ink-soft)] uppercase">
                Glad to hear from
              </h2>
              <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-[var(--color-ink-dim)]">
                {[
                  "App suggestions and corrections — every one gets researched and credited.",
                  "Sponsors who want reach, not a rigged ranking.",
                  "Hard questions about how we judged a listing.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check
                      aria-hidden
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-success)]"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <h2 className="mt-4 font-mono text-[10px] tracking-[0.12em] text-[var(--color-ink-soft)] uppercase">
                We&apos;ll pass on
              </h2>
              <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-[var(--color-ink-dim)]">
                {[
                  "Pay-to-play pitches that expect a listing or a better rank.",
                  "Claims we can't verify against an app's own source.",
                  "Anything predatory, exploitative, or hostile to its users.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <X
                      aria-hidden
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-danger)]"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
