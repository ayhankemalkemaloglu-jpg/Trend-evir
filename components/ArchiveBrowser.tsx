"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { IssueCard } from "@/components/IssueCard";
import { categories, type Category } from "@/lib/content";
import type { IssueMeta } from "@/lib/mdx";
import { cn } from "@/lib/utils";

const PER_PAGE = 12;

export function ArchiveBrowser({ issues }: { issues: IssueMeta[] }) {
  const [active, setActive] = useState<Category>("Tümü");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      active === "Tümü"
        ? issues
        : issues.filter((i) => i.categories.includes(active)),
    [active, issues],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const items = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  function selectCategory(cat: Category) {
    setActive(cat);
    setPage(1);
  }

  return (
    <>
      <nav aria-label="Kategori filtresi" className="flex flex-wrap gap-2.5">
        {categories.map((cat) => {
          const isActive = cat === active;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => selectCategory(cat)}
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

      {items.length === 0 ? (
        <p className="mt-16 text-center text-secondary">
          Bu kategoride henüz bülten yok.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((issue) => (
            <IssueCard key={issue.slug} issue={issue} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav
          aria-label="Sayfalama"
          className="mt-14 flex items-center justify-center gap-2"
        >
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={current === 1}
            aria-label="Önceki sayfa"
            className="grid size-10 place-items-center rounded-full border border-border text-secondary transition-colors hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                aria-current={p === current ? "page" : undefined}
                className={cn(
                  "grid size-10 place-items-center rounded-full border font-mono text-sm transition-colors",
                  p === current
                    ? "border-accent bg-accent text-background"
                    : "border-border text-secondary hover:border-accent hover:text-accent",
                )}
              >
                {p}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={current === totalPages}
            aria-label="Sonraki sayfa"
            className="grid size-10 place-items-center rounded-full border border-border text-secondary transition-colors hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronRight className="size-4" />
          </button>
        </nav>
      )}
    </>
  );
}
