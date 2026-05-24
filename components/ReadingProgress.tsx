"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

const READ_THRESHOLD = 65;

export function ReadingProgress({ slug }: { slug: string }) {
  const [progress, setProgress] = useState(0);
  const trackedReadRef = useRef(false);

  useEffect(() => {
    trackedReadRef.current = false;

    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      const nextProgress =
        max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0;

      setProgress(nextProgress);

      if (!trackedReadRef.current && nextProgress >= READ_THRESHOLD) {
        trackedReadRef.current = true;
        trackEvent("issue_read", { slug, threshold: READ_THRESHOLD });
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
