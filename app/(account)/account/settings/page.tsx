import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requestAccountDeletion } from "../actions";

export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  confirm: 'Type "DELETE" exactly to confirm.',
  delete: "Couldn't delete your account — please try again or contact team@ignaite.app.",
  rate: "Too many attempts. Try again in a few minutes.",
  unconfigured: "Accounts aren't fully configured yet.",
};

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/sign-in?next=/account/settings");
  const email = (data.claims.email as string | undefined) ?? "—";

  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-xl">
      <p className="text-eyebrow text-[var(--color-accent-hot)]">Your account</p>
      <h1 className="text-display mt-2 text-4xl text-[var(--color-ink)]">Settings</h1>

      <section className="glass mt-6 rounded-2xl p-6">
        <h2 className="font-mono text-xs tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
          Signed in as
        </h2>
        <p className="mt-2 text-sm text-[var(--color-ink)]">{email}</p>
        <p className="mt-1 text-xs text-[var(--color-ink-dim)]">
          Signed in with Google. Manage the connection from your Google account.
        </p>
      </section>

      <section className="mt-6 rounded-2xl bg-[var(--color-danger)]/[0.05] p-6 ring-1 ring-[var(--color-danger)]/20">
        <h2 className="text-base font-medium text-[var(--color-danger)]">Delete account</h2>
        <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
          Permanently deletes your profile and all bookmarks. This can&apos;t be undone.
        </p>

        {error && ERRORS[error] && (
          <p
            role="alert"
            className="mt-4 rounded-xl bg-[var(--color-danger)]/10 px-4 py-3 text-sm text-[var(--color-danger)] ring-1 ring-[var(--color-danger)]/20"
          >
            {ERRORS[error]}
          </p>
        )}

        <form action={requestAccountDeletion} className="mt-4 space-y-3">
          <label
            htmlFor="confirm"
            className="block font-mono text-xs tracking-[0.08em] text-[var(--color-ink-dim)] uppercase"
          >
            Type DELETE to confirm
          </label>
          <input
            id="confirm"
            name="confirm"
            type="text"
            autoComplete="off"
            placeholder="DELETE"
            aria-describedby="delete-help"
            className="w-full rounded-xl bg-white/[0.04] px-3 py-2 text-sm text-[var(--color-ink)] ring-1 ring-white/[0.08] ring-inset placeholder:text-[var(--color-ink-dim)] focus-visible:ring-2 focus-visible:ring-[var(--color-danger)] focus-visible:outline-none"
          />
          <p id="delete-help" className="sr-only">
            Type the word DELETE in capital letters to enable account deletion.
          </p>
          <button
            type="submit"
            className="rounded-full bg-[var(--color-danger)] px-5 py-2 font-mono text-xs tracking-[0.08em] text-white uppercase transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--color-danger)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-canvas)] focus-visible:outline-none"
          >
            Delete my account
          </button>
        </form>
      </section>
    </div>
  );
}
