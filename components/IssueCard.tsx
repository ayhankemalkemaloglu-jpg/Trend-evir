import Link from "next/link";

import { CoverArt } from "@/components/CoverArt";
import { formatDateTR, issueNo } from "@/lib/format";
import type { IssueMeta } from "@/lib/mdx";
import { cn } from "@/lib/utils";

export function IssueCard({
  issue,
  className,
}: {
  issue: IssueMeta;
  className?: string;
}) {
  return (
    <Link
      href={`/arsiv/${issue.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_24px_50px_-28px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      <CoverArt tint={issue.tint} rounded="rounded-none" className="aspect-[16/9]">
        <div className="absolute left-4 top-4">
          <span className="rounded-full bg-background/55 px-3 py-1 font-mono text-xs text-accent backdrop-blur-sm">
            {issueNo(issue.issue)}
          </span>
        </div>
      </CoverArt>

      <div className="flex flex-1 flex-col p-6">
        <p className="font-mono text-xs uppercase tracking-wider text-secondary">
          {formatDateTR(issue.date)} · {issue.readingMinutes} dk okuma
        </p>
        <h2 className="mt-2 font-serif text-2xl leading-snug transition-colors duration-200 group-hover:text-accent">
          {issue.title}
        </h2>
        <ul className="mt-4 space-y-1.5">
          {issue.trends.slice(0, 3).map((trend) => (
            <li
              key={trend}
              className="flex items-center gap-2.5 text-sm text-secondary"
            >
              <span aria-hidden className="h-px w-4 shrink-0 bg-accent/60" />
              {trend}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
