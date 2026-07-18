"use client";

import { useTransition } from "react";
import { signOut } from "@/lib/auth/actions";

export function SignOutButton() {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      onClick={() => startTransition(() => void signOut())}
      disabled={pending}
      className="rounded-full px-3 py-1.5 font-mono text-xs tracking-[0.08em] text-[var(--color-ink-dim)] uppercase transition-colors hover:text-[var(--color-ink)] focus-visible:text-[var(--color-ink)] focus-visible:outline-none disabled:opacity-50"
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
