"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import type { ScoreBreakdownData } from "@/components/trend/ScoreBreakdown";
import { BUDGET_OPTIONS, EXPERIENCE_OPTIONS, type BudgetKey, type Experience } from "@/lib/ideas";
import { CITY_OPTIONS, personalizeScore, type City } from "@/lib/scoring";
import { cn } from "@/lib/utils";

/**
 * "Benim için hesapla" — lets the reader reweight a trend's adaptation score by
 * their city, experience and budget. Pure client-side math (lib/scoring), no
 * network. Collapsed by default via native <details>.
 */
export function PersonalScore({
  data,
  baseScore,
}: {
  data: ScoreBreakdownData;
  baseScore: number;
}) {
  const [city, setCity] = useState<City>("istanbul");
  const [experience, setExperience] = useState<Experience>("yeni");
  const [budget, setBudget] = useState<BudgetKey>("10k-50k");

  const personal = useMemo(
    () => personalizeScore(data, { city, experience, budget }),
    [data, city, experience, budget],
  );
  const delta = Math.round((personal - baseScore) * 10) / 10;

  const selectClass =
    "h-10 w-full rounded-full border border-border bg-background/40 px-4 text-sm text-foreground outline-none transition-colors focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/40";

  return (
    <details className="group mt-5 rounded-xl border border-border bg-background/30 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer list-none items-center gap-2 p-4 text-sm text-secondary transition-colors hover:text-foreground">
        <SlidersHorizontal className="size-4 text-accent" />
        Benim için hesapla
        <span className="ml-auto font-mono text-xs text-secondary/70 group-open:hidden">
          aç
        </span>
      </summary>

      <div className="border-t border-border p-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-xs text-secondary">Şehir</span>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value as City)}
              className={selectClass}
            >
              {CITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs text-secondary">Deneyim</span>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value as Experience)}
              className={selectClass}
            >
              {EXPERIENCE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs text-secondary">Bütçe</span>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value as BudgetKey)}
              className={selectClass}
            >
              {BUDGET_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div
          aria-live="polite"
          className="mt-4 flex items-center justify-between rounded-lg border border-accent/30 bg-accent/5 px-4 py-3"
        >
          <span className="text-sm text-secondary">Sana göre uyum skoru</span>
          <span className="flex items-baseline gap-2">
            <span className="font-mono text-xl font-semibold tabular text-accent">
              {personal}/10
            </span>
            {delta !== 0 && (
              <span
                className={cn(
                  "font-mono text-xs tabular",
                  delta > 0 ? "text-success" : "text-red-400",
                )}
              >
                {delta > 0 ? "+" : ""}
                {delta}
              </span>
            )}
          </span>
        </div>
      </div>
    </details>
  );
}
