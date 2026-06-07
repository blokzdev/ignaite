"use client";

import { useMemo } from "react";
import appsIndex from "@/.velite/apps-search.json";
import { APP_CATEGORIES, type AppCategory } from "@/types/app";
import { CATEGORY_LABEL } from "@/hooks/use-directory-filters";
import { cn } from "@/lib/utils";

interface Props {
  category: AppCategory | "";
  onCategoryChange: (category: AppCategory | "") => void;
  selectedSlugs: ReadonlyArray<string>;
  onToggle: (slug: string) => void;
}

// The category select reuses the form's input styling + chevron so it sits
// flush with the rest of the fields (kept in sync with contact-form.tsx).
const selectClass =
  "block w-full rounded-2xl bg-white/[0.04] px-4 py-3 text-base text-[var(--color-ink)] ring-1 ring-white/[0.08] ring-inset transition-colors focus:bg-white/[0.06] focus:ring-[var(--color-accent)]/40 focus:outline-none appearance-none bg-[length:1rem_1rem] bg-no-repeat pr-10";

/** Two-step picker for the "Help me choose between apps" intake: pick a
 *  category, then toggle the listings being weighed. Presentational — the
 *  parent owns state and renders the hidden inputs that ride to the server. */
export function ComparePicker({
  category,
  onCategoryChange,
  selectedSlugs,
  onToggle,
}: Readonly<Props>) {
  const candidates = useMemo(
    () =>
      category
        ? appsIndex
            .filter((a) => a.category === category)
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
        : [],
    [category],
  );

  // The chips track slugs; the email wants readable names. Resolve here (keyed
  // by unique slug) so the lazily-loaded index never reaches the form's bundle.
  const selectedPairs = useMemo(() => {
    const bySlug = new Map(appsIndex.map((a) => [a.slug, a.name] as const));
    return selectedSlugs.map((slug) => ({ slug, name: bySlug.get(slug) ?? slug }));
  }, [selectedSlugs]);

  const count = selectedSlugs.length;
  const countHint =
    count === 0 ? "Pick 2 or more" : count === 1 ? "1 selected · pick 1 more" : `${count} selected`;

  return (
    <div className="flex flex-col gap-4">
      {/* Ride-along fields for the server action's email body. */}
      {category && <input type="hidden" name="category" value={CATEGORY_LABEL[category]} />}
      {selectedPairs.map(({ slug, name }) => (
        <input key={slug} type="hidden" name="candidates" value={name} />
      ))}

      <div className="flex flex-col gap-2">
        <label
          htmlFor="compareCategory"
          className="font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase"
        >
          Category
        </label>
        <select
          id="compareCategory"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value as AppCategory | "")}
          className={selectClass}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='none' stroke='%238fa3ba' stroke-width='1.5'%3E%3Cpath d='m3 4.5 3 3 3-3'/%3E%3C/svg%3E\")",
            backgroundPosition: "right 0.85rem center",
          }}
        >
          <option value="" disabled>
            Pick a category
          </option>
          {APP_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABEL[c]}
            </option>
          ))}
        </select>
      </div>

      {category && (
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <span
              id="compareCandidatesLabel"
              className="font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase"
            >
              Apps you&rsquo;re weighing
            </span>
            <span
              aria-live="polite"
              className="font-mono text-[10px] tracking-[0.08em] text-[var(--color-ink-dim)]"
            >
              {countHint}
            </span>
          </div>
          {candidates.length === 0 ? (
            <p className="text-sm text-[var(--color-ink-dim)]">No listings in this category yet.</p>
          ) : (
            <div
              role="group"
              aria-labelledby="compareCandidatesLabel"
              className="flex flex-wrap gap-1.5"
            >
              {candidates.map((app) => {
                const active = selectedSlugs.includes(app.slug);
                return (
                  <button
                    key={app.slug}
                    type="button"
                    onClick={() => onToggle(app.slug)}
                    aria-pressed={active}
                    className={cn(
                      "inline-flex h-9 shrink-0 items-center rounded-full px-3 font-mono text-[11px] tracking-[0.08em] whitespace-nowrap uppercase transition-colors",
                      "focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none",
                      active
                        ? "bg-[var(--color-accent)] text-[var(--color-canvas)]"
                        : "bg-white/[0.04] text-[var(--color-ink-dim)] ring-1 ring-white/[0.08] ring-inset hover:bg-white/[0.08] hover:text-[var(--color-ink)]",
                    )}
                  >
                    {app.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
