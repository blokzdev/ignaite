"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { getSessionSummary, signOut, type SessionSummary } from "@/lib/auth/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Desktop nav account affordance. Self-hydrates via getSessionSummary() after
// mount — the nav renders statically and reads no session/cookies, so the whole
// (marketing) group stays prerendered (§2a). We show INITIALS, not the Google
// avatar image: the site CSP is `img-src 'self' data:`, which would block an
// external avatar URL.
export function AccountMenu() {
  // undefined = still loading · null = signed out · object = signed in
  const [summary, setSummary] = useState<SessionSummary | undefined>(undefined);
  const [, startTransition] = useTransition();

  useEffect(() => {
    let active = true;
    getSessionSummary().then((s) => {
      if (active) setSummary(s);
    });
    return () => {
      active = false;
    };
  }, []);

  // Fixed-size slot during hydration so the swap causes no layout shift (CLS).
  if (summary === undefined) {
    return (
      <div
        aria-hidden
        className="h-8 w-8 rounded-full bg-white/[0.04] ring-1 ring-white/[0.08] ring-inset"
      />
    );
  }

  if (summary === null) {
    return (
      <Link
        href="/sign-in"
        className="inline-flex items-center rounded-full bg-white/[0.04] px-3 py-1.5 font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase ring-1 ring-white/[0.08] transition-colors ring-inset hover:bg-white/[0.08] hover:text-[var(--color-ink)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
      >
        Sign in
      </Link>
    );
  }

  const name = summary.displayName || summary.handle || "Account";
  const initials = name.trim().slice(0, 1).toUpperCase() || "A";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        className="grid h-8 w-8 place-items-center rounded-full bg-[var(--color-accent)]/[0.14] text-xs font-medium text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/30 transition-colors ring-inset hover:bg-[var(--color-accent)]/[0.22] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
      >
        {initials}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[12rem]">
        <DropdownMenuLabel className="truncate normal-case">{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account/bookmarks">Bookmarks</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            startTransition(() => void signOut());
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
