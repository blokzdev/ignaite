import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/brand/brand-logo";
import { buildMetadata } from "@/lib/seo";

// Branded fallback the service worker serves when a navigation fails with no
// network. Static, zero client JS. Kept out of the sitemap + noindex'd (it's
// an app-shell artifact, not real content).
export const metadata: Metadata = {
  ...buildMetadata({ title: "Offline", path: "/offline" }),
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main
      id="main"
      className="flex min-h-[100svh] flex-col items-center justify-center px-6 text-center"
    >
      <div className="glass flex max-w-md flex-col items-center gap-6 rounded-2xl px-8 py-12">
        <BrandMark className="h-14 w-14" />
        <div className="flex flex-col gap-3">
          <p className="text-eyebrow text-[var(--color-accent)]">{"// No connection"}</p>
          <h1 className="text-display text-3xl text-[var(--color-ink)]">You&rsquo;re offline</h1>
          <p className="text-sm text-[var(--color-ink-soft)]">
            Ignaite needs a connection to load fresh listings. Reconnect and try again — the
            directory is updated continuously by Claude Code.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--color-accent)] px-5 font-mono text-xs tracking-[0.08em] text-[var(--color-canvas)] uppercase transition-colors hover:bg-[var(--color-accent-hot)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-canvas)] focus-visible:outline-none"
        >
          Try again
        </Link>
      </div>
    </main>
  );
}
