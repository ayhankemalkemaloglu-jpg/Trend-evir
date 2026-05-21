import Link from "next/link";
import { Instagram, Linkedin } from "lucide-react";

import { Logo } from "@/components/Logo";
import { siteConfig, footerLinks } from "@/lib/site";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface/40">
      <div className="container-px mx-auto max-w-6xl py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-secondary">
              Dünyada çalışan iş trendlerini Türk girişimciler için her hafta
              filtreleyen bağımsız bülten. Üç dakika oku, bir yıl önde başla.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <Link
                href={siteConfig.social.instagram}
                aria-label="TrendÇevir Instagram"
                className="grid size-10 place-items-center rounded-full border border-border text-secondary transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                <Instagram className="size-4" />
              </Link>
              <Link
                href={siteConfig.social.x}
                aria-label="TrendÇevir X"
                className="grid size-10 place-items-center rounded-full border border-border text-secondary transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                <XIcon className="size-3.5" />
              </Link>
              <Link
                href={siteConfig.social.linkedin}
                aria-label="TrendÇevir LinkedIn"
                className="grid size-10 place-items-center rounded-full border border-border text-secondary transition-colors duration-200 hover:border-accent hover:text-accent"
              >
                <Linkedin className="size-4" />
              </Link>
            </div>
          </div>

          <nav aria-label="Alt menü">
            <ul className="grid grid-cols-2 gap-x-12 gap-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary transition-colors duration-200 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="gold-rule my-10" />

        <div className="flex flex-col gap-2 text-xs text-secondary sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {siteConfig.name}. Made in Istanbul.</p>
          <p className="font-mono">{siteConfig.contactEmail}</p>
        </div>
      </div>
    </footer>
  );
}
