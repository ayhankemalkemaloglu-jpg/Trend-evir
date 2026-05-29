import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import type { IssueStory } from "@/lib/mdx";

/**
 * "Bu trendi uygulayanlar" — anonymous reader stories (city + sector +
 * outcome). No founder names, per brand rule. Plain server component.
 */
export function AppliedStories({ stories }: { stories: IssueStory[] }) {
  if (stories.length === 0) return null;

  return (
    <section aria-labelledby="uygulayanlar-baslik" className="mt-12">
      <h2
        id="uygulayanlar-baslik"
        className="font-serif text-2xl leading-snug md:text-3xl"
      >
        Bu trendi uygulayanlar
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {stories.map((s, i) => (
          <figure
            key={i}
            className="flex flex-col rounded-2xl border border-border bg-surface p-6"
          >
            <blockquote className="flex-1 text-pretty leading-relaxed text-foreground/90">
              {s.result}
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-2 border-t border-border pt-4 text-sm text-secondary">
              <MapPin className="size-4 text-accent" />
              {[s.city, s.sector].filter(Boolean).join(" · ")}
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-5 text-sm text-secondary">
        Sen de bir trendi denedin mi?{" "}
        <Link
          href="/iletisim"
          className="inline-flex items-center gap-1 text-accent underline-offset-4 hover:underline"
        >
          Hikâyeni anlat
          <ArrowRight className="size-3.5" />
        </Link>
      </p>
    </section>
  );
}
