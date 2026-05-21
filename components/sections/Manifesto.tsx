import { Reveal } from "@/components/Reveal";

export function Manifesto() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-surface/30">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-72 w-[48rem] max-w-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at top, color-mix(in srgb, #d4af37 14%, transparent), transparent 70%)",
        }}
      />
      <div className="container-px relative mx-auto max-w-3xl py-24 text-center md:py-32">
        <Reveal>
          <p className="kicker">Manifesto</p>
          <h2 className="mt-5 font-serif text-[clamp(2.25rem,5vw,3.75rem)] leading-tight tracking-tight">
            Neden TrendÇevir?
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mx-auto mt-10 max-w-2xl space-y-6 text-lg leading-relaxed text-secondary md:text-xl">
            <p>
              Çünkü en iyi fırsatlar, başkalarının bakmaya tenezzül etmediği
              yerlerde yatıyor.
            </p>
            <p>
              Türk girişimciler, yurtdışında çoktan kanıtlanmış iş modellerini
              yıllar geç fark ediyor. Biri{" "}
              <span className="text-foreground">Pop Mart</span>&apos;ı
              duyduğunda Çin&apos;de{" "}
              <span className="text-foreground">4 milyar dolar</span> olmuş
              oluyor. Biri <span className="text-foreground">sleep tourism</span>
              &apos;i duyduğunda Japonya&apos;da{" "}
              <span className="text-foreground">yüzlerce otel</span> açılmış
              oluyor. Bu gecikme bir bilgi açığı, bir fırsat açığı.
            </p>
            <p>
              TrendÇevir bu açığı kapatıyor. Her hafta dünyadan üç-beş trend
              filtreliyoruz; Türk pazarına uyumunu skorluyoruz; nasıl
              başlatılacağını yazıyoruz. Sade, somut, hızlı.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="mx-auto mt-12 max-w-md">
            <div className="gold-rule" />
            <p className="mt-12 font-serif text-[clamp(1.75rem,3.5vw,2.75rem)] italic leading-snug text-foreground">
              Üç dakika oku, bir hafta düşün, bir yıl önde başla.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
