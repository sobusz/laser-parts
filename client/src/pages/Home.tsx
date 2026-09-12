import { Link } from "wouter";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/PublicLayout";
import { trpc } from "@/lib/trpc";

const FALLBACK_CATEGORIES = [
  { slug: "trumpf", name: "TRUMPF", description: "Dysze, ceramika, optyka, filtry i oleje." },
  { slug: "bystronic", name: "BYSTRONIC", description: "Części eksploatacyjne i optyka." },
  { slug: "mazak", name: "MAZAK", description: "Dysze i części głowicy." },
  { slug: "lvd", name: "LVD", description: "Elementy eksploatacyjne do wycinarek LVD." },
  { slug: "inne", name: "Inne marki", description: "Amada, Precitec, Prima, Salvagnini — na zamówienie." },
  { slug: "optyka", name: "Optyka", description: "Soczewki Zn-Se, lustra i szkła ochronne." },
];

const CATEGORY_TAGS: Record<string, string> = {
  trumpf: "dysze · optyka · oleje",
  bystronic: "dysze HK/K/NK · soczewki",
  mazak: "tips · side blow · adaptery",
  lvd: "ceramika · obsady dyszy",
  inne: "na zamówienie 10–14 dni",
  optyka: "Zn-Se · lustra · szyby",
};

const CATEGORY_NAME_COLOR: Record<string, string> = {
  trumpf: "#0033BA",
  bystronic: "#FF1100",
  mazak: "#FF5901",
  lvd: "#006699",
                  inne: "#0A0A0A",
  optyka: "#0A0A0A",
};

const TERMS = [
  { title: "Realizacja", desc: "Oferta podstawowa — wysyłka w dniu zamówienia." },
  { title: "Faktura VAT", desc: "zamowienia@laser-parts.pl" },
  { title: "Transport", desc: "Poczta Polska, na życzenie DHL." },
  { title: "Kredyt", desc: "14 dni po weryfikacji." },
];

