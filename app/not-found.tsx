import Link from "next/link";

import { Footer } from "@/components/sections/Footer";
import { Nav } from "@/components/sections/Nav";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="container-px mx-auto flex min-h-[60dvh] max-w-3xl flex-1 flex-col items-center justify-center py-20 text-center">
        <p className="kicker">404</p>
        <h1 className="mt-4 font-serif text-[clamp(2.5rem,7vw,5rem)] leading-none tracking-tight">
          Bu trendi bulamadık.
        </h1>
        <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-secondary">
          Aradığın sayfa taşınmış ya da hiç yayınlanmamış olabilir. En güncel
          sayıları arşivden okuyabilir veya ana sayfaya dönebilirsin.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/">Ana sayfaya dön</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/arsiv">Arşivi aç</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
