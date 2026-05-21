import { ImageResponse } from "next/og";

import { getIssueMeta, getIssueSlugs } from "@/lib/mdx";
import { formatDateTR, issueNo } from "@/lib/format";
import { loadSerif } from "@/lib/og-font";

export const alt = "TrendÇevir bülteni";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getIssueSlugs().map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = getIssueMeta(slug);
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
            "radial-gradient(circle at 85% 0%, rgba(212,175,55,0.20), transparent 55%)",
          padding: 72,
          borderTop: "6px solid #d4af37",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 999,
              border: "2px solid #d4af37",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#d4af37",
              fontSize: 26,
              fontFamily,
            }}
          >
            TÇ
          </div>
          <div
            style={{ marginLeft: 18, color: "#ffffff", fontSize: 30, fontFamily }}
          >
            TrendÇevir
          </div>
        </div>

        <div
          style={{
            display: "flex",
            color: "#ffffff",
            fontSize: 68,
            lineHeight: 1.05,
            letterSpacing: -1,
            fontFamily,
            maxWidth: 1000,
          }}
        >
          {meta.title}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#d4af37",
            fontSize: 26,
          }}
        >
          <div style={{ display: "flex" }}>
            {issueNo(meta.issue)} · {formatDateTR(meta.date)}
          </div>
          <div style={{ display: "flex", color: "#a0a0a0" }}>trendcevir.com</div>
        </div>
      </div>
    ),
    { ...size, fonts: serif ? [{ name: "Instrument Serif", data: serif, weight: 400, style: "normal" }] : undefined },
  );
}
