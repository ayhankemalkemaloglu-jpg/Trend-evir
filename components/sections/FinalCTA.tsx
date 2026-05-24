import { SignupForm } from "@/components/SignupForm";
import { Reveal } from "@/components/Reveal";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mx-auto h-full w-[60rem] max-w-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in srgb, #d4af37 12%, transparent), transparent 65%)",
        }}
      />
      <div className="container-px relative mx-auto max-w-3xl py-24 text-center md:py-32">
        <Reveal>
          <h2 className="mx-auto max-w-2xl font-serif text-[clamp(2.25rem,5.5vw,4rem)] leading-[1.05] tracking-tight">
            Pazartesi sabahları artık{" "}
            <span className="italic text-accent">aynı olmayacak.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="mx-auto mt-10 max-w-xl">
            <SignupForm source="final-cta" />
            <p className="mt-3 text-sm text-secondary">
              Spam yok, istediğin an çık. Trendleri Türkiye merceğinden oku.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
