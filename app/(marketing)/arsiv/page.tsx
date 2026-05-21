import type { Metadata } from "next";

import { ArchiveBrowser } from "@/components/ArchiveBrowser";
import { getAllIssues } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Arşiv",
  description:
    "TrendÇevir'in tüm geçmiş bültenleri. Dünyadan filtrelenmiş iş trendleri, Türkiye uyum skorlarıyla.",
  alternates: { canonical: "/arsiv" },
};

export default function ArchivePage() {
  const issues = getAllIssues();

  return (
    <div className="container-px mx-auto max-w-6xl py-16 md:py-24">
      <header className="max-w-2xl">
        <p className="kicker">Arşiv</p>
        <h1 className="mt-4 font-serif text-[clamp(2.5rem,6vw,4rem)] leading-[1.05] tracking-tight">
          Şimdiye kadar{" "}
          <span className="italic text-accent">çevirdiklerimiz.</span>
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-secondary">
          Her bülten, dünyadan filtrelenmiş üç-beş trend ve Türkiye uyum
          skorları. En yeniden eskiye doğru sıralı.
        </p>
      </header>

      <div className="gold-rule my-10" />

      <ArchiveBrowser issues={issues} />
    </div>
  );
}
