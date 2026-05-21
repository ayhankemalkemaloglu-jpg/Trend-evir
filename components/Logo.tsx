import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Circular gold-ring monogram with a serif "TÇ" — the core brand mark.
 * Rebuilt as scalable markup so it stays crisp at any size and inherits
 * the loaded Instrument Serif face.
 */
export function LogoMark({
  size = 38,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative grid shrink-0 place-items-center rounded-full border border-accent/70",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <span
        className="font-serif leading-none text-accent"
        style={{ fontSize: size * 0.44, letterSpacing: "-0.07em" }}
      >
        TÇ
      </span>
    </span>
  );
}

/** Horizontal lockup for the nav/footer: monogram + wordmark. */
export function Logo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      aria-label="TrendÇevir ana sayfa"
      className={cn(
        "group inline-flex items-center gap-2.5 text-foreground",
        className,
      )}
    >
      <LogoMark
        size={38}
        className="transition-colors duration-200 group-hover:border-accent"
      />
      <span className="font-serif text-xl tracking-tight">TrendÇevir</span>
    </Link>
  );
}

/** Vertical, centered lockup with the establishment line — for brand moments. */
export function LogoLockup({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      aria-label="TrendÇevir ana sayfa"
      className={cn("flex flex-col items-center text-center", className)}
    >
      <LogoMark size={76} className="border-[1.5px]" />
      <span className="mt-5 font-serif text-2xl uppercase tracking-[0.2em] text-foreground">
        TRENDÇEVİR
      </span>
      <span className="mt-2.5 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-accent">
        Est. 2026 · İstanbul
      </span>
    </Link>
  );
}
