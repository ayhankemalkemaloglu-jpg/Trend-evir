import type { Metadata } from "next";

import { TrendBrowser } from "@/components/TrendBrowser";
import { getAllTrends } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Trendler",
  description:
    "TrendÇevir'de bugüne dek incelenen tüm iş trendleri — Türkiye uyum skorlarıyla, kategoriye göre filtrelenebilir.",
  alternates: { canonical: "/trend" },
};

export default function TrendDirectoryPage() {
  const trends = getAllTrends();

  return (
    <div className="container-px mx-auto max-w-6xl py-16 md:py-24">
      <header className="max-w-2xl">
        <p className="kicker">Trendler</p>
        <h1 className="mt-4 font-serif text-[clamp(2.5rem,6vw,4rem)] leading-[1.05] tracking-tight">
          İncelediğimiz her <span className="italic text-accent">fikir.</span>
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-secondary">
          Dünyada çalışan, Türkiye&apos;de henüz boş olan iş fikirleri. Uyum
          skoruna göre sıralı; kategoriyle daralt, ada göre ara.
        </p>
      </header>

      <div className="gold-rule my-10" />

      <TrendBrowser trends={trends} />
    </div>
  );
}
