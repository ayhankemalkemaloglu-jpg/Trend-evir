"use client";

import { ChevronDown, Clock } from "lucide-react";

import { useScrollProgress } from "@/lib/use-scroll-progress";

/**
 * Sticky "özet" card shown above the issue body: excerpt, trend chips and a
 * reading-time badge. Collapsible via native <details> (works without JS;
 * collapse it on small screens to reclaim space). The accent line along the
 * bottom mirrors the page reading progress, integrating the top progress bar.
 */
export function IssueSummary({
  excerpt,
  trends,
  readingMinutes,
}: {
  excerpt: string;
  trends: string[];
  readingMinutes: number;
}) {
  const progress = useScrollProgress();

  return (
    <details
      open
      className="group sticky top-20 z-30 mt-10 overflow-hidden rounded-2xl border border-border bg-surface/95 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-surface/80 md:top-24"
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 p-4 md:p-5 [&::-webkit-details-marker]:hidden">
        <span className="kicker">Özet</span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 font-mono text-[0.7rem] text-secondary">
          <Clock className="size-3.5" />
          {readingMinutes} dk
        </span>
        <span className="ml-auto font-mono text-xs tabular text-secondary">
          %{Math.round(progress)} okundu
        </span>
        <ChevronDown className="size-4 text-secondary transition-transform duration-200 group-open:rotate-180" />
      </summary>

      <div className="px-4 pb-4 md:px-5 md:pb-5">
        <p className="text-sm leading-relaxed text-foreground/90">{excerpt}</p>
        {trends.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {trends.map((t) => (
              <li
                key={t}
                className="rounded-full border border-accent/30 bg-accent/5 px-3 py-1 text-xs text-accent"
              >
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div aria-hidden className="h-0.5 w-full bg-border">
        <div
          className="h-full bg-accent transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </details>
  );
}
