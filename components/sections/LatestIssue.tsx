import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { CoverArt } from "@/components/CoverArt";
import { getLatestIssue } from "@/lib/mdx";
import { formatDateTR, issueNo } from "@/lib/format";

export function LatestIssue() {
  const latest = getLatestIssue();
  if (!latest) return null;

  return (
    <section className="border-t border-border bg-surface/30">
      <div className="container-px mx-auto max-w-6xl py-20 md:py-28">
        <Reveal>
          <SectionHeading kicker="Son Bülten" title="Bu hafta masada ne var?" />
        </Reveal>

        <Reveal delay={0.08} className="mt-12">
          <Link
            href={`/arsiv/${latest.slug}`}
            className="group grid overflow-hidden rounded-2xl border border-border bg-surface transition-colors duration-300 hover:border-accent/50 md:grid-cols-2"
          >
            <CoverArt
              tint={latest.tint}
              rounded="rounded-none"
              className="aspect-[16/10] md:aspect-auto md:h-full"
            >
              <div className="absolute bottom-5 left-5">
                <span className="rounded-full bg-background/60 px-3 py-1 font-mono text-xs text-accent backdrop-blur-sm">
                  {issueNo(latest.issue)}
                </span>
              </div>
            </CoverArt>

            <div className="flex flex-col justify-center p-8 md:p-12">
              <p className="font-mono text-xs uppercase tracking-wider text-secondary">
                {formatDateTR(latest.date)} · {latest.readingMinutes} dk okuma
              </p>
              <h3 className="mt-4 font-serif text-3xl leading-tight md:text-4xl">
                {latest.title}
              </h3>

              <ul className="mt-6 space-y-2.5">
                {latest.trends.slice(0, 3).map((trend) => (
                  <li
                    key={trend}
                    className="flex items-center gap-3 text-secondary"
                  >
                    <span aria-hidden className="h-px w-5 bg-accent/60" />
                    <span>{trend}</span>
                  </li>
                ))}
              </ul>

              <span className="mt-8 inline-flex items-center gap-2 font-medium text-accent">
                Tam bülteni oku
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
