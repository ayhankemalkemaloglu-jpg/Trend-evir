"use client";

import { useRef, type ReactNode } from "react";
import { Clock, Download, Wallet } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

type ActionPlanProps = {
  /** e.g. "10.000–50.000 ₺" */
  budget?: string;
  /** e.g. "4–8 hafta" */
  timeline?: string;
  /** "Kolay" | "Orta" | "Zor" (free text; dot colour is derived) */
  difficulty?: string;
  /** Optional plan title, used in the downloaded file heading. */
  title?: string;
  children?: ReactNode;
};

/** Difficulty → status-dot colour. Falls back to the gold accent. */
function difficultyDot(difficulty?: string): string {
  switch (difficulty?.trim().toLocaleLowerCase("tr")) {
    case "kolay":
      return "bg-success";
    case "zor":
      return "bg-red-400";
    default:
      return "bg-accent";
  }
}

function Badge({
  icon,
  label,
  value,
  dot,
}: {
  icon?: ReactNode;
  label: string;
  value: string;
  dot?: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-3 py-1.5 text-xs">
      {dot ? (
        <span aria-hidden className={`size-2 rounded-full ${dot}`} />
      ) : (
        icon
      )}
      <span className="text-secondary">{label}</span>
      <span className="font-mono font-medium text-foreground">{value}</span>
    </span>
  );
}

/**
 * Editorial "Aksiyon Planı" card for MDX issues. Renders a markdown list of
 * concrete next steps and lets the reader download a Notion-compatible
 * markdown checklist (todo items as `- [ ]`).
 *
 * The checklist is derived from the rendered list items at click time, so
 * authors only ever write a plain markdown list inside the component.
 */
export function ActionPlan({
  budget,
  timeline,
  difficulty,
  title,
  children,
}: ActionPlanProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  function buildMarkdown(): string {
    const lines: string[] = [];
    lines.push(`# Aksiyon Planı${title ? `: ${title}` : ""}`, "");

    const meta: string[] = [];
    if (budget) meta.push(`**Bütçe:** ${budget}`);
    if (timeline) meta.push(`**Süre:** ${timeline}`);
    if (difficulty) meta.push(`**Zorluk:** ${difficulty}`);
    if (meta.length) lines.push(meta.join("  \n"), "");

    const items = contentRef.current
      ? Array.from(contentRef.current.querySelectorAll("li"))
          .map((li) => li.textContent?.trim() ?? "")
          .filter(Boolean)
      : [];

    if (items.length) {
      for (const item of items) lines.push(`- [ ] ${item}`);
    } else {
      // Fallback: any text content, split into lines.
      const text = contentRef.current?.textContent?.trim() ?? "";
      for (const line of text.split("\n").map((l) => l.trim()).filter(Boolean)) {
        lines.push(`- [ ] ${line}`);
      }
    }

    lines.push("", "---", "Kaynak: TrendÇevir · trendcevir.com");
    return lines.join("\n");
  }

  function onDownload() {
    trackEvent("checklist_downloaded", title ? { title } : undefined);
    const markdown = buildMarkdown();
    const href = `data:text/markdown;charset=utf-8,${encodeURIComponent(markdown)}`;
    const a = document.createElement("a");
    a.href = href;
    a.download = "trendcevir-aksiyon-plani.md";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <Reveal>
      <section className="my-10 rounded-2xl border border-border border-l-2 border-l-accent bg-surface p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <p className="kicker">Aksiyon Planı</p>
          <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
            aria-label="Aksiyon planını checklist olarak indir"
          >
            <Download className="size-4" />
            Checklist İndir
          </Button>
        </div>

        {(budget || timeline || difficulty) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {budget && (
              <Badge
                icon={<Wallet className="size-3.5 text-accent" />}
                label="Bütçe"
                value={budget}
              />
            )}
            {timeline && (
              <Badge
                icon={<Clock className="size-3.5 text-accent" />}
                label="Süre"
                value={timeline}
              />
            )}
            {difficulty && (
              <Badge
                dot={difficultyDot(difficulty)}
                label="Zorluk"
                value={difficulty}
              />
            )}
          </div>
        )}

        {children && (
          <div
            ref={contentRef}
            className="mt-5 text-foreground/90 [&_ol]:my-0 [&_ul]:my-0"
          >
            {children}
          </div>
        )}
      </section>
    </Reveal>
  );
}
