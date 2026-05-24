"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

export function ShareButton({ title, slug }: { title: string; slug: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
    }
  }

  async function onShare() {
    trackEvent("share_clicked", { slug });
    setStatus("idle");
    const url = `${window.location.origin}/arsiv/${slug}`;

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        await copyUrl(url);
      }
      return;
    }

    await copyUrl(url);
  }

  return (
    <div className="inline-flex flex-col items-start gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onShare}
        aria-label="Bu sayının bağlantısını paylaş"
      >
        {status === "copied" ? (
          <>
            <Check className="size-4" />
            Kopyalandı
          </>
        ) : (
          <>
            <Share2 className="size-4" />
            Paylaş
          </>
        )}
      </Button>
      <span role="status" aria-live="polite" className="text-xs text-secondary">
        {status === "error" ? "Bağlantı kopyalanamadı." : ""}
      </span>
    </div>
  );
}
