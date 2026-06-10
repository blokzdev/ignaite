import { cn } from "@/lib/utils";

// Ignaite ember — a tri-tone ignition flame: rich-purple base → cyan → hot-cyan
// tip (outer), with a warm orange ember core. Token-driven so it tracks the
// theme. The flame path is shared with the Satori/OG mark in lib/og-mark.ts.
export function BrandMark({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      viewBox="-60 -50 120 120"
      className={className}
      role="img"
      aria-label="Ignaite"
      focusable="false"
    >
      <defs>
        <linearGradient id="ignaite-flame-outer" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="var(--color-plum)" />
          <stop offset="0.5" stopColor="var(--color-accent)" />
          <stop offset="1" stopColor="var(--color-accent-hot)" />
        </linearGradient>
        <linearGradient id="ignaite-flame-core" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="var(--color-flame)" />
          <stop offset="1" stopColor="var(--color-flame-soft)" />
        </linearGradient>
      </defs>
      <path
        d="M0,64 C-42,36 -34,-8 -2,-44 C-8,-20 10,-16 6,-40 C30,-10 40,34 0,64 Z"
        fill="url(#ignaite-flame-outer)"
      />
      <path
        d="M0,58 C-22,40 -18,10 2,-14 C0,8 16,12 10,-8 C22,16 20,42 0,58 Z"
        fill="url(#ignaite-flame-core)"
      />
    </svg>
  );
}

// Wordmark: IGN·AI·TE with the "AI" lit in the cyan accent — surfaces the
// ign-AI-te / "AI-managed" story right in the name. Pass sizing + base text
// colour via className; the AI span overrides to accent.
export function BrandWordmark({ className }: Readonly<{ className?: string }>) {
  return (
    <span className={cn("font-mono tracking-[0.16em] uppercase", className)}>
      IGN<span className="brand-ai">AI</span>TE
    </span>
  );
}
