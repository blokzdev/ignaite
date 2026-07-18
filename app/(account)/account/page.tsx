import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateProfile } from "./actions";

// Reads cookies()/getClaims() in render → inherently dynamic. Explicit for clarity.
export const dynamic = "force-dynamic";

const BANNERS: Record<string, { tone: "ok" | "err"; text: string }> = {
  saved: { tone: "ok", text: "Profile saved." },
  handle: { tone: "err", text: "Handle must be 3–30 chars: lowercase letters, numbers, or _." },
  handle_taken: { tone: "err", text: "That handle is already taken." },
  save: { tone: "err", text: "Couldn't save — please try again." },
  rate: { tone: "err", text: "Too many changes just now. Give it a minute." },
  unconfigured: { tone: "err", text: "Accounts aren't fully configured yet." },
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/sign-in?next=/account"); // belt; middleware is the primary gate
  const userId = data.claims.sub;

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, bio, handle, avatar_url")
    .eq("id", userId)
    .single();

  const { saved, error } = await searchParams;
  const banner = saved ? BANNERS.saved : error ? BANNERS[error] : undefined;

  return (
    <div className="mx-auto max-w-xl">
      <p className="text-eyebrow text-[var(--color-accent-hot)]">Your account</p>
      <h1 className="text-display mt-2 text-4xl text-[var(--color-ink)]">Profile</h1>
      <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
        How you show up across Ignaite. Everything here is optional.
      </p>

      {banner && (
        <p
          role="status"
          className={
            banner.tone === "ok"
              ? "mt-6 rounded-xl bg-[var(--color-success)]/10 px-4 py-3 text-sm text-[var(--color-success)] ring-1 ring-[var(--color-success)]/20"
              : "mt-6 rounded-xl bg-[var(--color-danger)]/10 px-4 py-3 text-sm text-[var(--color-danger)] ring-1 ring-[var(--color-danger)]/20"
          }
        >
          {banner.text}
        </p>
      )}

      <form
        action={updateProfile}
        className="glass mt-6 space-y-5 rounded-2xl p-6"
        aria-label="Edit profile"
      >
        <Field
          label="Display name"
          name="display_name"
          defaultValue={profile?.display_name ?? ""}
          maxLength={80}
          placeholder="Ada Lovelace"
          autoComplete="name"
        />
        <div className="space-y-2">
          <Field
            label="Handle"
            name="handle"
            defaultValue={profile?.handle ?? ""}
            maxLength={30}
            placeholder="ada"
            describedBy="handle-help"
            inputMode="text"
          />
          <p id="handle-help" className="font-mono text-xs text-[var(--color-ink-dim)]">
            3–30 chars · lowercase letters, numbers, underscore
          </p>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="bio"
            className="block font-mono text-xs tracking-[0.08em] text-[var(--color-ink-dim)] uppercase"
          >
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={3}
            maxLength={500}
            defaultValue={profile?.bio ?? ""}
            placeholder="Optional — a line about you."
            className="w-full resize-y rounded-xl bg-white/[0.04] px-3 py-2 text-sm text-[var(--color-ink)] ring-1 ring-white/[0.08] ring-inset placeholder:text-[var(--color-ink-dim)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
          />
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="rounded-full bg-[var(--color-accent)] px-5 py-2 font-mono text-xs tracking-[0.08em] text-[var(--color-canvas)] uppercase transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-canvas)] focus-visible:outline-none"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  maxLength,
  placeholder,
  describedBy,
  autoComplete,
  inputMode,
}: {
  label: string;
  name: string;
  defaultValue: string;
  maxLength: number;
  placeholder?: string;
  describedBy?: string;
  autoComplete?: string;
  inputMode?: "text";
}) {
  const id = name;
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block font-mono text-xs tracking-[0.08em] text-[var(--color-ink-dim)] uppercase"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type="text"
        defaultValue={defaultValue}
        maxLength={maxLength}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-describedby={describedBy}
        className="w-full rounded-xl bg-white/[0.04] px-3 py-2 text-sm text-[var(--color-ink)] ring-1 ring-white/[0.08] ring-inset placeholder:text-[var(--color-ink-dim)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
      />
    </div>
  );
}
