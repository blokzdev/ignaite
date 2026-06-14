import Link from "next/link";
import { BrandMark, BrandWordmark } from "@/components/brand/brand-logo";
import { brand } from "@/data/brand";
import { CATEGORY_LABEL } from "@/lib/tools/category-labels";
import { topCategories } from "@/lib/tools/category-stats";
import { categoryHref } from "@/lib/tools/facet-links";

// Brand glyphs as raw SVG path data (24×24, fill=currentColor). Paths from
// Simple Icons (CC0); the logos remain their owners' marks — used here only to
// link to our profiles. Inlined rather than pulling an icon dependency: it's a
// small fixed set, so this stays zero-dep and fully tree-shaken. lucide-react
// no longer ships brand logos, hence the hand-rolled set.
const socials: ReadonlyArray<{ href: string; label: string; paths: readonly string[] }> = [
  {
    href: brand.social.github,
    label: "GitHub",
    paths: [
      "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
    ],
  },
  {
    href: brand.social.linkedin,
    label: "LinkedIn",
    paths: [
      "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
    ],
  },
  {
    href: brand.social.twitter,
    label: "X",
    paths: [
      "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
    ],
  },
  {
    href: brand.social.telegram,
    label: "Telegram",
    paths: [
      "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
    ],
  },
  {
    href: `mailto:${brand.social.email}`,
    label: "Email",
    paths: [
      "M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z",
      "M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z",
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-[var(--color-canvas)]">
      <div className="container-site safe-px py-12 sm:py-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Link
              href="/"
              className="group flex items-center gap-2.5"
              aria-label={`${brand.name} home`}
            >
              <BrandMark className="h-6 w-6 drop-shadow-[0_0_10px_rgba(8,217,214,0.45)] transition-transform group-hover:scale-110" />
              <BrandWordmark className="text-sm text-[var(--color-ink)]" />
            </Link>
            <p className="mt-4 max-w-xs text-sm text-[var(--color-ink-dim)]">
              An AI-managed directory of AI apps.
            </p>
          </div>

          <ul className="flex flex-wrap items-center gap-2.5">
            {socials.map(({ href, label, paths }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-ink-dim)] ring-1 ring-white/[0.08] transition-colors ring-inset hover:text-[var(--color-accent)] hover:ring-[var(--color-accent)]/30 focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-[18px] w-[18px]"
                    aria-hidden
                  >
                    {paths.map((d) => (
                      <path key={d} d={d} />
                    ))}
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Browse — compact category mesh (top 8 by active count + the full
            index). RSC: the counts are derived at build time, zero client JS.
            Crawl path: every category page is one hop from every page. */}
        <nav
          aria-label="Browse by category"
          className="mt-10 hidden border-t border-white/[0.06] pt-8 md:block"
        >
          <p className="font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
            Browse
          </p>
          <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            {topCategories(8).map(({ category }) => (
              <li key={category}>
                <Link
                  href={categoryHref(category)}
                  className="rounded font-mono text-[11px] tracking-[0.04em] text-[var(--color-ink-dim)] transition-colors hover:text-[var(--color-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
                >
                  {CATEGORY_LABEL[category]}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/categories"
                className="rounded font-mono text-[11px] tracking-[0.04em] text-[var(--color-accent)] transition-colors hover:text-[var(--color-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
              >
                All categories →
              </Link>
            </li>
          </ul>
        </nav>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/[0.06] pt-8 md:flex-row md:items-center">
          <p className="font-mono text-[10px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
            © {new Date().getFullYear()} {brand.legalName}
          </p>
          <Link
            href="/about#how-we-work"
            className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1.5 font-mono text-[10px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase ring-1 ring-white/[0.08] transition-colors ring-inset hover:bg-white/[0.08] hover:text-[var(--color-ink)]"
          >
            <span className="block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            Managed by Claude Code
          </Link>
        </div>
      </div>
    </footer>
  );
}
