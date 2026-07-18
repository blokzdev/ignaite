import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./database.types";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./env";

// Server-side Supabase client (Next 15 async `cookies()`). Used ONLY by server
// actions, route handlers, and the dynamic `(account)` pages — NEVER by a
// marketing Server Component (§2a): a `cookies()` read in a marketing render path
// would opt the whole route group out of SSG.
//
// The `setAll` try/catch is required: a Server Component cannot write cookies —
// the middleware persists the refreshed session instead. The catch is an
// intentional no-op, not swallowed error handling.
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Component render — cookies are read-only here; middleware refreshes them.
        }
      },
    },
  });
}
