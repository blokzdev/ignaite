import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./env";

// Browser Supabase client — reserved for FUTURE reactive islands (e.g. realtime).
// Phase 1 imports this from NOWHERE on `/` or `/apps/*`; all auth/bookmark state
// flows through server actions instead, so `supabase-js` never enters the static
// route chunks and the §10 bundle budgets hold. Keep it that way.
export function createClient() {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
}
