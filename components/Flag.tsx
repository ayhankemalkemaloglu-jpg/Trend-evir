/**
 * Circular country-flag badges drawn as inline SVG (self-contained — no
 * external flag CDN). Each flag is clipped to a circle for the "badge" look.
 */
import { cn } from "@/lib/utils";

function starPoints(
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  rotationDeg = -90,
) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / 5) * i + (rotationDeg * Math.PI) / 180;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(" ");
}

function JapanFlag() {
  return (
    <>
      <rect width="24" height="24" fill="#ffffff" />
      <circle cx="12" cy="12" r="6" fill="#bc002d" />
    </>
  );
}

function ChinaFlag() {
  const big = starPoints(6, 7, 3, 1.2);
  const smalls: Array<[number, number, number]> = [
    [11.5, 3.5, -55],
    [13.5, 6, -25],
    [13.5, 9.5, 5],
    [11.5, 12, 35],
  ];
  return (
    <>
      <rect width="24" height="24" fill="#de2910" />
      <polygon points={big} fill="#ffde00" />
      {smalls.map(([x, y, rot], i) => (
        <polygon
          key={i}
          points={starPoints(x, y, 1.1, 0.45, rot)}
          fill="#ffde00"
        />
      ))}
    </>
  );
}

function USAFlag() {
  const stripeH = 24 / 13;
  return (
    <>
      {Array.from({ length: 13 }).map((_, i) => (
        <rect
          key={i}
          x="0"
          y={i * stripeH}
          width="24"
          height={stripeH}
          fill={i % 2 === 0 ? "#b22234" : "#ffffff"}
        />
      ))}
      <rect x="0" y="0" width="11" height={stripeH * 7} fill="#3c3b6e" />
      {Array.from({ length: 4 }).map((_, row) =>
        Array.from({ length: 5 }).map((_, col) => (
          <circle
            key={`${row}-${col}`}
            cx={1.4 + col * 2.1}
            cy={1.6 + row * 2.6}
            r="0.55"
            fill="#ffffff"
          />
        )),
      )}
    </>
  );
}

function TurkeyFlag() {
  return (
    <>
      <rect width="24" height="24" fill="#e30a17" />
      <circle cx="9.5" cy="12" r="4.6" fill="#ffffff" />
      <circle cx="11.2" cy="12" r="3.6" fill="#e30a17" />
      <polygon points={starPoints(15.4, 12, 2.1, 0.85, -90)} fill="#ffffff" />
    </>
  );
}

const FLAGS: Record<string, () => React.ReactElement> = {
  JP: JapanFlag,
  CN: ChinaFlag,
  US: USAFlag,
  TR: TurkeyFlag,
};

const COUNTRY_NAMES: Record<string, string> = {
  JP: "Japonya",
  CN: "Çin",
  US: "ABD",
  TR: "Türkiye",
};

export function Flag({
  code,
  size = 28,
  className,
}: {
  code: string;
  size?: number;
  className?: string;
}) {
  const key = code.toUpperCase();
  const FlagArt = FLAGS[key];
  const label = COUNTRY_NAMES[key] ?? key;

  return (
    <span
      role="img"
      aria-label={`${label} bayrağı`}
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ring-1 ring-white/15",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        aria-hidden="true"
        focusable="false"
      >
        {FlagArt ? (
          <FlagArt />
        ) : (
          <>
            <rect width="24" height="24" fill="#1a1a1a" />
            <text
              x="12"
              y="15"
              textAnchor="middle"
              fontSize="8"
              fill="#d4af37"
              fontFamily="monospace"
            >
              {key.slice(0, 2)}
            </text>
          </>
        )}
      </svg>
    </span>
  );
}
