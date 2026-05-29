import { describe, expect, it } from "vitest";

import { personalizeScore, type Profile } from "@/lib/scoring";
import type { ScoreBreakdownData } from "@/components/trend/ScoreBreakdown";

const balanced: ScoreBreakdownData = {
  demand: 6,
  competition: 5,
  regulation: 6,
  cost: 6,
};

const base: Profile = { city: "diger", experience: "deneyimli", budget: "50k-200k" };

describe("personalizeScore", () => {
  it("stays within 0–10", () => {
    const s = personalizeScore(balanced, base);
    expect(s).toBeGreaterThanOrEqual(0);
    expect(s).toBeLessThanOrEqual(10);
  });

  it("rewards lower competition (inverted in the total)", () => {
    const low = personalizeScore({ ...balanced, competition: 2 }, base);
    const high = personalizeScore({ ...balanced, competition: 9 }, base);
    expect(low).toBeGreaterThan(high);
  });

  it("boosts demand for big metros vs. elsewhere", () => {
    const ist = personalizeScore(balanced, { ...base, city: "istanbul" });
    const other = personalizeScore(balanced, { ...base, city: "diger" });
    expect(ist).toBeGreaterThan(other);
  });

  it("weights cost suitability higher on a tight budget", () => {
    const costHeavy: ScoreBreakdownData = {
      demand: 2,
      competition: 5,
      regulation: 5,
      cost: 10,
    };
    const tight = personalizeScore(costHeavy, { ...base, budget: "10k-50k" });
    const roomy = personalizeScore(costHeavy, { ...base, budget: "200k+" });
    expect(tight).toBeGreaterThan(roomy);
  });

  it("clamps out-of-range values and accepts the {value} form", () => {
    const s = personalizeScore(
      { demand: 15, competition: -3, regulation: { value: 20 }, cost: 6 },
      base,
    );
    expect(s).toBeGreaterThanOrEqual(0);
    expect(s).toBeLessThanOrEqual(10);
  });

  it("ignores the note in a dimension object", () => {
    const withNote = personalizeScore(
      { ...balanced, regulation: { value: 7, note: "açıklama" } },
      base,
    );
    const plain = personalizeScore({ ...balanced, regulation: 7 }, base);
    expect(withNote).toBe(plain);
  });
});
