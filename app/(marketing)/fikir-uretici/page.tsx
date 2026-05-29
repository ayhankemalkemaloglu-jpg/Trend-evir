import type { Metadata } from "next";

import { IdeaGenerator } from "@/components/IdeaGenerator";

export const metadata: Metadata = {
  title: "Fikir Üretici",
  description:
    "Bütçene, ilgi alanına ve şehrine göre Türkiye'de yapılabilir iş fikirleri. TrendÇevir'in incelediği trendlerden sana en uygununu eşleştiriyoruz.",
  alternates: { canonical: "/fikir-uretici" },
};

export default function IdeaGeneratorPage() {
  return (
    <div className="container-px mx-auto max-w-4xl py-16 md:py-24">
      <header className="max-w-2xl">
        <p className="kicker">Fikir Üretici</p>
        <h1 className="mt-4 font-serif text-[clamp(2.5rem,6vw,4rem)] leading-[1.05] tracking-tight">
          Sana göre <span className="italic text-accent">iş fikri.</span>
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-secondary">
          Birkaç soru sor, incelediğimiz trendlerden bütçene ve ilgine en uygun
          üçünü öneriyoruz — her biri için ilk adım ve tahmini maliyetle.
        </p>
      </header>

      <div className="gold-rule my-10" />

      <IdeaGenerator />
    </div>
  );
}
