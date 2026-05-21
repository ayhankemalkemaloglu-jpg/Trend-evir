import { siteConfig } from "@/lib/site";

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
