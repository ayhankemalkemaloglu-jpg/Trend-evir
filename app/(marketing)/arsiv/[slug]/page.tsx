import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { CoverArt } from "@/components/CoverArt";
import { AppliedStories } from "@/components/AppliedStories";
import { IssueSummary } from "@/components/IssueSummary";
import { ReadingProgress } from "@/components/ReadingProgress";
import { ShareButton } from "@/components/ShareButton";
import { ShareSnippet } from "@/components/ShareSnippet";
import { SignupForm } from "@/components/SignupForm";
import { JsonLd } from "@/components/JsonLd";
import { mdxComponents } from "@/components/mdx/mdx-components";
import {
  getAdjacentIssues,
  getAllTrends,
  getIssueMeta,
  getIssueSlugs,
  getIssueSource,
} from "@/lib/mdx";
import { remarkAutolinkTrends } from "@/lib/remark-autolink-trends";
import { formatDateTR, issueNo } from "@/lib/format";
import { articleSchema } from "@/lib/jsonld";
import { siteConfig } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getIssueSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!getIssueSlugs().includes(slug)) return {};
  const meta = getIssueMeta(slug);
  return {
    title: meta.title,
    description: meta.excerpt,
    alternates: { canonical: `/arsiv/${slug}` },
    openGraph: {
      type: "article",
      title: meta.title,
      description: meta.excerpt,
      url: `/arsiv/${slug}`,
      publishedTime: meta.date,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.excerpt,
    },
  };
}

export default async function IssuePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getIssueSlugs().includes(slug)) notFound();

  const meta = getIssueMeta(slug);
  const { older, newer } = getAdjacentIssues(slug);

  const shareUrl = `${siteConfig.url}/arsiv/${slug}`;
  const shareLines = [`"${meta.title}" — dünyada işliyor, Türkiye'de henüz yok.`];
  if (meta.trends.length)
    shareLines.push(`Bu sayıda: ${meta.trends.join(" · ")} 🇹🇷`);
  shareLines.push(`→ ${shareUrl}`, "#TrendÇevir #Girişim");
  const shareSnippet = shareLines.join("\n");

  // Link the first prose mention of any known trend to its /trend/[slug] hub.
  // The custom <Trend> blocks are skipped by the plugin, so only narrative
  // text (e.g. the wrap-up paragraph) is touched.
  const trendRefs = getAllTrends().map((t) => ({ name: t.name, slug: t.slug }));

  const { content } = await compileMDX({
    source: getIssueSource(slug),
    components: mdxComponents,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [
          remarkGfm,
          [remarkAutolinkTrends, { trends: trendRefs }],
        ],
      },
    },
  });

  return (
    <>
      <ReadingProgress slug={slug} />
      <JsonLd data={articleSchema(meta)} />

      <article className="container-px mx-auto max-w-3xl py-16 md:py-20">
        <Link
          href="/arsiv"
          className="inline-flex items-center gap-2 text-sm text-secondary transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-4" />
          Arşiv
        </Link>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-xs uppercase tracking-wider text-secondary">
            {issueNo(meta.issue)} · {formatDateTR(meta.date)} ·{" "}
            {meta.readingMinutes} dakika okuma
          </p>
          <ShareButton title={meta.title} slug={slug} />
        </div>

        <h1 className="mt-5 font-serif text-[clamp(2.25rem,5.5vw,3.75rem)] leading-[1.06] tracking-tight">
          {meta.title}
        </h1>
        <p className="mt-5 text-xl leading-relaxed text-secondary">
          {meta.excerpt}
        </p>

        <CoverArt
          tint={meta.tint}
          className="mt-10 aspect-[16/8]"
        >
          <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
            {meta.categories.map((cat) => (
              <span
                key={cat}
                className="rounded-full bg-background/55 px-3 py-1 font-mono text-xs text-accent backdrop-blur-sm"
              >
                {cat}
              </span>
            ))}
          </div>
        </CoverArt>

        <IssueSummary
          excerpt={meta.excerpt}
          trends={meta.trends}
          readingMinutes={meta.readingMinutes}
        />

        <div className="mt-12">{content}</div>

        <div className="gold-rule my-12" />
        <p className="font-serif text-xl italic text-secondary">
          — TrendÇevir Yazı İşleri
        </p>

        <ShareSnippet snippet={shareSnippet} slug={slug} />

        <AppliedStories stories={meta.stories} />

        {/* Signup CTA */}
        <div className="mt-12 rounded-2xl border border-border bg-surface p-8 text-center md:p-10">
          <h2 className="font-serif text-2xl leading-snug md:text-3xl">
            Bir sonraki bülteni kaçırma.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-secondary">
            Her Pazartesi 09:00&apos;da, dünyadan filtrelenmiş trendler kutunda.
          </p>
          <div className="mx-auto mt-6 max-w-md">
            <SignupForm source={`issue-${slug}`} />
          </div>
        </div>

        {/* Prev / next */}
        {(older || newer) && (
          <nav
            aria-label="Bültenler arası gezinme"
            className="mt-12 grid gap-4 sm:grid-cols-2"
          >
            {older ? (
              <Link
                href={`/arsiv/${older.slug}`}
                className="group rounded-xl border border-border bg-surface p-5 transition-colors hover:border-accent/50"
              >
                <span className="inline-flex items-center gap-1.5 text-xs text-secondary">
                  <ArrowLeft className="size-3.5" />
                  Önceki Bülten
                </span>
                <p className="mt-2 font-serif text-lg leading-snug transition-colors group-hover:text-accent">
                  {older.title}
                </p>
              </Link>
            ) : (
              <span />
            )}
            {newer ? (
              <Link
                href={`/arsiv/${newer.slug}`}
                className="group rounded-xl border border-border bg-surface p-5 text-right transition-colors hover:border-accent/50 sm:text-right"
              >
                <span className="inline-flex items-center gap-1.5 text-xs text-secondary">
                  Sonraki Bülten
                  <ArrowRight className="size-3.5" />
                </span>
                <p className="mt-2 font-serif text-lg leading-snug transition-colors group-hover:text-accent">
                  {newer.title}
                </p>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </article>
    </>
  );
}
