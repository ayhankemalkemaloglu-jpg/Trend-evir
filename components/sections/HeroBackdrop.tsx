"use client";

import dynamic from "next/dynamic";

// Lazy + client-only: the raw-WebGL2 shader loads asynchronously on the landing
// page alone, after the server-rendered headline has painted (LCP unaffected).
const ShaderBackground = dynamic(
  () =>
    import("@/components/ui/animated-shader-hero").then(
      (m) => m.ShaderBackground,
    ),
  { ssr: false },
);

export function HeroBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden [mask-image:linear-gradient(to_bottom,black_70%,transparent)]"
    >
      <ShaderBackground className="opacity-80" />
    </div>
  );
}
