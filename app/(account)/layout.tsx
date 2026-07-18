import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark, BrandWordmark } from "@/components/brand/brand-logo";
import { SignOutButton } from "@/components/auth/sign-out-button";

// The whole authed subtree is noindex. It also lives OUTSIDE the (marketing) group,
// so it carries no Lenis/directory-console weight and its own dynamic chunk.
export const metadata: Metadata = { robots: { index: false, follow: false } };

const NAV = [
  { href: "/account", label: "Profile" },
  { href: "/account/bookmarks", label: "Bookmarks" },
  { href: "/account/settings", label: "Settings" },
];

export default function AccountLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-dvh">
      <header className="border-b border-white/[0.06] pt-[var(--safe-top)]">
        <div className="container-site safe-px flex h-[var(--nav-row-h)] items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-2.5" aria-label="Ignaite home">
            <BrandMark className="h-6 w-6 transition-transform group-hover:scale-110" />
            <BrandWordmark className="text-sm text-[var(--color-ink)]" />
          </Link>
          <nav aria-label="Account" className="flex items-center gap-1">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="rounded-full px-3 py-1.5 font-mono text-xs tracking-[0.08em] text-[var(--color-ink-dim)] uppercase transition-colors hover:text-[var(--color-ink)] focus-visible:text-[var(--color-ink)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <SignOutButton />
          </nav>
        </div>
      </header>
      <main id="main" className="container-site safe-px section-y">
        {children}
      </main>
    </div>
  );
}
