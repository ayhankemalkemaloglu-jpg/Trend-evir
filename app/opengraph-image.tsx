import { ImageResponse } from "next/og";

import { loadSerif } from "@/lib/og-font";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const serif = await loadSerif();
  const fontFamily = serif ? "Instrument Serif" : "serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0f0f0f",
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(212,175,55,0.22), transparent 55%)",
          padding: 80,
          borderTop: "6px solid #d4af37",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 999,
              border: "2px solid #d4af37",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#d4af37",
              fontSize: 28,
              fontFamily,
            }}
          >
            TÇ
          </div>
          <div
            style={{ marginLeft: 18, color: "#ffffff", fontSize: 32, fontFamily }}
          >
            TrendÇevir
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: "#ffffff",
              fontSize: 78,
              lineHeight: 1.02,
              letterSpacing: -1.5,
              fontFamily,
              maxWidth: 1040,
            }}
          >
            Dünyada işliyor. Türkiye&apos;de henüz yok.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              color: "#a0a0a0",
              fontSize: 30,
              maxWidth: 900,
            }}
          >
            Yurtdışında çalışan iş trendlerini Türk girişimcilere getiriyoruz.
          </div>
        </div>

        <div style={{ display: "flex", color: "#d4af37", fontSize: 26 }}>
          Her Pazartesi 09:00 · trendcevir.com
        </div>
      </div>
    ),
    { ...size, fonts: serif ? [{ name: "Instrument Serif", data: serif, weight: 400, style: "normal" }] : undefined },
  );
}
