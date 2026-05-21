import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

const ISSUES_DIR = path.join(process.cwd(), "content", "issues");

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
};

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
