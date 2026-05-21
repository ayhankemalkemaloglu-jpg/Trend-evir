import { NextResponse } from "next/server";

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

  const { name, email, message, website } = (body ?? {}) as Record<
    string,
    unknown
  >;

  // Honeypot — bots fill this hidden field.
  if (typeof website === "string" && website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  if (
    typeof name !== "string" ||
    name.trim().length < 2 ||
    typeof email !== "string" ||
    !EMAIL_RE.test(email.trim()) ||
    typeof message !== "string" ||
    message.trim().length < 10
  ) {
    return NextResponse.json(
      { ok: false, message: "Lütfen tüm alanları eksiksiz doldur." },
      { status: 422 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM;

  if (!apiKey || !to || !from) {
    return NextResponse.json(
      { ok: false, message: "İletişim servisi şu an yapılandırılmadı." },
      { status: 503 },
    );
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email.trim(),
        subject: `TrendÇevir iletişim — ${name.trim()}`,
        text: `Gönderen: ${name.trim()} <${email.trim()}>\n\n${message.trim()}`,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { ok: false, message: "Mesaj gönderilemedi. Tekrar dener misin?" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Bağlantı kurulamadı. Tekrar dener misin?" },
      { status: 502 },
    );
  }
}
