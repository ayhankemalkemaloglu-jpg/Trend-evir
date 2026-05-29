import { siteConfig } from "@/lib/site";
import type { IssueMeta } from "@/lib/mdx";

/** Organization schema — intentionally has NO founder field (anonymous brand). */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    email: siteConfig.contactEmail,
    foundingLocation: "İstanbul, Türkiye",
    sameAs: [
      siteConfig.social.instagram,
      siteConfig.social.x,
      siteConfig.social.linkedin,
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "tr-TR",
  };
}

/** Article schema — author is the editorial team, never an individual. */
export function articleSchema(meta: IssueMeta) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.excerpt,
    datePublished: meta.date,
    dateModified: meta.date,
    inLanguage: "tr-TR",
    author: { "@type": "Organization", name: "TrendÇevir Yazı İşleri" },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: `${siteConfig.url}/arsiv/${meta.slug}`,
  };
}

/** Article schema for a trend page — author is the editorial team, never a person. */
export function trendSchema(trend: {
  name: string;
  description: string;
  slug: string;
  date?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: trend.name,
    description: trend.description,
    ...(trend.date ? { datePublished: trend.date } : {}),
    inLanguage: "tr-TR",
    author: { "@type": "Organization", name: "TrendÇevir Yazı İşleri" },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: `${siteConfig.url}/trend/${trend.slug}`,
  };
}
