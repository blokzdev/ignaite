import { projects } from "@/data/projects";
import type {
  Chain,
  Platform,
  Project,
  ProjectCategory,
  ProjectStatus,
  ProjectType,
} from "@/types/project";

export interface ListOptions {
  platform?: Platform;
  chain?: Chain;
  type?: ProjectType;
  status?: ProjectStatus;
  category?: ProjectCategory;
}

export function listProjects(opts: ListOptions = {}): ReadonlyArray<Project> {
  const list = projects.filter((p) => {
    if (opts.platform && !p.platforms.includes(opts.platform)) return false;
    if (opts.chain && !p.chains.includes(opts.chain)) return false;
    if (opts.type && p.type !== opts.type) return false;
    if (opts.status && p.status !== opts.status) return false;
    if (opts.category && p.category !== opts.category) return false;
    return true;
  });

  return [...list].sort((a, b) => {
    // Featured first, then live > beta > coming-soon > deprecated > archived, then alpha.
    if (Boolean(a.featured) !== Boolean(b.featured)) return a.featured ? -1 : 1;
    const statusOrder: Record<ProjectStatus, number> = {
      live: 0,
      beta: 1,
      "coming-soon": 2,
      deprecated: 3,
      archived: 4,
    };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return a.name.localeCompare(b.name);
  });
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function featuredProjects(limit = 3): ReadonlyArray<Project> {
  return listProjects()
    .filter((p) => p.featured)
    .slice(0, limit);
}

export function relatedProjects(slug: string, limit = 3): ReadonlyArray<Project> {
  const current = getProject(slug);
  if (!current) return [];
  return listProjects()
    .filter((p) => p.slug !== slug)
    .filter((p) => p.type === current.type || p.category === current.category)
    .slice(0, limit);
}

export interface PortfolioStats {
  shipped: number;
  chains: number;
  sinceYear: number;
}

// Honest, data-derived aggregates for the /about credibility strip. Only counts
// things we can defend from the data — no invented download/user totals (per
// BACKLOG: per-app counts are unverified). Studio heritage dates to 2020.
//
// "Shipped" = anything that reached production (live/beta/deprecated/archived),
// excluding `coming-soon` placeholders — i.e. the nine published Android
// explorers, matching the brand heritage, not just the currently-live subset.
const SHIPPED_STATUSES: ReadonlySet<ProjectStatus> = new Set([
  "live",
  "beta",
  "deprecated",
  "archived",
]);

export function portfolioStats(): PortfolioStats {
  const shipped = projects.filter((p) => SHIPPED_STATUSES.has(p.status)).length;
  const chains = new Set(projects.flatMap((p) => p.chains).filter((c) => c !== "n-a")).size;
  const years = projects
    .map((p) => p.launchedAt)
    .filter((d): d is string => Boolean(d))
    .map((d) => new Date(d).getFullYear())
    .filter((y) => !Number.isNaN(y));
  const sinceYear = years.length ? Math.min(...years) : 2020;
  return { shipped, chains, sinceYear };
}
