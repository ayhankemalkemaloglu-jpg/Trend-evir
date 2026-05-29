"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Loader2, RotateCcw, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackEvent } from "@/lib/analytics";
import {
  BUDGET_OPTIONS,
  EXPERIENCE_OPTIONS,
  INTEREST_MAX,
  type BudgetKey,
  type Experience,
  type Idea,
} from "@/lib/ideas";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "done" | "error";

export function IdeaGenerator() {
  const reduce = useReducedMotion();
  const [budget, setBudget] = useState<BudgetKey>("10k-50k");
  const [interest, setInterest] = useState("");
  const [city, setCity] = useState("");
  const [experience, setExperience] = useState<Experience>("yeni");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [ideas, setIdeas] = useState<Idea[]>([]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");
    trackEvent("ideas_generated", { budget, experience });

    try {
      const res = await fetch("/api/generate-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ budget, interest, city, experience, website }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        ideas?: Idea[];
        message?: string;
      };

      if (res.ok && data.ok && data.ideas?.length) {
        setIdeas(data.ideas);
        setStatus("done");
        return;
      }
      setStatus("error");
      setMessage(data.message ?? "Bir şeyler ters gitti. Tekrar dener misin?");
    } catch {
      setStatus("error");
      setMessage("Bağlantı kurulamadı. Tekrar dener misin?");
    }
  }

  function reset() {
    setStatus("idle");
    setIdeas([]);
    setMessage("");
  }

  if (status === "done") {
    return (
      <div>
        <div className="grid gap-6 md:grid-cols-3">
          {ideas.map((idea, i) => (
            <motion.article
              key={idea.slug}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
              className="flex flex-col rounded-2xl border border-border bg-surface p-6"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[0.7rem] uppercase tracking-wider text-secondary">
                  Öneri {i + 1}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/5 px-2.5 py-1 text-xs text-accent">
                  Uyum
                  <span className="font-mono font-semibold tabular">
                    {idea.score}/10
                  </span>
                </span>
              </div>
              <h3 className="mt-3 font-serif text-2xl leading-snug">
                {idea.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                {idea.why}
              </p>

              <dl className="mt-4 space-y-2 text-sm">
                <div>
                  <dt className="kicker">İlk adım</dt>
                  <dd className="mt-1 text-secondary">{idea.firstStep}</dd>
                </div>
                <div>
                  <dt className="kicker">Tahmini maliyet</dt>
                  <dd className="mt-1 font-mono text-secondary">
                    {idea.estimatedCost}
                  </dd>
                </div>
              </dl>

              <Link
                href={`/trend/${idea.slug}`}
                className="mt-5 inline-flex items-center gap-1.5 text-sm text-accent underline-offset-4 hover:underline"
              >
                Detayları gör
                <ArrowRight className="size-4" />
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="size-4" />
            Tekrar dene
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="idea-budget" className="mb-2 block text-sm text-secondary">
            Bütçen
          </label>
          <select
            id="idea-budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value as BudgetKey)}
            className="h-14 w-full rounded-full border border-border bg-surface px-5 text-base text-foreground outline-none transition-colors focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent"
          >
            {BUDGET_OPTIONS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="idea-city" className="mb-2 block text-sm text-secondary">
            Şehir <span className="text-secondary/60">(opsiyonel)</span>
          </label>
          <Input
            id="idea-city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            maxLength={60}
            placeholder="İstanbul"
            autoComplete="address-level2"
          />
        </div>
      </div>

      <div>
        <label htmlFor="idea-interest" className="mb-2 block text-sm text-secondary">
          İlgi alanın
        </label>
        <textarea
          id="idea-interest"
          required
          rows={3}
          maxLength={INTEREST_MAX}
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          placeholder="Örn. yeme-içme, perakende, teknolojiyle ilgileniyorum; küçük bir kafem var…"
          className="flex w-full rounded-2xl border border-border bg-surface px-5 py-3.5 text-base text-foreground placeholder:text-secondary/70 transition-colors focus-visible:border-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
        />
        <p className="mt-1.5 text-right font-mono text-xs text-secondary/70">
          {interest.length}/{INTEREST_MAX}
        </p>
      </div>

      <div>
        <span className="mb-2 block text-sm text-secondary">Deneyimin</span>
        <div className="flex flex-wrap gap-2.5">
          {EXPERIENCE_OPTIONS.map((opt) => {
            const active = experience === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setExperience(opt.value)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-colors duration-200",
                  active
                    ? "border-accent bg-accent font-medium text-background"
                    : "border-border text-secondary hover:border-accent/50 hover:text-foreground",
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Honeypot */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="idea-website">Web siten</label>
        <input
          id="idea-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm text-red-400">
          {message}
        </p>
      )}

      <Button type="submit" size="lg" disabled={status === "loading"}>
        {status === "loading" ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Fikirler aranıyor…
          </>
        ) : (
          <>
            <Sparkles className="size-4" />
            Fikir üret
          </>
        )}
      </Button>
    </form>
  );
}
