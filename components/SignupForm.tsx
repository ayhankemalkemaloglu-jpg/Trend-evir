"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

export function SignupForm({
  className,
  source = "landing",
  buttonLabel = "Abone Ol",
  placeholder = "ornek@eposta.com",
}: {
  className?: string;
  source?: string;
  buttonLabel?: string;
  placeholder?: string;
}) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setMessage("");
    trackEvent("signup_attempted", { source });

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
      };

      if (res.ok && data.ok) {
        setStatus("success");
        trackEvent("signup_success", { source });
        setEmail("");
        return;
      }

      setStatus("error");
      setMessage(data.message ?? "Bir şeyler ters gitti. Tekrar dener misin?");
    } catch {
      setStatus("error");
      setMessage("Bağlantı kurulamadı. Tekrar dener misin?");
    }
  }

  if (status === "success") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-2xl border border-success/30 bg-success/5 px-5 py-4",
          className,
        )}
        role="status"
        aria-live="polite"
      >
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-success/15 text-success">
          <Check className="size-4" />
        </span>
        <p className="text-sm text-foreground">
          Hoş geldin. İlk bültenin Pazartesi 09:00&apos;da kutunda olacak.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={cn("w-full", className)}
      aria-describedby={status === "error" ? "signup-error" : undefined}
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor={`email-${source}`} className="sr-only">
          E-posta adresin
        </label>
        <Input
          id={`email-${source}`}
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={status === "error"}
          className="sm:flex-1"
        />

        {/* Honeypot: hidden from users + assistive tech, catches bots. */}
        <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor={`website-${source}`}>Web siten</label>
          <input
            id={`website-${source}`}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={status === "loading"}
          className="shrink-0"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Gönderiliyor
            </>
          ) : (
            <>
              {buttonLabel}
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </div>

      {status === "error" && (
        <p
          id="signup-error"
          role="alert"
          className="mt-2.5 text-sm text-red-400"
        >
          {message}
        </p>
      )}
    </form>
  );
}
