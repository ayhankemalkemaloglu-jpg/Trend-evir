import Link from "next/link";
import { cn } from "@/lib/utils";

/** TrendÇevir wordmark: gold "TÇ" monogram + name. */
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
      <span
        aria-hidden
        className="grid size-9 place-items-center rounded-md border border-accent/40 bg-accent/10 font-serif text-lg leading-none text-accent transition-colors duration-200 group-hover:bg-accent/15"
      >
        TÇ
      </span>
      <span className="font-serif text-xl tracking-tight">
        Trend<span className="text-accent">Ç</span>evir
      </span>
    </Link>
  );
}
