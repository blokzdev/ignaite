import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Cheapest posture for an SSG site: only the authed + auth surfaces run session
  // refresh. The static directory (`/`, `/apps/*`, `/recipes/*`, …) is never matched,
  // so it pays ~0 middleware cost. All three authed pages share the /account prefix.
  matcher: ["/account/:path*", "/auth/:path*", "/sign-in"],
};
