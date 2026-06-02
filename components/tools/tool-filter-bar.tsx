"use client";
import { parseAsArrayOf, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import { ArrowDownUp, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { APP_CATEGORIES, APP_PRICING, BLOKZ_MARKS } from "@/types/app";
import type { AppCategory, AppPricing, BlokzMark } from "@/types/app";
import { cn } from "@/lib/utils";
import { clearFilters } from "@/lib/tools/clear-filters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type StatusFilter = "active" | "archived" | "all";
const STATUS_FILTERS: ReadonlyArray<StatusFilter> = ["active", "archived", "all"];

export type SortMode = "featured" | "recent" | "alpha";
export const SORT_MODES: ReadonlyArray<SortMode> = ["featured", "recent", "alpha"];

const CATEGORY_LABEL: Record<AppCategory, string> = {
  ide: "IDE",
  agent: "Agent",
  orchestration: "Orchestration",
  mcp: "MCP",
  eval: "Eval",
  infra: "Infra",
  memory: "Memory",
  "vector-db": "Vector DB",
  voice: "Voice",
  vision: "Vision",
  "image-gen": "Image",
  video: "Video",
  audio: "Audio",
  "3d": "3D",
  search: "Search",
  "data-ops": "Data Ops",
  observability: "Observability",
  "fine-tuning": "Fine-tuning",
  "research-platform": "Research",
  "browser-extension": "Browser Ext.",
  automation: "Automation",
};

const PRICING_LABEL: Record<AppPricing, string> = {
  free: "Free",
  freemium: "Freemium",
  paid: "Paid",
  "open-source": "OSS",
  "byo-key": "BYO key",
};

const MARK_LABEL: Record<BlokzMark, string> = {
  deployed: "Deployed",
  vetted: "Vetted",
  contributing: "Contributing",
};

const STATUS_LABEL: Record<StatusFilter, string> = {
  active: "Active",
  archived: "Archived",
  all: "All",
};

const SORT_LABEL: Record<SortMode, string> = {
  featured: "Featured",
  recent: "Recent",
  alpha: "A → Z",
};

interface Props {
  total: number;
  filtered: number;
}

export function ToolFilterBar({ total, filtered }: Readonly<Props>) {
  const [filter, setFilter] = useQueryStates(
    {
      category: parseAsArrayOf(parseAsStringLiteral(APP_CATEGORIES)).withDefault([]),
      pricing: parseAsArrayOf(parseAsStringLiteral(APP_PRICING)).withDefault([]),
      blokzMark: parseAsArrayOf(parseAsStringLiteral(BLOKZ_MARKS)).withDefault([]),
      status: parseAsStringLiteral(STATUS_FILTERS),
      sort: parseAsStringLiteral(SORT_MODES),
      q: parseAsString,
    },
    { shallow: true, history: "replace" },
  );

  const [text, setText] = useState(filter.q ?? "");
  useEffect(() => {
    const handle = setTimeout(() => {
      const next = text.trim();
      void setFilter({ q: next.length > 0 ? next : null });
    }, 220);
    return () => clearTimeout(handle);
  }, [text, setFilter]);

  // Keep the box in sync when `q` is cleared from elsewhere (e.g. the empty-state
  // "Clear filters" CTA). Guarded by focus so it never clobbers active typing.
  const inputFocused = useRef(false);
  useEffect(() => {
    if (!inputFocused.current) setText(filter.q ?? "");
  }, [filter.q]);

  const toggleCategory = (value: AppCategory) => {
    const has = filter.category.includes(value);
    const next = has ? filter.category.filter((v) => v !== value) : [...filter.category, value];
    void setFilter({ category: next.length > 0 ? next : null });
  };
  const togglePricing = (value: AppPricing) => {
    const has = filter.pricing.includes(value);
    const next = has ? filter.pricing.filter((v) => v !== value) : [...filter.pricing, value];
    void setFilter({ pricing: next.length > 0 ? next : null });
  };
  const toggleMark = (value: BlokzMark) => {
    const has = filter.blokzMark.includes(value);
    const next = has ? filter.blokzMark.filter((v) => v !== value) : [...filter.blokzMark, value];
    void setFilter({ blokzMark: next.length > 0 ? next : null });
  };
  const setStatus = (value: StatusFilter | null) => void setFilter({ status: value });
  const setSort = (value: SortMode) =>
    void setFilter({ sort: value === "featured" ? null : value });

  const clearAll = () => {
    setText("");
    clearFilters(setFilter);
  };

  const statusActive = (filter.status ?? "active") !== "active";

  const hasFilter =
    filter.category.length > 0 ||
    filter.pricing.length > 0 ||
    filter.blokzMark.length > 0 ||
    statusActive ||
    (filter.q?.length ?? 0) > 0;

  const sortMode = filter.sort ?? "featured";

  return (
    <div className="sticky top-16 z-30 -mx-6 mb-10 border-y border-white/[0.06] bg-[var(--color-canvas)]/85 px-6 py-4 backdrop-blur-xl sm:top-20">
      <div className="container-site flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search
              aria-hidden
              className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-ink-dim)]"
            />
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => (inputFocused.current = true)}
              onBlur={() => (inputFocused.current = false)}
              placeholder="Search apps, vendors, tags, models…"
              aria-label="Search apps"
              className="h-9 w-full rounded-full bg-white/[0.04] pr-10 pl-9 font-mono text-[11px] tracking-[0.04em] text-[var(--color-ink)] ring-1 ring-white/[0.08] transition-colors ring-inset placeholder:text-[var(--color-ink-dim)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none"
            />
            {text.length > 0 && (
              <button
                type="button"
                onClick={() => setText("")}
                aria-label="Clear search"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--color-ink-dim)] transition-colors hover:text-[var(--color-ink)]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          {/* Sort — DropdownMenu (radio) so it's available at every width;
              the old native <select> was hidden below sm. */}
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="Sort apps"
              className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full bg-white/[0.04] px-3 font-mono text-[11px] tracking-[0.08em] text-[var(--color-ink)] uppercase ring-1 ring-white/[0.08] transition-colors ring-inset hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none data-[state=open]:bg-white/[0.08]"
            >
              <ArrowDownUp className="h-3.5 w-3.5 text-[var(--color-ink-dim)]" />
              <span className="hidden sm:inline">{SORT_LABEL[sortMode]}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup
                value={sortMode}
                onValueChange={(v) => setSort(v as SortMode)}
              >
                {SORT_MODES.map((m) => (
                  <DropdownMenuRadioItem
                    key={m}
                    value={m}
                    className="font-mono text-[11px] tracking-[0.08em] uppercase"
                  >
                    {SORT_LABEL[m]}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <p
            className="hidden font-mono text-[10px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase sm:block"
            aria-live="polite"
          >
            {hasFilter ? `${filtered} of ${total}` : `${total} apps`}
          </p>
        </div>

        <div className="no-scrollbar scroll-fade-x -mx-2 flex flex-col gap-3 overflow-x-auto px-2">
          <FilterRow label="Category">
            <Chip
              active={filter.category.length === 0}
              onClick={() => void setFilter({ category: null })}
            >
              All
            </Chip>
            {APP_CATEGORIES.map((c) => (
              <Chip key={c} active={filter.category.includes(c)} onClick={() => toggleCategory(c)}>
                {CATEGORY_LABEL[c]}
              </Chip>
            ))}
          </FilterRow>

          <FilterRow label="Pricing">
            <Chip
              active={filter.pricing.length === 0}
              onClick={() => void setFilter({ pricing: null })}
            >
              All
            </Chip>
            {APP_PRICING.map((p) => (
              <Chip key={p} active={filter.pricing.includes(p)} onClick={() => togglePricing(p)}>
                {PRICING_LABEL[p]}
              </Chip>
            ))}
          </FilterRow>

          <FilterRow label="Blokz mark">
            <Chip
              active={filter.blokzMark.length === 0}
              onClick={() => void setFilter({ blokzMark: null })}
            >
              All
            </Chip>
            {BLOKZ_MARKS.map((m) => (
              <Chip key={m} active={filter.blokzMark.includes(m)} onClick={() => toggleMark(m)}>
                {MARK_LABEL[m]}
              </Chip>
            ))}
          </FilterRow>

          <FilterRow label="Status">
            {STATUS_FILTERS.map((s) => {
              const isCurrent = (filter.status ?? "active") === s;
              return (
                <Chip
                  key={s}
                  active={isCurrent}
                  onClick={() => setStatus(s === "active" ? null : s)}
                >
                  {STATUS_LABEL[s]}
                </Chip>
              );
            })}
          </FilterRow>
        </div>

        {/* Mobile meta row — count is always shown for context; clear appears
            only when something is filtered. (Desktop count lives in the top row.) */}
        <div className="flex items-center gap-3 sm:hidden">
          <p
            className="font-mono text-[10px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase"
            aria-live="polite"
          >
            {hasFilter ? `${filtered} of ${total}` : `${total} apps`}
          </p>
          {hasFilter && (
            <button
              type="button"
              onClick={clearAll}
              className="font-mono text-[10px] tracking-[0.08em] text-[var(--color-accent)] uppercase transition-opacity hover:opacity-75"
            >
              Clear all
            </button>
          )}
        </div>

        {hasFilter && (
          <div className="hidden items-center justify-end gap-3 sm:flex">
            <button
              type="button"
              onClick={clearAll}
              className="font-mono text-[10px] tracking-[0.08em] text-[var(--color-accent)] uppercase transition-opacity hover:opacity-75"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-nowrap items-center gap-1.5">
      <span className="mr-2 shrink-0 font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)]/70 uppercase">
        {label}
      </span>
      {children}
    </div>
  );
}

interface ChipProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function Chip({ active, onClick, children }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 font-mono text-[11px] tracking-[0.08em] whitespace-nowrap uppercase transition-colors",
        "focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none",
        active
          ? "bg-[var(--color-accent)] text-[var(--color-canvas)]"
          : "bg-white/[0.04] text-[var(--color-ink-dim)] ring-1 ring-white/[0.08] ring-inset hover:bg-white/[0.08] hover:text-[var(--color-ink)]",
      )}
    >
      {children}
    </button>
  );
}
