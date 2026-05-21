import { SignupForm } from "@/components/SignupForm";
import { Reveal } from "@/components/Reveal";
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

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-[34rem] w-[64rem] max-w-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in srgb, #d4af37 16%, transparent) 0%, transparent 60%)",
        }}
      />

      <div className="container-px mx-auto max-w-5xl pb-20 pt-16 text-center md:pb-28 md:pt-24">
        <Reveal>
          <p className="kicker">Her Pazartesi · 09:00</p>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="mx-auto mt-6 max-w-4xl text-balance font-serif leading-[1.02] tracking-tight text-[clamp(3rem,8vw,6rem)]">
            Dünyada işliyor.{" "}
            <span className="italic text-accent">Türkiye&apos;de henüz yok.</span>
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-secondary md:text-xl">
            Her Pazartesi sabah, yurtdışında çalışan iş trendlerini Türk
            girişimcilere getiriyoruz. Üç dakikalık okuma, milyon dolarlık
            fikirler.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div id="bulten" className="mx-auto mt-10 max-w-xl scroll-mt-28">
            <SignupForm source="hero" />
            <p className="mt-3 text-sm text-secondary">
              <span className="font-mono text-accent tabular">
                {siteConfig.subscriberCount}
              </span>{" "}
              girişimci aboneye katıl. Spam yok, istediğin an çık.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mx-auto mt-12 flex max-w-2xl flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-x-7">
            <Stat value={String(siteConfig.stats.countries)} label="ülke takip ediliyor" />
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
        </Reveal>
      </div>

      <div className="container-px mx-auto max-w-6xl">
        <div className="gold-rule" />
      </div>
    </section>
  );
}
