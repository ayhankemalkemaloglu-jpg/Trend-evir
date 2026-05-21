import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { IssueCard } from "@/components/IssueCard";
import { getAllIssues } from "@/lib/mdx";
import { categories, type Category } from "@/lib/content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Arşiv",
  description:
    "TrendÇevir'in tüm geçmiş bültenleri. Dünyadan filtrelenmiş iş trendleri, Türkiye uyum skorlarıyla.",
  alternates: { canonical: "/arsiv" },
};

const PER_PAGE = 12;

function isCategory(value: string | undefined): value is Category {
  return !!value && (categories as readonly string[]).includes(value);
}

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; sayfa?: string }>;
}) {
  const params = await searchParams;
  const active: Category = isCategory(params.kategori) ? params.kategori : "Tümü";
  const requestedPage = Math.max(1, Number.parseInt(params.sayfa ?? "1") || 1);

  const all = getAllIssues();
  const filtered =
    active === "Tümü"
      ? all
      : all.filter((issue) => issue.categories.includes(active));

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const page = Math.min(requestedPage, totalPages);
  const items = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const catHref = (cat: Category) =>
    cat === "Tümü" ? "/arsiv" : `/arsiv?kategori=${encodeURIComponent(cat)}`;
  const pageHref = (p: number) => {
    const sp = new URLSearchParams();
    if (active !== "Tümü") sp.set("kategori", active);
    if (p > 1) sp.set("sayfa", String(p));
    const qs = sp.toString();
    return qs ? `/arsiv?${qs}` : "/arsiv";
  };

  return (
    <div className="container-px mx-auto max-w-6xl py-16 md:py-24">
      <header className="max-w-2xl">
        <p className="kicker">Arşiv</p>
        <h1 className="mt-4 font-serif text-[clamp(2.5rem,6vw,4rem)] leading-[1.05] tracking-tight">
          Şimdiye kadar{" "}
          <span className="italic text-accent">çevirdiklerimiz.</span>
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-secondary">
          Her bülten, dünyadan filtrelenmiş üç-beş trend ve Türkiye uyum
          skorları. En yeniden eskiye doğru sıralı.
        </p>
      </header>

      <div className="gold-rule my-10" />

      {/* Category filter chips */}
      <nav aria-label="Kategori filtresi" className="flex flex-wrap gap-2.5">
        {categories.map((cat) => {
          const isActive = cat === active;
          return (
            <Link
              key={cat}
              href={catHref(cat)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors duration-200",
                isActive
                  ? "border-accent bg-accent text-background font-medium"
                  : "border-border text-secondary hover:border-accent/50 hover:text-foreground",
              )}
            >
              {cat}
            </Link>
          );
        })}
      </nav>

      {items.length === 0 ? (
        <p className="mt-16 text-center text-secondary">
          Bu kategoride henüz bülten yok.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((issue) => (
            <IssueCard key={issue.slug} issue={issue} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav
          aria-label="Sayfalama"
          className="mt-14 flex items-center justify-center gap-2"
        >
          <Link
            href={pageHref(Math.max(1, page - 1))}
            aria-disabled={page === 1}
            className={cn(
              "grid size-10 place-items-center rounded-full border border-border text-secondary transition-colors hover:border-accent hover:text-accent",
              page === 1 && "pointer-events-none opacity-40",
            )}
            aria-label="Önceki sayfa"
          >
            <ChevronLeft className="size-4" />
          </Link>
          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            return (
              <Link
                key={p}
                href={pageHref(p)}
                aria-current={p === page ? "page" : undefined}
                className={cn(
                  "grid size-10 place-items-center rounded-full border font-mono text-sm transition-colors",
                  p === page
                    ? "border-accent bg-accent text-background"
                    : "border-border text-secondary hover:border-accent hover:text-accent",
                )}
              >
                {p}
              </Link>
            );
          })}
          <Link
            href={pageHref(Math.min(totalPages, page + 1))}
            aria-disabled={page === totalPages}
            className={cn(
              "grid size-10 place-items-center rounded-full border border-border text-secondary transition-colors hover:border-accent hover:text-accent",
              page === totalPages && "pointer-events-none opacity-40",
            )}
            aria-label="Sonraki sayfa"
          >
            <ChevronRight className="size-4" />
          </Link>
        </nav>
      )}
    </div>
  );
}
