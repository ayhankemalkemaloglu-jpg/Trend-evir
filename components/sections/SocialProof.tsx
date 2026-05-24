import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/sections/SectionHeading";

const editorialPrinciples = [
  {
    title: "Kanıt ararız",
    body: "Her trendi gelir, büyüme, mağaza sayısı veya yatırım gibi ölçülebilir sinyallerle süzeriz.",
  },
  {
    title: "Türkiye merceğiyle bakarız",
    body: "Yurtdışında çalışan fikri olduğu gibi taşımayız; yerel satın alma gücü, mevzuat ve kültürle yeniden okuruz.",
  },
  {
    title: "Küçük başlamayı önemseriz",
    body: "Her sayıda fikrin en hafif pilotunu, risklerini ve hızlı test edilebilecek versiyonunu anlatırız.",
  },
] as const;

export function SocialProof() {
  return (
    <section className="container-px mx-auto max-w-6xl py-20 md:py-28">
      <Reveal>
        <SectionHeading
          kicker="Yayın ilkeleri"
          title="Sinyali gürültüden ayırıyoruz."
          align="center"
        />
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {editorialPrinciples.map((principle, i) => (
          <Reveal
            key={principle.title}
            delay={i * 0.07}
            className="flex flex-col rounded-2xl border border-border bg-surface p-7"
          >
            <p className="font-serif text-2xl text-foreground">{principle.title}</p>
            <p className="mt-4 flex-1 text-pretty leading-relaxed text-foreground/85">
              {principle.body}
            </p>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-accent/20 bg-accent/[0.06] p-6 text-center">
          <p className="text-sm leading-relaxed text-foreground/85">
            TrendÇevir anonim bir yayındır. Gerçek, izinli okuyucu yorumları ve
            basın bağlantıları oluşana kadar sahte sosyal kanıt göstermiyoruz.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
