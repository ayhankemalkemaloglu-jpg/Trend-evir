/**
 * Deterministic, client-side personalisation of a trend's adaptation score.
 * No API call — just reweights the existing breakdown by the reader's profile.
 * Competition is treated as "ease" (10 − intensity) so higher is always better.
 */
import type { BudgetKey, Experience } from "@/lib/ideas";
import type {
  ScoreBreakdownData,
  ScoreDimension,
} from "@/components/trend/ScoreBreakdown";

export type City = "istanbul" | "ankara" | "izmir" | "diger";

export const CITY_OPTIONS = [
  { value: "istanbul", label: "İstanbul" },
  { value: "ankara", label: "Ankara" },
  { value: "izmir", label: "İzmir" },
  { value: "diger", label: "Diğer" },
] as const;

export type Profile = {
  city: City;
  experience: Experience;
  budget: BudgetKey;
};

const BASE_WEIGHTS = {
  demand: 0.35,
  competition: 0.25,
  regulation: 0.2,
  cost: 0.2,
};

const clamp = (n: number) => Math.max(0, Math.min(10, n));

function value(d: ScoreDimension): number {
  return clamp(typeof d === "number" ? d : d.value);
}

export function personalizeScore(
  data: ScoreBreakdownData,
  profile: Profile,
): number {
  let demand = value(data.demand);
  const competitionEase = 10 - value(data.competition);
  const regulation = value(data.regulation);
  const cost = value(data.cost);

  // Big metros lift demand; smaller markets soften it.
  if (profile.city === "istanbul") demand = clamp(demand + 1);
  else if (profile.city === "ankara" || profile.city === "izmir")
    demand = clamp(demand + 0.5);
  else demand = clamp(demand - 0.5);

  const w = { ...BASE_WEIGHTS };

  // Newcomers feel regulation/cost friction more; the experienced lean on demand.
  if (profile.experience === "yeni") {
    w.regulation += 0.05;
    w.cost += 0.05;
    w.demand -= 0.1;
  } else {
    w.demand += 0.1;
    w.cost -= 0.05;
    w.regulation -= 0.05;
  }

  // A tighter budget makes cost suitability matter more.
  if (profile.budget === "10k-50k") {
    w.cost += 0.08;
    w.demand -= 0.08;
  } else if (profile.budget === "200k+") {
    w.cost -= 0.06;
    w.demand += 0.06;
  }

  const wd = Math.max(0, w.demand);
  const wc = Math.max(0, w.competition);
  const wr = Math.max(0, w.regulation);
  const wco = Math.max(0, w.cost);
  const sum = wd + wc + wr + wco || 1;

  const total =
    (demand * wd + competitionEase * wc + regulation * wr + cost * wco) / sum;

  return Math.round(total * 10) / 10; // one decimal
}
