"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

/**
 * Ready-to-paste share text for an issue + copy/X buttons. The snippet text is
 * built on the server (canonical URL) and passed in, so shared links always
 * point at the live domain rather than whatever origin the reader is on.
 */
export function ShareSnippet({
  snippet,
  slug,
}: {
  snippet: string;
  slug: string;
}) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(snippet);
      } else {
        // Fallback for older / non-secure contexts.
        const ta = document.createElement("textarea");
        ta.value = snippet;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackEvent("share_clicked", { slug, method: "copy" });
    } catch {
      /* clipboard unavailable */
    }
  }

  const tweetHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(snippet)}`;

  return (
    <section
      aria-labelledby="paylas-baslik"
      className="mt-12 rounded-2xl border border-border bg-surface p-6 md:p-8"
    >
      <p id="paylas-baslik" className="kicker">
        Paylaş
      </p>
      <p className="mt-3 text-sm text-secondary">
        Bir girişimci arkadaşının haftasını değiştirebilir. Hazır metni kopyala
        ya da doğrudan paylaş.
      </p>

      <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-xl border border-border bg-background/50 p-4 font-sans text-sm leading-relaxed text-foreground/90">
        {snippet}
      </pre>

      <div className="mt-4 flex flex-wrap gap-3">
        <Button variant="outline" size="sm" onClick={onCopy}>
          {copied ? (
            <>
              <Check className="size-4" />
              Kopyalandı
            </>
          ) : (
            <>
              <Copy className="size-4" />
              Kopyala
            </>
          )}
        </Button>
        <Button asChild variant="outline" size="sm">
          <a
            href={tweetHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("share_clicked", { slug, method: "x" })}
          >
            <ExternalLink className="size-4" />
            X&apos;te paylaş
          </a>
        </Button>
      </div>
    </section>
  );
}
