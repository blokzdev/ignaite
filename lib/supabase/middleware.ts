import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./database.types";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, isSupabaseConfigured } from "./env";

// All three authed surfaces live under one `/account` prefix, so a single check
// gates /account, /account/settings, and /account/bookmarks.
const PROTECTED = ["/account"];

export async function updateSession(request: NextRequest) {
  // Unconfigured (e.g. a preview deploy before env is set): pass straight through
  // so the matched auth routes never 500. The static site never reaches here (the
  // matcher is scoped in middleware.ts).
  if (!isSupabaseConfigured) return NextResponse.next({ request });

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // Do NOT run any code between createServerClient and getClaims, and always
  // return `supabaseResponse` unmodified — either violation causes intermittent
  // random logouts. getClaims() verifies locally against the JWKS when the project
  // uses asymmetric signing keys, else it verifies over the network (still correct).
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  const path = request.nextUrl.pathname;
  if (!claims && PROTECTED.some((p) => path.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
