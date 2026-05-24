import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 5000;

function stripHeaderControlChars(value: string) {
  return value.replace(/[\r\n\x00-\x1f\x7f]+/g, " ").trim();
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

  const { name, email, message, consent, website } = (body ?? {}) as Record<
    string,
    unknown
  >;

  // Honeypot — bots fill this hidden field.
  if (typeof website === "string" && website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const normalizedName = typeof name === "string" ? stripHeaderControlChars(name) : "";
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const normalizedMessage = typeof message === "string" ? message.trim() : "";

  if (
    normalizedName.length < 2 ||
    normalizedName.length > MAX_NAME_LENGTH ||
    !EMAIL_RE.test(normalizedEmail) ||
    normalizedMessage.length < 10 ||
    normalizedMessage.length > MAX_MESSAGE_LENGTH
  ) {
    return NextResponse.json(
      { ok: false, message: "Lütfen tüm alanları eksiksiz ve makul uzunlukta doldur." },
      { status: 422 },
    );
  }

  if (consent !== true) {
    return NextResponse.json(
      { ok: false, message: "Devam etmek için gizlilik onayı gerekli." },
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
        reply_to: normalizedEmail,
        subject: `TrendÇevir iletişim — ${normalizedName}`,
        text: `Gönderen: ${normalizedName} <${normalizedEmail}>\n\n${normalizedMessage}`,
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
