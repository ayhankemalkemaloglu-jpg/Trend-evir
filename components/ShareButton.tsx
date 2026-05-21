"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

export function ShareButton({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);

  async function onShare() {
    trackEvent("share_clicked", { slug });
    const url = `${window.location.origin}/arsiv/${slug}`;

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user dismissed */
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={onShare}>
      {copied ? (
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
  );
}
