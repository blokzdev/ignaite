import Link from "next/link";
import { brand } from "@/data/brand";

const socials: ReadonlyArray<{ href: string; label: string }> = [
  { href: brand.social.github, label: "GitHub" },
  { href: brand.social.linkedin, label: "LinkedIn" },
  { href: brand.social.twitter, label: "Twitter" },
  { href: brand.social.telegram, label: "Telegram" },
  { href: brand.social.gdev, label: "g.dev" },
  { href: `mailto:${brand.social.email}`, label: "Email" },
];

export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-[var(--color-canvas)]">
      <div className="container-site px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <Link
              href="/"
              className="group flex items-center gap-2.5"
              aria-label={`${brand.name} home`}
            >
              <span className="block h-2.5 w-2.5 rounded-full bg-[var(--color-accent)] shadow-[0_0_12px_var(--color-accent)]" />
              <span className="font-mono text-sm tracking-[0.16em] uppercase">{brand.name}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-[var(--color-ink-dim)]">{brand.tagline}</p>
            <Link
              href="/about#how-we-work"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1.5 font-mono text-[10px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase ring-1 ring-white/[0.08] transition-colors ring-inset hover:bg-white/[0.08] hover:text-[var(--color-ink)]"
            >
              <span className="block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
              Built with Claude Code
            </Link>
          </div>

          <div>
            <h3 className="font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
              Sitemap
            </h3>
            <ul className="mt-4 space-y-2">
              {brand.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
              Connect
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-sm text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/[0.06] pt-8 md:flex-row md:items-center">
          <p className="font-mono text-[10px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
            © {new Date().getFullYear()} {brand.legalName} — {brand.tagline}
          </p>
          <p className="font-mono text-[10px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
            Vibecoded with Claude Code
          </p>
        </div>
      </div>
    </footer>
  );
}
