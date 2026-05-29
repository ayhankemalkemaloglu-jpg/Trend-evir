"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import { useScrollProgress } from "@/lib/use-scroll-progress";

export function ReadingProgress({ slug }: { slug: string }) {
  const progress = useScrollProgress();

  useEffect(() => {
    trackEvent("issue_read", { slug });
  }, [slug]);

  return (
    <div
      className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent"
      aria-hidden
    >
      <div
        className="h-full bg-accent transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
