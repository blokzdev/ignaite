"use client";

import { motion } from "motion/react";
import { useState, useTransition } from "react";
import { ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { submitContact, type ContactResult } from "@/app/(marketing)/contact/actions";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";
import type { AppCategory } from "@/types/app";
import { ContactSuccess } from "./contact-success";

// Lazy — the compare flow pulls the slim apps index, which only the "Help me
// choose between apps" path needs. Keeps it out of the contact page's initial
// bundle until a visitor opts in.
const ComparePicker = dynamic(() => import("./compare-picker").then((m) => m.ComparePicker), {
  ssr: false,
  loading: () => (
    <p className="flex min-h-28 items-center font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase">
      Loading the catalog…
    </p>
  ),
});

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

const PROJECT_OPTIONS = [
  { value: "compare", label: "Help me choose between apps" },
  { value: "suggest-app", label: "Suggest an app to list" },
  { value: "suggest-category", label: "Suggest a category" },
  { value: "correction", label: "Reporting a correction" },
  { value: "sponsorship", label: "Sponsor a slot / advertise" },
  { value: "press", label: "Press / partnership" },
  { value: "oss-collab", label: "Want to collaborate on OSS" },
  { value: "other", label: "Something else" },
];

type FieldCopy = {
  title: string | null;
  description: string;
  label: string;
  placeholder: string;
};

// Drives the contextual block + the textarea label/placeholder, keyed on the
// "What's this about?" selection. `default` covers the unselected state (the
// hero already titles the page, so its `title` is null).
const DEFAULT_COPY: FieldCopy = {
  title: null,
  description:
    "The front desk for the directory: compare a few apps, suggest one (or a category) we should list, sponsor a slot, or flag something that's drifted. Pick what fits above and we'll tailor the rest.",
  label: "What's on your mind?",
  placeholder: "A sentence or two is plenty — pick a topic above for tailored prompts.",
};

const FIELD_COPY: Record<string, FieldCopy> = {
  compare: {
    title: "Torn between options?",
    description:
      "Pick the category, choose the apps you're weighing, and tell us what you're optimizing for. We'll point you to the right one — straight from the catalog, no affiliate angle.",
    label: "What's the decision?",
    placeholder:
      "Your goal, must-haves, constraints, budget — anything that helps us steer the pick.",
  },
  "suggest-app": {
    title: "Know one we're missing?",
    description:
      "Tell us the app and why it belongs. Every suggestion gets researched against its own source before it's listed — no pay-to-list.",
    label: "What should we list?",
    placeholder: "Name, link, and what it does — a line on why it's worth knowing helps.",
  },
  "suggest-category": {
    title: "Spot a gap in the map?",
    description:
      "If a whole class of AI tools isn't represented, tell us. We'll look at whether it deserves its own category.",
    label: "What category are we missing?",
    placeholder: "The category, a few example apps that'd live there, and why it's distinct.",
  },
  press: {
    title: "Press or partnership?",
    description:
      "Media, data or API access, or working together — tell us what you have in mind and we'll route it to the right place.",
    label: "What's this regarding?",
    placeholder: "A sentence on who you are and what you're after.",
  },
  "oss-collab": {
    title: "Building in the open?",
    description:
      "Point us at the repo and where an agentic co-pilot would move the needle — features, reviews, docs, releases.",
    label: "What's the project?",
    placeholder:
      "Link the repo and tell us where you want a hand — issues, PRs, docs, or a bigger build-out.",
  },
  sponsorship: {
    title: "Want to reach our readers?",
    description:
      "Tell us about your AI app and who you want to reach. Sponsored slots are clearly labeled and limited — they never alter the catalog's editorial coverage.",
    label: "What are you promoting?",
    placeholder:
      "Your app, the audience you're after, and rough budget or timing — we'll send the details.",
  },
  correction: {
    title: "Spotted something off?",
    description:
      "The directory is audited continuously, but things drift. Tell us what's stale and the right info if you have it.",
    label: "What needs fixing?",
    placeholder:
      "Which listing, what's out of date or incorrect — and the right info if you have it.",
  },
  other: {
    title: "Something else? Say more.",
    description:
      "Not a fit for the buckets above? Tell us what's on your mind and we'll point it the right way.",
    label: "What's on your mind?",
    placeholder: "Whatever it is — partnership, press, a question — give us the gist.",
  },
};

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
  // Controlled so live selection (not just the URL prefill) drives the copy below.
  const [projectType, setProjectType] = useState(prefillType);
  const copy = FIELD_COPY[projectType] ?? DEFAULT_COPY;
  // "Help me choose between apps" sub-flow: a category, then the listings being
  // weighed. Selections ride to the server as hidden inputs (see below).
  const [compareCategory, setCompareCategory] = useState<AppCategory | "">("");
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);
  const isCompare = projectType === "compare";

  if (submitted) return <ContactSuccess />;

  const handleSubmit = (formData: FormData) => {
    setError(null);
    if (isCompare && (!compareCategory || compareSlugs.length < 2)) {
      setError("Pick a category and at least two apps you're choosing between.");
      return;
    }
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
          value={projectType}
          onChange={(e) => setProjectType(e.target.value)}
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

      {/* Contextual guidance — adapts to the dropdown so the right framing sits
          immediately above the textarea. aria-live announces changes; the
          textarea points back here via aria-describedby. */}
      <motion.div
        key={projectType}
        id="projectGuidance"
        aria-live="polite"
        className="border-l-2 border-[var(--color-accent)]/40 pl-4"
        initial={reduced ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
      >
        {copy.title && <p className="text-display text-xl text-[var(--color-ink)]">{copy.title}</p>}
        <p
          className={cn(
            "text-sm leading-relaxed text-[var(--color-ink-soft)]",
            copy.title && "mt-1",
          )}
        >
          {copy.description}
        </p>
      </motion.div>

      {isCompare && (
        <ComparePicker
          category={compareCategory}
          onCategoryChange={(c) => {
            setCompareCategory(c);
            // Drop stragglers from the previous category.
            setCompareSlugs([]);
          }}
          selectedSlugs={compareSlugs}
          onToggle={(slug) =>
            setCompareSlugs((prev) =>
              prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
            )
          }
        />
      )}

      <Field id="message" label={copy.label} hint={`${messageLength}/1,000`}>
        <textarea
          id="message"
          name="message"
          required
          maxLength={1000}
          rows={6}
          aria-describedby="projectGuidance"
          onChange={(e) => setMessageLength(e.currentTarget.value.length)}
          className={cn(inputClass, "min-h-[160px] resize-y leading-relaxed")}
          placeholder={copy.placeholder}
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
          A human replies within 48 hours — usually faster.
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
