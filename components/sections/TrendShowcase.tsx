import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { TrendCard } from "@/components/trend/TrendCard";
import { showcaseTrends } from "@/lib/content";

export function TrendShowcase() {
  return (
    <section className="container-px mx-auto max-w-6xl py-20 md:py-28">
      <Reveal>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            kicker="Arşivden"
            title={
              <>
                Daha önce{" "}
                <span className="italic text-accent">çevirdiklerimiz.</span>
              </>
            }
          />
          <Link
            href="/arsiv"
            className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-secondary transition-colors duration-200 hover:text-accent"
          >
            Tüm arşivi gör
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {showcaseTrends.map((trend, i) => (
          <Reveal key={trend.name} delay={i * 0.07} className="flex">
            <TrendCard trend={trend} className="w-full" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
