import Link from "next/link";

import { CoverArt } from "@/components/CoverArt";
import { Flag } from "@/components/Flag";
import type { Trend } from "@/lib/content";
import { cn } from "@/lib/utils";

export function TrendCard({
  trend,
  className,
}: {
  trend: Trend;
  className?: string;
}) {
  return (
    <Link
      href={trend.href}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_24px_50px_-28px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      <CoverArt tint={trend.tint} rounded="rounded-none" className="aspect-[16/9]">
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-background/50 py-1 pl-1 pr-3 backdrop-blur-sm">
          <Flag code={trend.countryCode} size={22} />
          <span className="text-xs text-foreground/90">{trend.country}</span>
        </div>
      </CoverArt>

      <div className="flex flex-1 flex-col p-6">
        <span className="font-mono text-[0.7rem] uppercase tracking-wider text-secondary">
          {trend.category}
        </span>
        <h3 className="mt-2 font-serif text-2xl leading-snug transition-colors duration-200 group-hover:text-accent">
          {trend.name}
        </h3>
        <p className="mt-2 flex-1 text-pretty text-sm leading-relaxed text-secondary">
          {trend.description}
        </p>

        <div className="mt-6 flex items-center justify-end">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3 py-1.5 text-xs text-accent">
            Türkiye Uyum Skoru
            <span className="font-mono font-semibold tabular">
              {trend.adaptationScore}/10
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
