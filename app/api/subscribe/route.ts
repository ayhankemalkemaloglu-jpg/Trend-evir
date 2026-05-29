import { NextResponse } from "next/server";
import { subscribeToBeehiiv } from "@/lib/beehiiv";
import { categories } from "@/lib/content";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Interest categories a subscriber can opt into ("Tümü" is a filter, not a tag).
const ALLOWED_CATEGORIES = new Set<string>(
  categories.filter((c) => c !== "Tümü"),
);

function parseCategories(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  const valid = input.filter(
    (c): c is string => typeof c === "string" && ALLOWED_CATEGORIES.has(c),
  );
  return [...new Set(valid)].slice(0, ALLOWED_CATEGORIES.size);
}

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

  const { email, website, categories: rawCategories } = (body ?? {}) as {
    email?: unknown;
    website?: unknown;
    categories?: unknown;
  };

  // Honeypot: real users never fill this hidden field. Silently accept.
  if (typeof website === "string" && website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json(
      { ok: false, message: "Geçerli bir e-posta adresi gir." },
      { status: 422 },
    );
  }

  const result = await subscribeToBeehiiv(email.trim().toLowerCase(), {
    categories: parseCategories(rawCategories),
  });

  if (result.ok) {
    return NextResponse.json({ ok: true });
  }

  if (result.reason === "config") {
    return NextResponse.json(
      { ok: false, message: "Abonelik servisi şu an yapılandırılmadı." },
      { status: 503 },
    );
  }

  return NextResponse.json(
    { ok: false, message: "Bir şeyler ters gitti. Tekrar dener misin?" },
    { status: 502 },
  );
}
