"use client";
import { parseAsStringLiteral, useQueryStates } from "nuqs";
import { chains } from "@/data/chains";
import { cn } from "@/lib/utils";

const PLATFORMS = ["android", "web", "oss"] as const;
const CHAINS = ["bitcoin", "ethereum", "bsc", "tron", "multi-chain", "n-a"] as const;

type PlatformValue = (typeof PLATFORMS)[number];
type ChainValue = (typeof CHAINS)[number];

const PLATFORM_LABELS: Record<PlatformValue, string> = {
  android: "Android",
  web: "Web",
  oss: "OSS",
};

interface Props {
  total: number;
  filtered: number;
}

export function ProjectFilterBar({ total, filtered }: Readonly<Props>) {
  const [filter, setFilter] = useQueryStates(
    {
      platform: parseAsStringLiteral(PLATFORMS),
      chain: parseAsStringLiteral(CHAINS),
    },
    { shallow: true, history: "replace" },
  );

  const setPlatform = (value: PlatformValue | null) => setFilter({ platform: value });
  const setChain = (value: ChainValue | null) => setFilter({ chain: value });

  const hasFilter = filter.platform !== null || filter.chain !== null;

  return (
    <div className="sticky top-20 z-30 -mx-6 mb-12 border-y border-white/[0.06] bg-[var(--color-canvas)]/85 px-6 py-4 backdrop-blur-xl">
      <div className="container-site flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <FilterRow label="Platform">
            <Chip active={filter.platform === null} onClick={() => setPlatform(null)}>
              All
            </Chip>
            {PLATFORMS.map((p) => (
              <Chip
                key={p}
                active={filter.platform === p}
                onClick={() => setPlatform(filter.platform === p ? null : p)}
              >
                {PLATFORM_LABELS[p]}
              </Chip>
            ))}
          </FilterRow>

          <FilterRow label="Chain">
            <Chip active={filter.chain === null} onClick={() => setChain(null)}>
              All
            </Chip>
            {CHAINS.map((c) => {
              const meta = chains[c];
              return (
                <Chip
                  key={c}
                  active={filter.chain === c}
                  onClick={() => setChain(filter.chain === c ? null : c)}
                  dotColor={meta.color}
                >
                  {meta.short}
                </Chip>
              );
            })}
          </FilterRow>
        </div>

        <div className="flex items-center gap-3">
          <p
            className="font-mono text-[10px] tracking-[0.08em] text-[var(--color-ink-dim)] uppercase"
            aria-live="polite"
          >
            {hasFilter ? `${filtered} of ${total}` : `${total} projects`}
          </p>
          {hasFilter && (
            <button
              type="button"
              onClick={() => setFilter({ platform: null, chain: null })}
              className="font-mono text-[10px] tracking-[0.08em] text-[var(--color-accent)] uppercase transition-opacity hover:opacity-75"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="mr-2 font-mono text-[10px] tracking-[0.16em] text-[var(--color-ink-dim)] uppercase">
        {label}
      </span>
      {children}
    </div>
  );
}

interface ChipProps {
  active: boolean;
  onClick: () => void;
  dotColor?: string;
  children: React.ReactNode;
}

function Chip({ active, onClick, dotColor, children }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-full px-3 font-mono text-[11px] tracking-[0.08em] uppercase transition-colors",
        "focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hot)] focus-visible:outline-none",
        active
          ? "bg-[var(--color-accent)] text-[var(--color-canvas)]"
          : "bg-white/[0.04] text-[var(--color-ink-dim)] ring-1 ring-white/[0.08] ring-inset hover:bg-white/[0.08] hover:text-[var(--color-ink)]",
      )}
    >
      {dotColor && (
        <span
          aria-hidden
          className="block h-1.5 w-1.5 rounded-full"
          style={{ background: active ? "currentColor" : dotColor }}
        />
      )}
      {children}
    </button>
  );
}