export default function Home() {
  const { data: categories } = trpc.categories.list.useQuery();
  const { data: products } = trpc.products.list.useQuery({});
  const { data: machines } = trpc.machines.list.useQuery();
  const displayCategories = categories && categories.length > 0 ? categories : FALLBACK_CATEGORIES;

  const countByCategory = new Map<number, number>();
  for (const p of products ?? []) {
    countByCategory.set(p.categoryId, (countByCategory.get(p.categoryId) ?? 0) + 1);
  }

  const catalogCount = products?.length ? String(products.length) : "146";

  return (
    <PublicLayout>
      <section className="bg-background">
        <div className="grid grid-cols-1 xl:grid-cols-2 xl:h-[420px]">
          <div className="relative z-10 flex flex-col justify-center min-w-0 overflow-hidden px-6 sm:px-8 xl:px-10 py-8 sm:py-10">
            <p className="eyebrow text-primary mb-5">Trumpf · Bystronic · Mazak · LVD</p>
            <h1 className="text-foreground font-bold tracking-[-0.04em] leading-[1.05] mb-4 text-[clamp(2rem,5vw,3.25rem)] break-words">
              Części do wycinarek laserowych
            </h1>
            <p className="relative text-muted-foreground text-[15px] leading-relaxed mb-6 max-w-[36ch]">
              Dysze, optyka, ceramika. Oferta podstawowa — wysyłka w dniu zamówienia.
            </p>
            <div className="relative flex flex-col gap-2 max-w-md">
              <a href="tel:+48691732408" className="block">
                <Button size="lg" className="w-full h-12 text-sm justify-center">
                  <Phone className="w-4 h-4" />
                  Zadzwoń · +48 691 732 408
                </Button>
              </a>
              <Link href="/oferta" className="block">
                <Button size="lg" variant="secondary" className="w-full h-12 text-sm justify-center">
                  Przeglądaj ofertę
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative z-0 h-[240px] sm:h-[280px] xl:h-full overflow-hidden">
            <img
              src="/photos/cut-metal.jpg"
              alt="Głowica wycinarki laserowej tnąca arkusz blachy"
              className="absolute inset-0 h-full w-full object-cover object-[68%_center]"
            />
          </div>
        </div>
      </section>

      <section className="bg-black text-white">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/15">
          {[
            { value: catalogCount, label: "pozycji w katalogu" },
            { value: "6", label: "grup marek" },
            { value: "24 h", label: "wysyłka z oferty podstawowej" },
            { value: "14 dni", label: "kredyt kupiecki" },
          ].map((stat) => (
            <div key={stat.label} className="px-6 lg:px-8 py-5 lg:py-6">
              <p className="font-display text-xl font-semibold tracking-tight text-primary">{stat.value}</p>
              <p className="text-sm text-white/60 mt-1 leading-snug">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-background">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 px-6 lg:px-10 pt-16 pb-8">
          <div>
            <p className="eyebrow text-primary mb-3">02 — Oferta</p>
            <h2 className="text-4xl lg:text-6xl font-bold tracking-[-0.05em] text-foreground leading-[0.95]">
              Według
              <br />
              producenta
            </h2>
          </div>
          <Link href="/oferta" className="shrink-0">
            <Button variant="outline" className="h-11 px-5">
              Cała oferta
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <p className="px-6 lg:px-10 pb-8 text-sm text-muted-foreground max-w-xl">
          Nazwy producentów tylko do wskazania przeznaczenia części. Bez logotypów, bez powiązań.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-6 lg:px-10 pb-16">
          {displayCategories.map((cat) => {
            const count = "id" in cat ? countByCategory.get(cat.id) : undefined;
            return (
              <Link key={cat.slug} href={`/oferta?kategoria=${cat.slug}`}>
                <div className="group h-full min-h-[160px] bg-white border border-border hover:border-foreground p-6 flex flex-col">
                  <h3
                    className="font-display text-2xl font-bold tracking-tight underline-offset-4 group-hover:underline"
                    style={{ color: CATEGORY_NAME_COLOR[cat.slug] ?? "#0A0A0A" }}
                  >
                    {cat.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                    {CATEGORY_TAGS[cat.slug] ?? "części eksploatacyjne"}
                    {count !== undefined && count > 0 ? ` · ${count} poz.` : ""}
                  </p>
                  <span className="mt-auto pt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                    Otwórz katalog
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid lg:grid-cols-3 min-h-[520px]">
        <div className="flex flex-col justify-between p-8 lg:p-12 bg-white border-t border-border">
          <div>
            <p className="eyebrow text-primary mb-6">03 — Firma</p>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-[-0.05em] text-foreground leading-[0.95] mb-6">
              Laser
              <br />
              Parts
            </h2>
            <p className="text-muted-foreground text-[15px] leading-relaxed max-w-[36ch]">
              Nie jesteśmy TRUMPF, Bystronic ani Mazak. Części wykonane dla lub przez Laser Parts.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-px bg-border border border-border mt-10">
            {TERMS.map(({ title, desc }) => (
              <div key={title} className="bg-white p-4">
                <h3 className="eyebrow text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-snug">{desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative min-h-[320px] lg:col-span-2 border-t border-border">
          <img
            src="/photos/cut-close.jpg"
            alt="Głowica lasera nad stołem roboczym"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </section>

      <section className="grid md:grid-cols-2">
        <Link
          href="/oprogramowanie"
          className="group relative min-h-[340px] overflow-hidden bg-black text-white p-8 lg:p-12 flex flex-col justify-end"
        >
          <span aria-hidden="true" className="absolute right-6 top-4 font-display text-[7rem] font-bold leading-none text-white/10">
            04
          </span>
          <p className="eyebrow text-white/55 mb-4 relative">Oprogramowanie</p>
          <h2 className="text-3xl lg:text-5xl font-bold tracking-[-0.04em] relative mb-4">JETCAM</h2>
          <span className="inline-flex items-center gap-2 text-sm font-semibold relative">
            CAD/CAM <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
        <Link
          href="/technologia"
          className="group relative min-h-[340px] overflow-hidden bg-primary text-black p-8 lg:p-12 flex flex-col justify-end"
        >
          <span aria-hidden="true" className="absolute right-6 top-4 font-display text-[7rem] font-bold leading-none text-black/10">
            05
          </span>
          <p className="eyebrow text-black/60 mb-4 relative">Baza wiedzy</p>
          <h2 className="text-3xl lg:text-5xl font-bold tracking-[-0.04em] relative mb-4">Technologia</h2>
          <span className="inline-flex items-center gap-2 text-sm font-semibold relative">
            Czytaj <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </section>

      {machines && machines.length > 0 && (
        <section className="py-16 px-6 lg:px-10">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Maszyny używane</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
            {machines.map((m) => (
              <div key={m.id} className="bg-white p-6">
                <h3 className="font-semibold mb-2">{m.title}</h3>
                {m.description && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{m.description}</p>}
                {m.contactNote && <p className="text-sm mt-3">{m.contactNote}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="bg-black text-white">
        <div className="px-6 lg:px-10 py-16 lg:py-24 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
          <h2 className="text-[clamp(2.4rem,6vw,5rem)] font-bold tracking-[-0.05em] leading-[0.92] max-w-3xl">
            Zadzwoń
            <br />
            albo wyślij
            <br />
            zapytanie
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="tel:+48691732408">
              <Button size="lg" className="h-12 px-7">
                +48 691 732 408
              </Button>
            </a>
            <Link href="/zapytanie">
              <Button size="lg" variant="outline" className="h-12 px-7 bg-transparent border-white/30 text-white hover:bg-white hover:text-black">
                Formularz
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
