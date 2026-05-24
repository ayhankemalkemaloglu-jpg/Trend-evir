"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm({ className }: { className?: string }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const update =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;

    if (!consent) {
      setStatus("error");
      setMessage("Devam etmek için gizlilik ve yurt dışı aktarım onayını işaretle.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, consent, website }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
      };

      if (res.ok && data.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
        setConsent(false);
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
          Mesajın bize ulaştı. En kısa sürede dönüş yapacağız.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={cn("space-y-4", className)}
      aria-describedby={
        status === "error" ? "contact-consent contact-error" : "contact-consent"
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-2 block text-sm text-secondary">
            Adın
          </label>
          <Input
            id="contact-name"
            required
            autoComplete="name"
            value={form.name}
            onChange={update("name")}
            aria-invalid={status === "error"}
            aria-describedby={status === "error" ? "contact-error" : undefined}
            className="h-12 rounded-xl"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-2 block text-sm text-secondary">
            E-posta
          </label>
          <Input
            id="contact-email"
            type="email"
            inputMode="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={update("email")}
            aria-invalid={status === "error"}
            aria-describedby={status === "error" ? "contact-error" : undefined}
            className="h-12 rounded-xl"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-2 block text-sm text-secondary">
          Mesajın
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={form.message}
          onChange={update("message")}
          aria-invalid={status === "error"}
          aria-describedby={status === "error" ? "contact-error" : undefined}
          className="flex w-full rounded-xl border border-border bg-surface px-4 py-3 text-base text-foreground placeholder:text-secondary/70 transition-colors duration-200 focus-visible:border-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
        />
      </div>

      <label
        id="contact-consent"
        htmlFor="contact-consent-checkbox"
        className="flex items-start gap-2.5 text-sm leading-relaxed text-secondary"
      >
        <input
          id="contact-consent-checkbox"
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 size-4 shrink-0 rounded border-border bg-surface accent-accent"
          aria-invalid={status === "error" && !consent}
        />
        <span>
          <Link
            href="/gizlilik"
            className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
          >
            Gizlilik politikasını
          </Link>{" "}
          okudum; iletişim bilgilerimin mesajıma dönüş yapılması için
          işlenmesine ve gerekli hizmet sağlayıcılarla paylaşılmasına açık rıza
          veriyorum.
        </span>
      </label>

      {/* Honeypot */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">Web siten</label>
        <input
          id="contact-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {status === "error" && (
        <p id="contact-error" role="alert" className="text-sm text-red-400">
          {message}
        </p>
      )}

      <Button type="submit" size="lg" disabled={status === "loading"}>
        {status === "loading" ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Gönderiliyor
          </>
        ) : (
          <>
            <Send className="size-4" />
            Mesajı Gönder
          </>
        )}
      </Button>
    </form>
  );
}
