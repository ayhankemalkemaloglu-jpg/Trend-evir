import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Conversion gate for Pro-only content. The site is static with no auth, so
 * this is a permanent nudge to the beehiiv paid tier (where premium issues are
 * delivered), not a per-user unlock. Fades in via tw-animate-css (no JS).
 */
export function PremiumGate({
  proUrl,
  title = "Bu sayı Pro abonelere özel",
  description = "Arşivin tamamına ve her trendin derin analizine erişmek için Pro'ya geç.",
}: {
  proUrl: string;
  title?: string;
  description?: string;
}) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 rounded-2xl border border-accent/40 bg-surface/80 p-8 text-center backdrop-blur-sm duration-500 md:p-10">
      <span className="mx-auto grid size-12 place-items-center rounded-full border border-accent/40 bg-accent/10 text-accent">
        <Lock className="size-5" />
      </span>
      <h2 className="mt-4 font-serif text-2xl leading-snug md:text-3xl">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-secondary">{description}</p>
      <div className="mt-6">
        <Button asChild>
          <a href={proUrl} target="_blank" rel="noopener noreferrer">
            Pro&apos;ya Geç
          </a>
        </Button>
      </div>
    </div>
  );
}
