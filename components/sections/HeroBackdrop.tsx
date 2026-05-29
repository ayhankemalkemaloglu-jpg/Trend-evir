"use client";

import dynamic from "next/dynamic";

// Lazy + client-only: keeps three out of SSR and the shared bundle, so the
// ~150 kB cost loads asynchronously on the landing page alone (after the
// server-rendered headline has already painted — LCP is unaffected).
const WebGLShader = dynamic(
  () => import("@/components/ui/web-gl-shader").then((m) => m.WebGLShader),
  { ssr: false },
);

export function HeroBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <WebGLShader className="opacity-70" />
    </div>
  );
}
