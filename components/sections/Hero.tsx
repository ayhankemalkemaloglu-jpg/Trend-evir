import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { HeroBackdrop } from "@/components/sections/HeroBackdrop";
import { HeroLines } from "@/components/sections/HeroLines";
import { SignupForm } from "@/components/SignupForm";
import { getAllTrends } from "@/lib/mdx";
import { siteConfig } from "@/lib/site";

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="font-mono text-base text-accent tabular sm:text-lg">
        {value}
      </span>
      <span className="text-sm text-secondary">{label}</span>
    </span>
  );
}

/**
 * Hero renders statically (no scroll-reveal) so the above-the-fold headline —
 * the LCP element — paints immediately rather than after JS hydration.
 */
export function Hero() {
  const topTrend = getAllTrends()[0];

  return (
    <section className="relative overflow-hidden">
      {/* animated gold-light backdrop (lazy, client-only, motion-aware) */}
      <HeroBackdrop />
      {/* flowing dashed gold lines (pure SVG/CSS, sits over the backdrop) */}
      <HeroLines />

      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-[34rem] w-[64rem] max-w-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in srgb, #d4af37 16%, transparent) 0%, transparent 60%)",
        }}
      />

      {/* Readability mask — darkens the centre so the headline stays legible
          over the moving shader; edges stay clear so the colour shows. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 50%, transparent 100%)",
        }}
      />

      <div className="relative z-20 container-px mx-auto max-w-5xl pb-20 pt-16 text-center md:pb-28 md:pt-24">
        <p className="kicker">Her Pazartesi · 09:00</p>

        <h1 className="mx-auto mt-6 max-w-4xl text-balance font-serif leading-[1.02] tracking-tight text-[clamp(3rem,8vw,6rem)]">
          Dünyada işliyor.{" "}
          <span className="italic text-accent">Türkiye&apos;de henüz yok.</span>
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-secondary md:text-xl">
          Her Pazartesi sabah, yurtdışında çalışan iş trendlerini Türk
          girişimcilere getiriyoruz. Üç dakikalık okuma, milyon dolarlık
          fikirler.
        </p>

        <div id="bulten" className="mx-auto mt-10 max-w-xl scroll-mt-28">
          <SignupForm
            source="hero"
            buttonLabel="Her Pazartesi 3 iş fikri al"
            glass
          />
          <p className="mt-4 font-mono text-xs uppercase tracking-wider text-secondary">
            3 dakika okuma · Türkiye uyum skoru · Aksiyon planı
          </p>
          <p className="mt-2 text-sm text-secondary">
            <span className="font-mono text-accent tabular">
              {siteConfig.subscriberCount}
            </span>{" "}
            girişimci aboneye katıl. Spam yok, istediğin an çık.
          </p>
        </div>

        <div className="mx-auto mt-12 flex max-w-2xl flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-x-7">
          <Stat
            value={String(siteConfig.stats.countries)}
            label="ülke takip ediliyor"
          />
          <span aria-hidden className="hidden text-border sm:inline">
            ·
          </span>
          <Stat value={String(siteConfig.stats.trends)} label="trend incelendi" />
          <span aria-hidden className="hidden text-border sm:inline">
            ·
          </span>
          <Stat
            value={`%${siteConfig.stats.openRate}`}
            label="haftalık açılma oranı"
          />
        </div>

        {topTrend && (
          <Link
            href={`/trend/${topTrend.slug}`}
            className="group mx-auto mt-10 inline-flex items-center gap-2.5 rounded-full border border-border bg-surface/60 px-4 py-2 text-sm transition-colors hover:border-accent/50"
          >
            <span className="font-mono text-[0.7rem] uppercase tracking-wider text-secondary">
              Son sayıdan
            </span>
            <span className="text-foreground/90">{topTrend.name}</span>
            <span className="font-mono font-semibold tabular text-accent">
              {topTrend.score}/10
            </span>
            <ArrowRight className="size-4 text-secondary transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
          </Link>
        )}
      </div>

      <div className="container-px mx-auto max-w-6xl">
        <div className="gold-rule" />
      </div>
    </section>
  );
}
