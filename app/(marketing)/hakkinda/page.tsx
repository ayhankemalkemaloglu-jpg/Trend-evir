import type { Metadata } from "next";
import Link from "next/link";

import { LogoLockup } from "@/components/Logo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hakkında",
  description:
    "TrendÇevir, dünyadaki iş ve tüketici trendlerini Türk girişimciler için filtreleyen haftalık bir bültendir. Trend seçim kriterlerimiz ve nasıl çalıştığımız.",
  alternates: { canonical: "/hakkinda" },
};

const criteria = [
  {
    title: "Yurtdışında ölçülebilir.",
    body: "Gelir, büyüme, açılan mağaza, yatırım turu — kanıt zorunlu.",
  },
  {
    title: "Türkiye'de yok ya da çok küçük.",
    body: "Hızlı bir Türkçe arama anlamlı sonuç vermiyorsa geçer.",
  },
  {
    title: "Aktarılabilir.",
    body: "Kültür, satın alma gücü, regülasyon imkânsız kılmıyorsa geçer.",
  },
  {
    title: "Başlatılabilir.",
    body: "500 bin TL altı sermayeyle altı ay içinde başlanabilir bir versiyonu varsa geçer.",
  },
  {
    title: "İlginç.",
    body: "“Bir saniye, gerçekten mi?” dedirten trendler önceliklidir.",
  },
];

export default function AboutPage() {
  return (
    <div className="container-px mx-auto max-w-3xl py-16 md:py-24">
      <div className="flex justify-center">
        <LogoLockup />
      </div>

      <div className="gold-rule mx-auto my-12 max-w-xs" />

      <h1 className="text-center font-serif text-[clamp(2.25rem,5vw,3.5rem)] leading-tight tracking-tight">
        TrendÇevir Hakkında
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed text-secondary">
        TrendÇevir, dünyadaki iş ve tüketici trendlerini Türk girişimciler için
        filtreleyen haftalık bir bültendir. Her Pazartesi sabah 09:00&apos;da,
        yurtdışında çalışan ama Türkiye&apos;de henüz olmayan üç-beş trend
        incelenir, Türk pazarına uyumu skorlanır ve nasıl başlatılacağına dair
        somut yollar sunulur.
      </p>

      <section className="mt-16">
        <h2 className="font-serif text-3xl leading-tight tracking-tight">
          Nasıl Trend Seçiyoruz?
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-secondary">
          Her aday trend beş kriterden geçer:
        </p>

        <ol className="mt-8 space-y-px overflow-hidden rounded-2xl border border-border bg-border">
          {criteria.map((c, i) => (
            <li
              key={c.title}
              className="flex gap-5 bg-surface p-6 md:p-7"
            >
              <span className="font-mono text-lg text-accent tabular">
                0{i + 1}
              </span>
              <div>
                <h3 className="font-serif text-xl leading-snug text-foreground">
                  {c.title}
                </h3>
                <p className="mt-1.5 leading-relaxed text-secondary">{c.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-3xl leading-tight tracking-tight">
          Kim Hazırlıyor?
        </h2>
        <div className="mt-4 space-y-4 text-lg leading-relaxed text-foreground/90">
          <p>
            TrendÇevir küçük bir ekip ve yapay zekâ asistanları tarafından
            hazırlanır. İçeriğin her satırı insan editörden geçer.
          </p>
          <p className="font-serif text-2xl italic text-foreground">
            İmza tek bir isim değil, marka kendisidir.
          </p>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-3xl leading-tight tracking-tight">
          İletişim
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-secondary">
          Soru, geri bildirim, sponsorluk →{" "}
          <Link
            href={`mailto:${siteConfig.contactEmail}`}
            className="text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
          >
            {siteConfig.contactEmail}
          </Link>
        </p>
      </section>
    </div>
  );
}
