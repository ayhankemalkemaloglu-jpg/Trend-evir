import type { MetadataRoute } from "next";
import { getAllIssues } from "@/lib/mdx";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/arsiv", "/hakkinda", "/gizlilik", "/iletisim"].map(
    (path) => ({
      url: `${siteConfig.url}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    }),
  );

  const issues = getAllIssues().map((issue) => ({
    url: `${siteConfig.url}/arsiv/${issue.slug}`,
    lastModified: new Date(issue.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...pages, ...issues];
}
