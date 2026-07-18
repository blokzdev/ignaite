/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck — Deno Edge Function (jsr: imports + Deno global). Runs on Supabase's
// Deno runtime, NOT in the Next build. The eslint-disable above + @ts-nocheck keep the
// Node tsconfig/eslint from flagging Deno-only globals without touching shared configs.
// Do not import from app code.
// Self-serve account deletion. Invoked (server-side) by the requestAccountDeletion
// server action with the caller's session. Runs privileged: it derives the user id
// from the VERIFIED JWT (never the request body), then deletes the auth.users row —
// which cascades the profile + all bookmarks (both FK `on delete cascade`).
//
// The service-role key is injected into the Edge Function environment by the
// Supabase platform (SUPABASE_SERVICE_ROLE_KEY) — the app itself never handles it.
//
// Deploy: `supabase functions deploy delete-account` (or the Supabase MCP).

import { createClient } from "jsr:@supabase/supabase-js@2";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json({ error: "missing authorization" }, 401);

  const url = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // Verify the caller: getUser() validates the JWT against the auth server and
  // returns the authenticated user. The id we delete comes from here, not the body.
  const caller = createClient(url, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userErr } = await caller.auth.getUser();
  if (userErr || !userData.user) return json({ error: "unauthorized" }, 401);

  const admin = createClient(url, serviceKey);
  const { error } = await admin.auth.admin.deleteUser(userData.user.id);
  if (error) return json({ error: error.message }, 500);

  return json({ ok: true });
});
