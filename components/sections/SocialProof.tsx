import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { testimonials, mediaMentions } from "@/lib/content";

export function SocialProof() {
  return (
    <section className="container-px mx-auto max-w-6xl py-20 md:py-28">
      <Reveal>
        <SectionHeading
          kicker="Abonelerden"
          title="Girişimciler ne diyor?"
          align="center"
        />
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal
            key={t.name}
            delay={i * 0.07}
            className="flex flex-col rounded-2xl border border-border bg-surface p-7"
          >
            <span aria-hidden className="font-serif text-5xl leading-none text-accent/50">
              &ldquo;
            </span>
            <blockquote className="mt-2 flex-1 text-pretty leading-relaxed text-foreground/90">
              {t.quote}
            </blockquote>
            <figcaption className="mt-6 border-t border-border pt-5">
              <p className="font-medium text-foreground">{t.name}</p>
              <p className="text-sm text-secondary">{t.role}</p>
            </figcaption>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-16">
          <p className="text-center font-mono text-xs uppercase tracking-[0.2em] text-secondary">
            Hakkımızda yazıldı
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {mediaMentions.map((name) => (
              <span
                key={name}
                className="font-serif text-xl text-secondary/70 transition-colors duration-200 hover:text-secondary"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
