import { describe, expect, it } from "vitest";

import {
  getAllIssues,
  getAllTrends,
  getTrendBySlug,
  isPremium,
  trendSlug,
} from "@/lib/mdx";

const SLUG_RE = /^[a-z0-9-]+$/;

describe("trendSlug", () => {
  it("slugifies plain names", () => {
    expect(trendSlug("Blind Box Vending")).toBe("blind-box-vending");
    expect(trendSlug("Sleep Tourism Otelleri")).toBe("sleep-tourism-otelleri");
  });

  it("transliterates Turkish characters", () => {
    expect(trendSlug("Fonksiyonel Su Barları")).toBe("fonksiyonel-su-barlari");
    expect(trendSlug("Çağrı Öneri Şşş")).toBe("cagri-oneri-sss");
  });

  it("only ever emits url-safe characters", () => {
    expect(trendSlug("Ölçü & İğne / Üçgen!")).toMatch(SLUG_RE);
    expect(trendSlug("  trim---me  ")).toMatch(SLUG_RE);
  });
});

describe("trend index (real content)", () => {
  it("derives trends with valid slugs and scores", () => {
    const trends = getAllTrends();
    expect(trends.length).toBeGreaterThan(0);
    for (const t of trends) {
      expect(t.slug).toMatch(SLUG_RE);
      expect(t.score).toBeGreaterThanOrEqual(0);
      expect(t.score).toBeLessThanOrEqual(10);
      expect(t.issues.length).toBeGreaterThan(0);
    }
  });

  it("looks a trend up by slug", () => {
    const trend = getTrendBySlug("blind-box-vending");
    expect(trend?.name).toBe("Blind Box Vending");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getTrendBySlug("does-not-exist")).toBeUndefined();
  });
});

describe("isPremium", () => {
  it("keeps the newest issues free and gates the oldest", () => {
    const issues = getAllIssues(); // newest first
    expect(issues[0].premium).toBe(false);
    expect(issues.at(-1)?.premium).toBe(true);
    expect(isPremium(issues[0].slug)).toBe(false);
    expect(isPremium(issues.at(-1)!.slug)).toBe(true);
  });
});
