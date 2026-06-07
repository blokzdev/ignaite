"use client";

import { motion } from "motion/react";
import { useState, useTransition } from "react";
import { ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { submitContact, type ContactResult } from "@/app/(marketing)/contact/actions";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import { ContactSuccess } from "./contact-success";

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

const PROJECT_OPTIONS = [
  { value: "idea-exploration", label: "Got an idea, need a partner" },
  { value: "build-product", label: "Need to ship a production app" },
  { value: "oss-collab", label: "Want to collaborate on OSS" },
  { value: "correction", label: "Reporting a correction" },
  { value: "other", label: "Something else" },
];

export function ContactForm() {
  const reduced = useReducedMotion();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [messageLength, setMessageLength] = useState(0);
  // Pre-fill from URL — directory app-detail pages link here with
  // ?subject=Update+for+<App>&type=correction so a "Submit a correction" click
  // arrives already labelled and with the category preselected.
  const searchParams = useSearchParams();
  const prefillSubject = searchParams.get("subject") ?? "";
  const rawType = searchParams.get("type") ?? "";
  const prefillType = PROJECT_OPTIONS.some((o) => o.value === rawType) ? rawType : "";
  const isCorrection = prefillType === "correction";

  if (submitted) return <ContactSuccess />;

  const handleSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result: ContactResult = await submitContact(formData);
      if (result.ok) {
        setSubmitted(true);
      } else {
        setError(result.error ?? "Something went wrong. Please try again.");
      }
    });
  };

  return (
    <motion.form
      action={handleSubmit}
      noValidate
      className="flex flex-col gap-5"
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
    >
      {/* Honeypot — hidden from real users via positioning + tabindex. */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Field id="name" label="Your name">
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={120}
          className={inputClass}
          placeholder="Ada Lovelace"
        />
      </Field>

      <Field id="email" label="Email">
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          maxLength={200}
          className={inputClass}
          placeholder="ada@analytical.engine"
        />
      </Field>

      <Field id="projectType" label="What's this about?">
        <select
          id="projectType"
          name="projectType"
          defaultValue={prefillType}
          className={cn(inputClass, "appearance-none bg-[length:1rem_1rem] bg-no-repeat pr-10")}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none' stroke='%238fa3ba' stroke-width='1.5'%3E%3Cpath d='m3 4.5 3 3 3-3'/%3E%3C/svg%3E\")",
            backgroundPosition: "right 0.85rem center",
          }}
        >
          <option value="" disabled>
            Pick one
          </option>
          {PROJECT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </Field>

      {/* Optional subject — pre-filled when arriving from an app-detail page's
          "Submit a correction" link. Empty otherwise; the server falls back
          to a generated subject built from project type + name. */}
      {prefillSubject && (
        <Field id="subject" label="Subject (optional)">
          <input
            id="subject"
            name="subject"
            type="text"
            defaultValue={prefillSubject}
            maxLength={200}
            className={inputClass}
          />
        </Field>
      )}

      <Field
        id="message"
        label={isCorrection ? "What needs fixing?" : "What do you want to build?"}
        hint={`${messageLength}/1,000`}
      >
        <textarea
          id="message"
          name="message"
          required
          maxLength={1000}
          rows={6}
          onChange={(e) => setMessageLength(e.currentTarget.value.length)}
          className={cn(inputClass, "min-h-[160px] resize-y leading-relaxed")}
          placeholder={
            isCorrection
              ? "Tell us what's out of date or incorrect — and the right info if you have it."
              : "Background, stack hunches, deadlines, anything — short or long is fine."
          }
        />
      </Field>

      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-2xl bg-[var(--color-danger)]/[0.08] px-4 py-3 text-sm text-[var(--color-danger)] ring-1 ring-[var(--color-danger)]/30 ring-inset"
        >
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--color-accent)] px-6 font-mono text-xs tracking-[0.08em] text-[var(--color-canvas)] uppercase transition-colors hover:bg-[var(--color-accent-hot)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-canvas)] focus-visible:outline-none disabled:cursor-wait disabled:opacity-60"
        >
          {isPending ? "Sending…" : "Send it"}
          {!isPending && <ArrowRight className="h-3.5 w-3.5" />}
        </button>
        <p className="font-mono text-[10px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
          We reply within 48 hours.
        </p>
      </div>
    </motion.form>
  );
}

const inputClass =
  "block w-full rounded-2xl bg-white/[0.04] px-4 py-3 text-base text-[var(--color-ink)] ring-1 ring-white/[0.08] ring-inset transition-colors placeholder:text-[var(--color-ink-dim)] focus:bg-white/[0.06] focus:ring-[var(--color-accent)]/40 focus:outline-none";

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <label
          htmlFor={id}
          className="font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase"
        >
          {label}
        </label>
        {hint && (
          <span className="font-mono text-[10px] tracking-[0.08em] text-[var(--color-ink-dim)]">
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
