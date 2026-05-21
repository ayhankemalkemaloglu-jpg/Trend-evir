import { NextResponse } from "next/server";
import { subscribeToBeehiiv } from "@/lib/beehiiv";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const { email, website } = (body ?? {}) as {
    email?: unknown;
    website?: unknown;
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

  const result = await subscribeToBeehiiv(email.trim().toLowerCase());

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
