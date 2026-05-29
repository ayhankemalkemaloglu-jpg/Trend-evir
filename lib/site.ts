/**
 * Central brand + content config for TrendÇevir.
 *
 * TrendÇevir is an ANONYMOUS publication: the brand speaks as "biz".
 * There is no founder, no personal bio. Keep all copy brand-led.
 */

export const siteConfig = {
  name: "TrendÇevir",
  shortName: "TÇ",
  domain: "trendcevir.com",
  url: "https://trendcevir.com",
  locale: "tr_TR",
  tagline: "Dünyada işliyor. Türkiye'de henüz yok.",
  description:
    "Her Pazartesi sabah, yurtdışında çalışan iş trendlerini Türk girişimcilere getiriyoruz. Üç dakikalık okuma, milyon dolarlık fikirler.",
  contactEmail: "iletisim@trendcevir.com",
  // Placeholder — swap with the live beehiiv subscriber count.
  subscriberCount: 847,
  social: {
    instagram: "https://instagram.com/trendcevir",
    x: "https://x.com/trendcevir",
    linkedin: "https://linkedin.com/company/trendcevir",
  },
  stats: {
    countries: 12,
    trends: 47,
    openRate: 62,
  },
} as const;

export type NavLink = { label: string; href: string };

export const navLinks: NavLink[] = [
  { label: "Bülten", href: "/#bulten" },
  { label: "Trendler", href: "/trend" },
  { label: "Arşiv", href: "/arsiv" },
  { label: "Hakkında", href: "/hakkinda" },
];

export const footerLinks: NavLink[] = [
  { label: "Trendler", href: "/trend" },
  { label: "Arşiv", href: "/arsiv" },
  { label: "Hakkında", href: "/hakkinda" },
  { label: "Gizlilik", href: "/gizlilik" },
  { label: "İletişim", href: "/iletisim" },
];
