import { cn } from "@/lib/utils";

export function SectionHeading({
  kicker,
  title,
  intro,
  align = "left",
  className,
}: {
  kicker?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {kicker && <p className="kicker">{kicker}</p>}
      <h2 className="mt-4 font-serif text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.08] tracking-tight">
        {title}
      </h2>
      {intro && (
        <p className="mt-4 text-lg leading-relaxed text-secondary">{intro}</p>
      )}
    </div>
  );
}
