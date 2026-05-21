import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { valueProps } from "@/lib/content";

export function ValueProp() {
  return (
    <section className="container-px mx-auto max-w-6xl py-20 md:py-28">
      <Reveal>
        <SectionHeading
          kicker="Bu nedir?"
          title={
            <>
              Bir trend bülteni değil,{" "}
              <span className="italic text-accent">fırsat radarı.</span>
            </>
          }
          intro="Dünyanın dört bir yanından kanıtlanmış iş modellerini bulup Türkiye merceğinden geçiriyoruz."
        />
      </Reveal>

      <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3">
        {valueProps.map((prop, i) => (
          <Reveal
            key={prop.title}
            delay={i * 0.07}
            className="flex flex-col bg-surface p-8 md:p-9"
          >
            <span className="font-mono text-sm text-accent tabular">
              0{i + 1}
            </span>
            <h3 className="mt-5 font-serif text-2xl leading-snug">
              {prop.title}
            </h3>
            <p className="mt-3 text-pretty leading-relaxed text-secondary">
              {prop.body}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
