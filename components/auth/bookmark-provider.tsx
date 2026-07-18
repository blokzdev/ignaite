"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getBookmarkState, setBookmark } from "@/lib/auth/actions";

type Kind = "app" | "recipe";

interface BookmarkContextValue {
  /** True once the initial state has hydrated (avoids a flash / premature clicks). */
  ready: boolean;
  signedIn: boolean;
  isBookmarked: (kind: Kind, slug: string) => boolean;
  /** Optimistic toggle. Redirects to sign-in when signed out; rolls back on failure. */
  toggle: (kind: Kind, slug: string) => void;
}

const BookmarkContext = createContext<BookmarkContextValue | null>(null);

const keyOf = (kind: Kind, slug: string) => `${kind}:${slug}`;

// Client island mounted once in the (marketing) layout. Hydrates the whole
// bookmark UI with ONE server-action round trip after mount — so nothing per-user
// is read during the static render of `/`, `/apps/*`, or `/recipes/*` (§2a). It
// imports no supabase-js, so the static route chunks are untouched.
export function BookmarkProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [marks, setMarks] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    let active = true;
    getBookmarkState().then((state) => {
      if (!active) return;
      setSignedIn(state.signedIn);
      const next = new Set<string>();
      for (const slug of state.app) next.add(keyOf("app", slug));
      for (const slug of state.recipe) next.add(keyOf("recipe", slug));
      setMarks(next);
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const isBookmarked = useCallback(
    (kind: Kind, slug: string) => marks.has(keyOf(kind, slug)),
    [marks],
  );

  const toggle = useCallback(
    (kind: Kind, slug: string) => {
      if (!signedIn) {
        router.push(`/sign-in?next=${encodeURIComponent(pathname)}`);
        return;
      }
      const k = keyOf(kind, slug);
      const desired = !marks.has(k);
      // Optimistic update.
      setMarks((prev) => {
        const next = new Set(prev);
        if (desired) next.add(k);
        else next.delete(k);
        return next;
      });
      setBookmark(kind, slug, desired).then((res) => {
        if (res.ok) return;
        // Roll back on failure (rate limit / transient error).
        setMarks((prev) => {
          const next = new Set(prev);
          if (desired) next.delete(k);
          else next.add(k);
          return next;
        });
      });
    },
    [signedIn, marks, router, pathname],
  );

  return (
    <BookmarkContext.Provider value={{ ready, signedIn, isBookmarked, toggle }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  return useContext(BookmarkContext);
}
