import type { ReactNode } from "react";
import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

/**
 * Pro-only analysis block usable inside any issue. The site has no auth, so the
 * authored detail is shown blurred behind a permanent "Pro'ya Geç" overlay — a
 * tease that converts to the beehiiv paid tier (where the full analysis lives).
 */
export function ProAnalysis({ children }: { children?: ReactNode }) {
  return (
    <section className="my-10 overflow-hidden rounded-2xl border border-accent/30 bg-surface">
      <div className="flex items-center gap-2 border-b border-border px-6 py-3">
        <Lock className="size-4 text-accent" />
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
          Pro Analiz
        </p>
      </div>
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none select-none px-6 py-6 blur-[5px]"
        >
          {children}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface/50 p-6 text-center">
          <p className="max-w-sm text-sm text-foreground/90">
            Pazar büyüklüğü, rakip haritası ve maliyet kırılımı Pro abonelere
            özel.
          </p>
          <Button asChild size="sm">
            <a href={siteConfig.proUrl} target="_blank" rel="noopener noreferrer">
              Pro&apos;ya Geç
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function MarketSize({ children }: { children?: ReactNode }) {
  return (
    <div className="mb-4">
      <p className="kicker mb-1">Pazar büyüklüğü</p>
      <div className="text-lg text-foreground">{children}</div>
    </div>
  );
}

export function Competitors({ children }: { children?: ReactNode }) {
  return (
    <div className="mb-4">
      <p className="kicker mb-1">Rakipler</p>
      <div className="text-foreground/90">{children}</div>
    </div>
  );
}

export function CostBreakdown({
  items = [],
}: {
  items?: { label: string; value: string }[];
}) {
  return (
    <div>
      <p className="kicker mb-1">Maliyet kırılımı</p>
      <table className="w-full text-sm">
        <tbody>
          {items.map((row) => (
            <tr key={row.label} className="border-b border-border/60">
              <td className="py-1.5 text-foreground/90">{row.label}</td>
              <td className="py-1.5 text-right font-mono text-accent">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
