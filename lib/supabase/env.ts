// Accessor for the two client-safe Supabase env vars.
//
// DELIBERATELY does NOT throw at module load. The marketing routes never import
// this module (§2a of docs/architecture-supabase-user-layer.md), and CI + Vercel
// preview builds run `next build` with no Supabase env set — a module-level throw
// would break the build and the static directory. Instead every consumer checks
// `isSupabaseConfigured` and degrades gracefully: middleware passes through, read
// actions return empty results, and write actions no-op. The static directory is
// never affected by a half-configured auth layer. Once the three env vars are set
// (locally + on Vercel) the layer activates with no code change.
//
// The publishable key is client-safe (2026 naming; replaces the legacy anon key)
// and may live in NEXT_PUBLIC_. The secret/service-role key is NEVER referenced
// here — Phase-1 privileged work (account deletion) runs inside a Supabase Edge
// Function, which receives SUPABASE_SERVICE_ROLE_KEY from the platform at runtime.

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);
