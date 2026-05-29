/**
 * Hero accent: gold dashed strokes that drift along winding paths — an
 * original, brand-recoloured take on the "flowing lines" idea (pure SVG + CSS,
 * no GSAP/canvas). Decorative, sits behind the headline, freezes under
 * prefers-reduced-motion. Each path's dash period divides 1200 (see the
 * trend-flow keyframe) so the loop is seamless.
 */

const LINES: { d: string; width: number; dash: string; dur: number; delay: number }[] = [
  {
    d: "M -40 120 C 250 40, 450 220, 720 130 S 1150 40, 1240 160",
    width: 2,
    dash: "3 17", // period 20 → 1200/20
    dur: 19,
    delay: -4,
  },
  {
    d: "M -40 300 C 220 200, 520 400, 760 290 S 1120 200, 1240 330",
    width: 2.5,
    dash: "4 20", // period 24 → 1200/24
    dur: 26,
    delay: -11,
  },
  {
    d: "M -40 470 C 260 380, 480 560, 740 450 S 1160 360, 1240 480",
    width: 1.75,
    dash: "5 25", // period 30 → 1200/30
    dur: 32,
    delay: -7,
  },
  {
    d: "M -40 220 C 300 120, 560 320, 820 200 S 1180 110, 1240 250",
    width: 3,
    dash: "10 30", // period 40 → 1200/40
    dur: 23,
    delay: -15,
  },
];

export function HeroLines() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-55 [mask-image:linear-gradient(to_bottom,black_72%,transparent)]"
    >
      <svg
        className="h-full w-full [filter:blur(0.5px)]"
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <linearGradient id="trendFlowGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.05" />
            <stop offset="50%" stopColor="#e6cd76" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        {LINES.map((line, i) => (
          <path
            key={i}
            d={line.d}
            stroke="url(#trendFlowGold)"
            strokeWidth={line.width}
            strokeLinecap="round"
            strokeDasharray={line.dash}
            style={{
              animation: `trend-flow ${line.dur}s linear infinite`,
              animationDelay: `${line.delay}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
