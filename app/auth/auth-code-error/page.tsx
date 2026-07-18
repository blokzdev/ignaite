import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign-in error",
  robots: { index: false, follow: false },
};

export default function AuthCodeErrorPage() {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-6 px-6 text-center"
    >
      <p className="text-eyebrow text-[var(--color-accent-hot)]">Sign-in error</p>
      <h1 className="text-display text-3xl text-[var(--color-ink)]">
        Couldn&apos;t complete sign-in
      </h1>
      <p className="text-sm text-[var(--color-ink-soft)]">
        The sign-in link expired or was already used. Please try again — nothing was changed on your
        account.
      </p>
      <div className="flex items-center gap-3">
        <Link
          href="/sign-in"
          className="rounded-full bg-[var(--color-accent)] px-4 py-2 font-mono text-xs tracking-[0.08em] text-[var(--color-canvas)] uppercase transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
        >
          Try again
        </Link>
        <Link
          href="/"
          className="rounded-full px-4 py-2 font-mono text-xs tracking-[0.08em] text-[var(--color-ink-dim)] uppercase transition-colors hover:text-[var(--color-ink)]"
        >
          Back to directory
        </Link>
      </div>
    </main>
  );
}
