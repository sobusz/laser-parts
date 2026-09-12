import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/PublicLayout";
import CatalogSearch from "@/components/CatalogSearch";
import CommercialTerms from "@/components/CommercialTerms";
import { catalogHref } from "@/lib/catalog-url";
import { trpc } from "@/lib/trpc";
import {
  HOME_CTA_NOTE,
  HOME_INTRO,
  HOME_LEAD,
  MACHINE_INTRO,
  MACHINES_INTRO,
  OEM_DISCLAIMER,
} from "@shared/legacy-copy";

const FALLBACK_CATEGORIES = [
  { slug: "trumpf", name: "TRUMPF" },
  { slug: "bystronic", name: "BYSTRONIC" },
  { slug: "mazak", name: "MAZAK" },
  { slug: "lvd", name: "LVD" },
  { slug: "inne", name: "Inne marki" },
  { slug: "optyka", name: "Optyka" },
];

const CATEGORY_TAGS: Record<string, string> = {
  trumpf: "Dysze, soczewki i oleje do głowicy — podstawowa eksploatacja maszyn TRUMPF.",
  bystronic: "Dysze, soczewki i filtry; numeracja zgodna z katalogiem producenta.",
  mazak: "Dysze i części głowicy, w tym warianty Turbo, L32 i Side Blow — w miarę dostępności.",
  lvd: "Ceramika, obsady i pozostałe pozycje eksploatacyjne według numerów LVD.",
  inne: "Amada, Precitec, Prima, Salvagnini i inni producenci — realizacja na zamówienie.",
  optyka: "Soczewki, lustra i szyby ochronne. Dobór na podstawie modelu maszyny i numeru referencyjnego.",
};

export default function Home() {
  const [query, setQuery] = useState("");
  const { data: categories } = trpc.categories.list.useQuery();
  const { data: products } = trpc.products.list.useQuery({});
  const { data: machines } = trpc.machines.list.useQuery();
  const displayCategories = categories && categories.length > 0 ? categories : FALLBACK_CATEGORIES;

  const countByCategory = new Map<number, number>();
  for (const p of products ?? []) {
    countByCategory.set(p.categoryId, (countByCategory.get(p.categoryId) ?? 0) + 1);
  }

  return (
    <PublicLayout>
      <section className="relative flex items-center min-h-[28rem] md:min-h-[32rem] xl:min-h-[36rem]">
        <img
          src="/photos/cut-metal.jpg"
          alt="Głowica wycinarki laserowej tnąca arkusz blachy"
          className="absolute inset-0 h-full w-full object-cover object-[78%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/15" />
        <div className="relative container py-12 lg:py-16 text-white">
          <h1 className="text-[clamp(2.25rem,4.2vw,4.5rem)] font-bold tracking-[-0.04em] leading-[1.12] max-w-[11em] text-balance">
            Części do wycinarek laserowych
          </h1>
          <p className="mt-5 text-white/90 text-base lg:text-lg leading-relaxed max-w-xl text-pretty">
            {HOME_LEAD}
          </p>
          <div className="mt-8 max-w-xl">
            <CatalogSearch
              id="home-szukaj"
              query={query}
              onQueryChange={setQuery}
              className="max-w-none"
              tone="onDark"
            />
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {displayCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={catalogHref(cat.slug)}
                className="inline-flex items-center min-h-11 font-mono text-xs uppercase tracking-[0.12em] px-4 border border-white/30 text-white hover:border-primary hover:text-primary"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="container py-14 lg:py-16">
          <p className="text-muted-foreground text-[17px] leading-relaxed max-w-3xl mb-10 text-pretty">
            {HOME_INTRO}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-3">
            <h2 className="text-xl font-semibold tracking-tight">Do jakiej maszyny?</h2>
            <Link href="/oferta" className="inline-flex items-center gap-2 text-sm font-semibold hover:text-primary">
              Zobacz całą ofertę
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-muted-foreground text-[15px] leading-relaxed max-w-3xl mb-6 text-pretty">
            {MACHINE_INTRO}
          </p>
          <div className="bg-white border border-border">
            {displayCategories.map((cat) => {
              const count = "id" in cat ? countByCategory.get(cat.id) : undefined;
              return (
                <Link
                  key={cat.slug}
                  href={catalogHref(cat.slug)}
                  className="group grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[9rem_minmax(0,1fr)_auto] items-start gap-x-6 gap-y-1 px-5 py-4 border-b border-border last:border-b-0 hover:bg-muted"
                >
                  <span className="font-mono text-sm font-semibold tracking-[0.06em] uppercase">
                    {cat.name}
                  </span>
                  <span className="text-sm text-muted-foreground col-start-1 sm:col-start-2 text-pretty">
                    {CATEGORY_TAGS[cat.slug] ?? "Części eksploatacyjne; numeracja zgodna z katalogiem producenta."}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground tabular-nums col-start-2 row-start-1 sm:col-start-3 sm:row-start-auto">
                    {count !== undefined ? `${count}` : "—"}
                  </span>
                </Link>
              );
            })}
          </div>
          <p className="mt-5 text-sm text-muted-foreground leading-relaxed max-w-3xl text-pretty">
            {OEM_DISCLAIMER}
          </p>
        </div>
      </section>

      <section className="bg-background pb-14 lg:pb-16">
        <div className="container">
          <CommercialTerms />
        </div>
      </section>

      {machines && machines.length > 0 && (
        <section className="border-t border-border bg-white">
          <div className="container py-8 flex flex-col gap-3">
            <h2 className="text-xl font-semibold tracking-tight">Maszyny używane</h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl text-pretty">{MACHINES_INTRO}</p>
            <ul className="space-y-1">
              {machines.map((m) => (
                <li key={m.id} className="text-sm">
                  <span className="font-medium">{m.title}</span>
                  {m.contactNote ? <span className="text-muted-foreground"> — {m.contactNote}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="bg-black text-white">
        <div className="h-1 bg-primary" />
        <div className="container py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-white/75 text-sm leading-relaxed mb-3 text-pretty">{HOME_CTA_NOTE}</p>
            <a href="tel:+48691732408" className="font-mono text-xl sm:text-2xl tracking-tight text-primary hover:text-white">
              +48 691 732 408
            </a>
          </div>
          <Button asChild size="lg" className="h-12 px-7">
            <Link href="/zapytanie">Wyślij listę części</Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
}
