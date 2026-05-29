import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { CoverArt } from "@/components/CoverArt";
import { Flag } from "@/components/Flag";
import { IssueCard } from "@/components/IssueCard";
import { JsonLd } from "@/components/JsonLd";
import { SignupForm } from "@/components/SignupForm";
import { getTrendBySlug, getTrendSlugs } from "@/lib/mdx";
import { trendSchema } from "@/lib/jsonld";

export const dynamicParams = false;

export function generateStaticParams() {
  return getTrendSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const trend = getTrendBySlug(slug);
  if (!trend) return {};
  return {
    title: `${trend.name} — Türkiye uyum analizi`,
    description: trend.description,
    alternates: { canonical: `/trend/${slug}` },
    openGraph: {
      type: "article",
      title: trend.name,
      description: trend.description,
      url: `/trend/${slug}`,
    },
  };
}

export default async function TrendPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trend = getTrendBySlug(slug);
  if (!trend) notFound();

  const latest = trend.issues[0];

  return (
    <>
      <JsonLd
        data={trendSchema({
          name: trend.name,
          description: trend.description,
          slug: trend.slug,
          date: latest?.date,
        })}
      />

      <article className="container-px mx-auto max-w-3xl py-16 md:py-20">
        <Link
          href="/trend"
          className="inline-flex items-center gap-2 text-sm text-secondary transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-4" />
          Tüm trendler
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Flag code={trend.countryCode} size={34} />
          <p className="font-mono text-xs uppercase tracking-wider text-secondary">
            {trend.country} · {trend.category}
          </p>
          <span className="ml-auto inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3 py-1.5 text-xs text-accent">
            Türkiye Uyum Skoru
            <span className="font-mono font-semibold tabular">
              {trend.score}/10
            </span>
          </span>
        </div>

        <h1 className="mt-5 font-serif text-[clamp(2.25rem,5.5vw,3.75rem)] leading-[1.06] tracking-tight">
          {trend.name}
        </h1>
        <p className="mt-5 text-xl leading-relaxed text-secondary">
          {trend.description}
        </p>

        {latest && (
          <CoverArt tint={latest.tint} className="mt-10 aspect-[16/8]">
            <div className="absolute bottom-5 left-5">
              <span className="rounded-full bg-background/55 px-3 py-1 font-mono text-xs text-accent backdrop-blur-sm">
                {trend.category}
              </span>
            </div>
          </CoverArt>
        )}

        <div className="gold-rule my-12" />

        <section aria-labelledby="bultenler-baslik">
          <h2
            id="bultenler-baslik"
            className="font-serif text-2xl leading-snug md:text-3xl"
          >
            Bu trendi anlatan bültenler
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {trend.issues.map((issue) => (
              <IssueCard key={issue.slug} issue={issue} />
            ))}
          </div>
        </section>

        {/* Signup CTA */}
        <div className="mt-14 rounded-2xl border border-border bg-surface p-8 text-center md:p-10">
          <h2 className="font-serif text-2xl leading-snug md:text-3xl">
            Bunun gibi trendleri ilk sen gör.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-secondary">
            Her Pazartesi 09:00&apos;da, dünyadan filtrelenmiş trendler kutunda.
          </p>
          <div className="mx-auto mt-6 max-w-md">
            <SignupForm source={`trend-${slug}`} />
          </div>
        </div>
      </article>
    </>
  );
}
