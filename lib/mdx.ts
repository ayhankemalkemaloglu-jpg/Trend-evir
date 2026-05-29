import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

const ISSUES_DIR = path.join(process.cwd(), "content", "issues");

/** Anonymous "I applied this" story — no founder names, by brand rule. */
export type IssueStory = { city: string; sector: string; result: string };

export type IssueMeta = {
  slug: string;
  issue: number;
  title: string;
  date: string;
  excerpt: string;
  tint: string;
  categories: string[];
  trends: string[];
  readingMinutes: number;
  stories: IssueStory[];
};

function parseStories(input: unknown): IssueStory[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((s) => {
      const o = (s ?? {}) as Record<string, unknown>;
      return {
        city: String(o.city ?? ""),
        sector: String(o.sector ?? ""),
        result: String(o.result ?? ""),
      };
    })
    .filter((s) => s.result);
}

export function getIssueSlugs(): string[] {
  if (!fs.existsSync(ISSUES_DIR)) return [];
  return fs
    .readdirSync(ISSUES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getIssueSource(slug: string): string {
  return fs.readFileSync(path.join(ISSUES_DIR, `${slug}.mdx`), "utf8");
}

export function getIssueMeta(slug: string): IssueMeta {
  const { data, content } = matter(getIssueSource(slug));
  return {
    slug,
    issue: Number(data.issue ?? 0),
    title: String(data.title ?? slug),
    date: String(data.date ?? ""),
    excerpt: String(data.excerpt ?? ""),
    tint: String(data.tint ?? "#2a2f45"),
    categories: Array.isArray(data.categories) ? data.categories.map(String) : [],
    trends: Array.isArray(data.trends) ? data.trends.map(String) : [],
    readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
    stories: parseStories(data.stories),
  };
}

export function getAllIssues(): IssueMeta[] {
  return getIssueSlugs()
    .map(getIssueMeta)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getLatestIssue(): IssueMeta | undefined {
  return getAllIssues()[0];
}

/** Older issue = "Önceki Bülten", newer issue = "Sonraki Bülten". */
export function getAdjacentIssues(slug: string): {
  older?: IssueMeta;
  newer?: IssueMeta;
} {
  const all = getAllIssues(); // newest first
  const i = all.findIndex((x) => x.slug === slug);
  if (i === -1) return {};
  return {
    newer: i > 0 ? all[i - 1] : undefined,
    older: i < all.length - 1 ? all[i + 1] : undefined,
  };
}

/* --------------------------------- trends --------------------------------- */

/** Turkish-aware slug for a trend name (mirrors scripts/generate-issue.mjs). */
export function trendSlug(name: string): string {
  const map: Record<string, string> = {
    ç: "c",
    ğ: "g",
    ı: "i",
    İ: "i",
    ö: "o",
    ş: "s",
    ü: "u",
  };
  return name
    .toLowerCase()
    .replace(/[çğıİöşü]/g, (c) => map[c] ?? c)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export type TrendEntry = {
  slug: string;
  name: string;
  country: string;
  countryCode: string;
  category: string;
  score: number;
  description: string;
  /** Issues that cover this trend, newest first. */
  issues: IssueMeta[];
};

const TREND_BLOCK_RE = /<Trend\b([^>]*?)>([\s\S]*?)<\/Trend>/g;

function strAttr(raw: string, name: string): string | undefined {
  return raw.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`))?.[1];
}

function numAttr(raw: string, name: string): number | undefined {
  const m = raw.match(
    new RegExp(`${name}\\s*=\\s*\\{?\\s*"?(\\d+(?:\\.\\d+)?)"?\\s*\\}?`),
  );
  return m ? Number(m[1]) : undefined;
}

function cleanIntro(body: string, max = 300): string {
  const text = body
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

/**
 * Builds the trend index by parsing <Trend> blocks out of every issue body.
 * The newest mention wins for a trend's metadata; sorted by score, high first.
 */
export function getAllTrends(): TrendEntry[] {
  const byslug = new Map<string, TrendEntry>();

  for (const issue of getAllIssues()) {
    // getAllIssues is newest first, so the first mention we see is the newest.
    const body = matter(getIssueSource(issue.slug)).content;
    for (const match of body.matchAll(TREND_BLOCK_RE)) {
      const attrs = match[1];
      const name = strAttr(attrs, "name");
      if (!name) continue;
      const slug = trendSlug(name);

      const existing = byslug.get(slug);
      if (existing) {
        existing.issues.push(issue);
        continue;
      }
      byslug.set(slug, {
        slug,
        name,
        country: strAttr(attrs, "country") ?? "",
        countryCode: strAttr(attrs, "countryCode") ?? "",
        category: strAttr(attrs, "category") ?? "",
        score: numAttr(attrs, "score") ?? 0,
        description: cleanIntro(match[2] ?? ""),
        issues: [issue],
      });
    }
  }

  return [...byslug.values()].sort((a, b) => b.score - a.score);
}

export function getTrendSlugs(): string[] {
  return getAllTrends().map((t) => t.slug);
}

export function getTrendBySlug(slug: string): TrendEntry | undefined {
  return getAllTrends().find((t) => t.slug === slug);
}
