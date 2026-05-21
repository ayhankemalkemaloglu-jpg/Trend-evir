/**
 * Designed placeholder cover art — fully self-contained (no stock photos).
 * A tinted charcoal field with a soft glow and a fine editorial line motif.
 */
import { cn } from "@/lib/utils";

export function CoverArt({
  tint = "#2a2f45",
  className,
  rounded = "rounded-xl",
  children,
}: {
  tint?: string;
  className?: string;
  rounded?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden bg-surface",
        rounded,
        className,
      )}
      style={{
        backgroundImage: `linear-gradient(135deg, color-mix(in srgb, ${tint} 42%, #0f0f0f) 0%, #0f0f0f 72%)`,
      }}
    >
      {/* soft corner glow */}
      <div
        aria-hidden
        className="absolute -right-1/4 -top-1/3 h-[140%] w-[70%] opacity-60 blur-2xl"
        style={{
          background: `radial-gradient(circle, color-mix(in srgb, ${tint} 55%, transparent) 0%, transparent 65%)`,
        }}
      />
      {/* fine concentric line motif */}
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full opacity-[0.12]"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 400 225"
      >
        {Array.from({ length: 7 }).map((_, i) => (
          <circle
            key={i}
            cx="320"
            cy="40"
            r={30 + i * 38}
            fill="none"
            stroke="#d4af37"
            strokeWidth="0.75"
          />
        ))}
      </svg>
      {/* hairline gold frame */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/5"
      />
      {children}
    </div>
  );
}
