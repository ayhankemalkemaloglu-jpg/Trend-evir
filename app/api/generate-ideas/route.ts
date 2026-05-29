import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

import { getAllTrends } from "@/lib/mdx";
import {
  BUDGET_OPTIONS,
  EXPERIENCE_OPTIONS,
  INTEREST_MAX,
  type Idea,
} from "@/lib/ideas";

// Best-effort in-memory rate limit (3 / minute / IP). Resets per server
// instance — swap for Vercel KV or similar in production.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  return (
    xff?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown"
  );
}

const SYSTEM = `Sen TrendÇevir'in fikir eşleştiricisisin. TrendÇevir, dünyada çalışan ama Türkiye'de henüz olmayan iş trendlerini Türk girişimcilere getiren anonim bir yayındır.

KURALLAR:
- Yalnızca sana verilen trend listesinden seç. Liste dışı fikir uydurma.
- Her öneride trendin TAM slug'ını ("slug" alanı) birebir kullan.
- Kullanıcının bütçesine, ilgi alanına, şehrine ve deneyimine en uygun (en fazla 3) trendi seç; uygun trend azsa daha az öner.
- Tüm metinler Türkçe, somut ve "biz" diliyle. Kişisel imza, kurucu adı yok.
- Çıktıyı yalnızca "öneri_sun" aracıyla ver.`;

const ideaTool: Anthropic.Tool = {
  name: "öneri_sun",
  description:
    "Kullanıcıya en uygun trendleri (en fazla 3) gerekçeleriyle öner.",
  input_schema: {
    type: "object",
    properties: {
      ideas: {
        type: "array",
        maxItems: 3,
        items: {
          type: "object",
          properties: {
            slug: {
              type: "string",
              description: "Verilen listeden trendin tam slug değeri.",
            },
            name: { type: "string", description: "Trendin adı." },
            why: {
              type: "string",
              description: "Bu kullanıcıya neden uygun, 1–2 cümle.",
            },
            firstStep: {
              type: "string",
              description: "Atılacak ilk somut adım, tek cümle.",
            },
            estimatedCost: {
              type: "string",
              description: "Tahmini başlangıç maliyeti, örn. '150.000 ₺'.",
            },
          },
          required: ["slug", "name", "why", "firstStep", "estimatedCost"],
        },
      },
    },
    required: ["ideas"],
  },
};

const VALID_BUDGETS = new Set<string>(BUDGET_OPTIONS.map((b) => b.value));
const VALID_EXPERIENCE = new Set<string>(EXPERIENCE_OPTIONS.map((e) => e.value));

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Geçersiz istek." },
      { status: 400 },
    );
  }

  const { budget, interest, city, experience, website } = (body ?? {}) as {
    budget?: unknown;
    interest?: unknown;
    city?: unknown;
    experience?: unknown;
    website?: unknown;
  };

  // Honeypot — bots fill this hidden field.
  if (typeof website === "string" && website.trim() !== "") {
    return NextResponse.json({ ok: true, ideas: [] });
  }

  if (
    typeof budget !== "string" ||
    !VALID_BUDGETS.has(budget) ||
    typeof experience !== "string" ||
    !VALID_EXPERIENCE.has(experience) ||
    typeof interest !== "string" ||
    interest.trim().length < 2
  ) {
    return NextResponse.json(
      { ok: false, message: "Lütfen bütçe, ilgi alanı ve deneyim alanlarını doldur." },
      { status: 422 },
    );
  }

  if (rateLimited(clientIp(request))) {
    return NextResponse.json(
      { ok: false, message: "Çok hızlı denedin. Bir dakika sonra tekrar dene." },
      { status: 429 },
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { ok: false, message: "Fikir üretici şu an yapılandırılmadı." },
      { status: 503 },
    );
  }

  const trends = getAllTrends();
  const bySlug = new Map(trends.map((t) => [t.slug, t]));
  const catalogue = trends.map((t) => ({
    slug: t.slug,
    name: t.name,
    country: t.country,
    category: t.category,
    score: t.score,
    description: t.description,
  }));

  const budgetLabel = BUDGET_OPTIONS.find((b) => b.value === budget)?.label;
  const experienceLabel = EXPERIENCE_OPTIONS.find(
    (e) => e.value === experience,
  )?.label;
  const cityText =
    typeof city === "string" && city.trim() ? city.trim().slice(0, 60) : "belirtilmedi";

  const userPrompt = `Kullanıcı profili:
- Bütçe: ${budgetLabel}
- İlgi alanı: ${interest.trim().slice(0, INTEREST_MAX)}
- Şehir: ${cityText}
- Deneyim: ${experienceLabel}

Trend listesi (yalnızca buradan seç):
${JSON.stringify(catalogue)}

Bu kullanıcıya en uygun trendleri öner.`;

  try {
    const client = new Anthropic({ maxRetries: 1, timeout: 25_000 });
    const msg = await client.messages.create({
      model: process.env.ANTHROPIC_IDEAS_MODEL || "claude-haiku-4-5-20251001",
      max_tokens: 1500,
      system: SYSTEM,
      tools: [ideaTool],
      tool_choice: { type: "tool", name: ideaTool.name },
      messages: [{ role: "user", content: userPrompt }],
    });

    const toolUse = msg.content.find((b) => b.type === "tool_use");
    const raw = (toolUse?.type === "tool_use" ? toolUse.input : undefined) as
      | { ideas?: unknown[] }
      | undefined;

    const ideas: Idea[] = (raw?.ideas ?? [])
      .map((entry) => {
        const e = entry as Partial<Idea>;
        const trend = e.slug ? bySlug.get(e.slug) : undefined;
        if (!trend) return null;
        return {
          slug: trend.slug,
          name: trend.name,
          why: String(e.why ?? ""),
          firstStep: String(e.firstStep ?? ""),
          estimatedCost: String(e.estimatedCost ?? ""),
          score: trend.score,
        } satisfies Idea;
      })
      .filter((x): x is Idea => x !== null)
      .slice(0, 3);

    if (ideas.length === 0) {
      return NextResponse.json(
        { ok: false, message: "Sana uygun bir trend bulamadık. Farklı bir ilgi alanı dene." },
        { status: 200 },
      );
    }

    return NextResponse.json({ ok: true, ideas });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Fikirler üretilemedi. Tekrar dener misin?" },
      { status: 502 },
    );
  }
}
