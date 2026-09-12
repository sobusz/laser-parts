import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/PublicLayout";
import CatalogSearch from "@/components/CatalogSearch";
import { catalogHref } from "@/lib/catalog-url";
import { publicUrl } from "@/lib/public-url";
import { trpc } from "@/lib/trpc";
import { OEM_DISCLAIMER, MACHINES_INTRO } from "@shared/legacy-copy";
import { useLocale } from "@/i18n/locale";

const BRANDS = [
  { slug: "trumpf", name: "TRUMPF" },
  { slug: "bystronic", name: "BYSTRONIC" },
  { slug: "mazak", name: "MAZAK" },
  { slug: "lvd", name: "LVD" },
  { slug: "inne", name: "Inne" },
];

export default function Home() {
  const { t } = useLocale();
  const [query, setQuery] = useState("");
  const { data: machines } = trpc.machines.list.useQuery();

  return (
    <PublicLayout>
      <section className="relative bg-[#2F3438] text-white">
        <img
          src={publicUrl("/photos/cut-metal.jpg")}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[78%_center] opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2F3438] via-[#2F3438]/85 to-[#2F3438]/40" />
        <div className="relative container py-8 lg:py-12">
          <h1 className="text-[clamp(1.85rem,4vw,3.25rem)] font-bold tracking-tight leading-[1.12] max-w-[12em]">
            {t("home.title")}
          </h1>
          <p className="mt-3 text-white/90 text-base max-w-xl text-pretty">{t("home.lead")}</p>
          <div className="mt-6 max-w-xl">
            <CatalogSearch
              id="home-szukaj"
              query={query}
              onQueryChange={setQuery}
              className="max-w-none"
              tone="onDark"
              compact
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {BRANDS.map((brand) => (
              <Link
                key={brand.slug}
                href={catalogHref({ brand: brand.slug })}
                className="inline-flex items-center min-h-11 font-mono text-xs uppercase tracking-[0.12em] px-4 border border-white/30 text-white hover:border-primary hover:text-primary"
              >
                {brand.name}
              </Link>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a href="tel:+48691732408" className="inline-flex items-center gap-2 font-semibold text-primary hover:text-white min-h-11">
              <Phone className="w-4 h-4" />
              +48 691 732 408
            </a>
            <Button asChild variant="outline" className="h-11 bg-transparent text-white border-white/40 hover:bg-white/10">
              <Link href="/kontakt">{t("home.help")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="container py-12 grid gap-10 lg:grid-cols-3">
          <div>
            <h2 className="text-lg font-semibold mb-2">{t("home.choose")}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              TRUMPF, Bystronic, Mazak, LVD — dysze, optyka, filtry i oleje według numeru referencyjnego.
            </p>
            <Link href="/oferta" className="inline-flex items-center gap-2 text-sm font-semibold">
              {t("nav.catalog")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">{t("home.help")}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Model maszyny i numer z etykiety wystarczą do identyfikacji zamiennika.
            </p>
            <Link href="/kontakt" className="inline-flex items-center gap-2 text-sm font-semibold">
              {t("nav.contact")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">{t("home.orderHow")}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{t("order.lead")}</p>
            <Link href="/jak-zamawiac" className="inline-flex items-center gap-2 text-sm font-semibold">
              {t("nav.order")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <div className="container pb-12">
          <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">{OEM_DISCLAIMER}</p>
        </div>
      </section>

      {machines && machines.length > 0 ? (
        <section className="border-t border-border bg-white">
          <div className="container py-8">
            <h2 className="text-xl font-semibold tracking-tight mb-2">{t("home.machines")}</h2>
            <p className="text-sm text-muted-foreground mb-3">{MACHINES_INTRO}</p>
            <ul className="space-y-1">
              {machines.map((m) => (
                <li key={m.id} className="text-sm">
                  <Link href={`/maszyna/${m.slug}`} className="font-medium hover:underline underline-offset-4">
                    {m.title}
                  </Link>
                  {m.contactNote ? <span className="text-muted-foreground"> — {m.contactNote}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </PublicLayout>
  );
}
