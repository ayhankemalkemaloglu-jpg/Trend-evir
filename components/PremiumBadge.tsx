import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[0.7rem] uppercase tracking-wider";

/** "Pro" (gold) or "Ücretsiz" (green) tag for an issue. */
export function PremiumBadge({
  premium,
  className,
}: {
  premium: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        base,
        premium
          ? "border-accent/40 bg-accent/10 text-accent"
          : "border-success/40 bg-success/10 text-success",
        className,
      )}
    >
      {premium ? "Pro" : "Ücretsiz"}
    </span>
  );
}
