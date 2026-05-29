"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { Flag } from "@/components/Flag";
import { categories, type Category } from "@/lib/content";
import type { TrendEntry } from "@/lib/mdx";
import { cn } from "@/lib/utils";

type Sort = "score" | "alpha";

function TrendEntryCard({ trend }: { trend: TrendEntry }) {
  return (
    <Link
      href={`/trend/${trend.slug}`}
      className="group flex flex-col rounded-2xl border border-border bg-surface p-6 transition-all duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_24px_50px_-28px_rgba(0,0,0,0.8)]"
    >
      <div className="flex items-center gap-2.5">
        <Flag code={trend.countryCode} size={26} />
        <span className="font-mono text-[0.7rem] uppercase tracking-wider text-secondary">
          {trend.country} · {trend.category}
        </span>
        <span className="ml-auto font-mono text-xs font-semibold tabular text-accent">
          {trend.score}/10
        </span>
      </div>
      <h2 className="mt-3 font-serif text-2xl leading-snug transition-colors duration-200 group-hover:text-accent">
        {trend.name}
      </h2>
      <p className="mt-2 line-clamp-3 flex-1 text-pretty text-sm leading-relaxed text-secondary">
        {trend.description}
      </p>
      <p className="mt-4 font-mono text-[0.7rem] uppercase tracking-wider text-secondary">
        {trend.issues.length} bültende
      </p>
    </Link>
  );
}

export function TrendBrowser({ trends }: { trends: TrendEntry[] }) {
  const [active, setActive] = useState<Category>("Tümü");
  const [sort, setSort] = useState<Sort>("score");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLocaleLowerCase("tr");
    const list = trends.filter((t) => {
      if (active !== "Tümü" && t.category !== active) return false;
      if (!q) return true;
      return (
        t.name.toLocaleLowerCase("tr").includes(q) ||
        t.description.toLocaleLowerCase("tr").includes(q) ||
        t.country.toLocaleLowerCase("tr").includes(q)
      );
    });
    return [...list].sort((a, b) =>
      sort === "score"
        ? b.score - a.score
        : a.name.localeCompare(b.name, "tr"),
    );
  }, [trends, active, sort, deferredQuery]);

  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Kategori filtresi" className="flex flex-wrap gap-2.5">
          {categories.map((cat) => {
            const isActive = cat === active;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                aria-pressed={isActive}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-colors duration-200",
                  isActive
                    ? "border-accent bg-accent font-medium text-background"
                    : "border-border text-secondary hover:border-accent/50 hover:text-foreground",
                )}
              >
                {cat}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-secondary"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Trend ara…"
              aria-label="Trend ara"
              className="h-10 w-full rounded-full border border-border bg-surface pl-9 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-secondary focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/40 lg:w-56"
            />
          </div>
          <label className="sr-only" htmlFor="trend-sort">
            Sıralama
          </label>
          <select
            id="trend-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="h-10 rounded-full border border-border bg-surface px-4 text-sm text-secondary outline-none transition-colors hover:text-foreground focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            <option value="score">Skora göre</option>
            <option value="alpha">A’dan Z’ye</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-secondary">
          Aramana uyan trend bulunamadı.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((trend) => (
            <TrendEntryCard key={trend.slug} trend={trend} />
          ))}
        </div>
      )}
    </>
  );
}
