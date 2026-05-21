import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";

import { ContactForm } from "@/components/ContactForm";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Soru, geri bildirim veya sponsorluk için TrendÇevir ile iletişime geç.",
  alternates: { canonical: "/iletisim" },
};

export default function ContactPage() {
  return (
    <div className="container-px mx-auto max-w-3xl py-16 md:py-24">
      <p className="kicker">İletişim</p>
      <h1 className="mt-4 font-serif text-[clamp(2.25rem,5vw,3.5rem)] leading-tight tracking-tight">
        Bir fikrin mi var?
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-secondary">
        Soru, geri bildirim, sponsorluk ya da düzeltme — hepsi için buradayız.
        Aşağıdaki formu doldur veya doğrudan e-posta gönder.
      </p>

      <Link
        href={`mailto:${siteConfig.contactEmail}`}
        className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-border bg-surface px-5 py-3 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
      >
        <Mail className="size-4 text-accent" />
        <span className="font-mono">{siteConfig.contactEmail}</span>
      </Link>

      <div className="gold-rule my-12" />

      <ContactForm />
    </div>
  );
}
