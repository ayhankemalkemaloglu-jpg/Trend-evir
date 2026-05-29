import type { ComponentProps, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

import { ActionPlan } from "@/components/mdx/ActionPlan";
import { Flag } from "@/components/Flag";
import { cn } from "@/lib/utils";

/* ----------------------------- custom blocks ----------------------------- */

function Trend({
  name,
  country,
  countryCode,
  score,
  category,
  children,
}: {
  name: string;
  country: string;
  countryCode: string;
  score: number;
  category: string;
  children?: ReactNode;
}) {
  return (
    <section className="my-12 scroll-mt-28 rounded-2xl border border-border bg-surface p-6 md:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <Flag code={countryCode} size={34} />
        <p className="font-mono text-xs uppercase tracking-wider text-secondary">
          {country} · {category}
        </p>
        <span className="ml-auto inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3 py-1.5 text-xs text-accent">
          Uyum Skoru
          <span className="font-mono font-semibold tabular">{score}/10</span>
        </span>
      </div>
      <h2 className="mt-4 mb-0 font-serif text-3xl leading-tight tracking-tight md:text-4xl">
        {name}
      </h2>
      {children && (
        <div className="mt-3 text-lg leading-relaxed text-foreground/90 [&>p]:my-3">
          {children}
        </div>
      )}
    </section>
  );
}

function Evidence({ children }: { children?: ReactNode }) {
  return (
    <aside className="my-8 rounded-xl border-l-2 border-accent bg-surface/60 p-6">
      <p className="kicker mb-3">Kanıt</p>
      <div className="text-foreground/90 [&_li]:my-1.5 [&_strong]:text-accent">
        {children}
      </div>
    </aside>
  );
}

function TurkeyAngle({ children }: { children?: ReactNode }) {
  return (
    <aside className="my-8 rounded-xl border border-accent/30 bg-accent/[0.06] p-6">
      <div className="mb-3 flex items-center gap-2.5">
        <Flag code="TR" size={22} />
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
          Türkiye Açısı
        </p>
      </div>
      <div className="text-foreground/90">{children}</div>
    </aside>
  );
}

function RiskFlags({ children }: { children?: ReactNode }) {
  return (
    <aside className="my-8 rounded-xl border border-red-500/25 bg-red-500/[0.05] p-6">
      <div className="mb-3 flex items-center gap-2">
        <AlertTriangle className="size-4 text-red-400" />
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-red-400">
          Risk Bayrakları
        </p>
      </div>
      <div className="text-foreground/90 [&_li]:my-1.5">{children}</div>
    </aside>
  );
}

/* --------------------------- base prose elements --------------------------- */

export const mdxComponents = {
  Trend,
  Evidence,
  TurkeyAngle,
  RiskFlags,
  ActionPlan,
  h2: (props: ComponentProps<"h2">) => (
    <h2
      {...props}
      className="mt-12 mb-4 font-serif text-3xl leading-tight tracking-tight"
    />
  ),
  h3: (props: ComponentProps<"h3">) => (
    <h3 {...props} className="mt-8 mb-3 font-serif text-2xl leading-snug" />
  ),
  p: (props: ComponentProps<"p">) => (
    <p {...props} className="my-5 text-lg leading-relaxed text-foreground/90" />
  ),
  a: ({ className, ...props }: ComponentProps<"a">) => (
    <a
      {...props}
      className={cn(
        "text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent",
        className,
      )}
    />
  ),
  ul: (props: ComponentProps<"ul">) => (
    <ul
      {...props}
      className="my-5 space-y-2 [&>li]:relative [&>li]:pl-6 [&>li]:text-lg [&>li]:leading-relaxed [&>li]:text-foreground/90 [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-3 [&>li]:before:h-px [&>li]:before:w-3.5 [&>li]:before:bg-accent"
    />
  ),
  ol: (props: ComponentProps<"ol">) => (
    <ol
      {...props}
      className="my-5 list-decimal space-y-2 pl-6 marker:font-mono marker:text-accent [&>li]:text-lg [&>li]:leading-relaxed [&>li]:text-foreground/90"
    />
  ),
  strong: (props: ComponentProps<"strong">) => (
    <strong {...props} className="font-semibold text-foreground" />
  ),
  blockquote: (props: ComponentProps<"blockquote">) => (
    <blockquote
      {...props}
      className="my-8 border-l-2 border-accent pl-6 font-serif text-2xl italic leading-snug text-foreground"
    />
  ),
  hr: () => <div className="gold-rule my-12" />,
};
