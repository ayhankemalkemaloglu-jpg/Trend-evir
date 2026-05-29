/** Shared types + options for the AI idea generator (D.1). */

export const BUDGET_OPTIONS = [
  { value: "10k-50k", label: "10.000–50.000 ₺" },
  { value: "50k-200k", label: "50.000–200.000 ₺" },
  { value: "200k+", label: "200.000 ₺ ve üzeri" },
] as const;

export type BudgetKey = (typeof BUDGET_OPTIONS)[number]["value"];

export const EXPERIENCE_OPTIONS = [
  { value: "yeni", label: "Yeni başlıyorum" },
  { value: "deneyimli", label: "Deneyimliyim" },
] as const;

export type Experience = (typeof EXPERIENCE_OPTIONS)[number]["value"];

export interface IdeaRequest {
  budget: BudgetKey;
  interest: string;
  city?: string;
  experience: Experience;
  /** Honeypot — must stay empty. */
  website?: string;
}

export interface Idea {
  slug: string;
  name: string;
  /** Why this fits the user — 1–2 sentences. */
  why: string;
  /** First concrete step — 1 sentence. */
  firstStep: string;
  /** Estimated starting cost, e.g. "150.000 ₺". */
  estimatedCost: string;
  /** Türkiye uyum skoru, enriched server-side from the trend index. */
  score: number;
}

export const INTEREST_MAX = 200;
