import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { ClipboardPlus, Package, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import PublicLayout from "@/components/PublicLayout";
import PageHeader from "@/components/PageHeader";
import CatalogSearch from "@/components/CatalogSearch";
import { catalogHref } from "@/lib/catalog-url";
import { trpc } from "@/lib/trpc";
import { useInquiry } from "@/contexts/InquiryContext";

function formatPrice(price: string | null) {
  if (!price) return "na zapytanie";
  return `${Number(price).toFixed(2)} zł`;
}

export default function Catalog() {
  const search = useSearch();
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(search);
  const selectedCategory = params.get("kategoria") ?? "";
  const queryFromUrl = params.get("q") ?? "";
  const [searchQuery, setSearchQuery] = useState(queryFromUrl);
  const { addItem } = useInquiry();

  useEffect(() => {
    setSearchQuery(new URLSearchParams(search).get("q") ?? "");
  }, [search]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const next = catalogHref(selectedCategory, searchQuery);
      const current = catalogHref(selectedCategory, queryFromUrl);
      if (next !== current) setLocation(next, { replace: true });
    }, 280);
    return () => window.clearTimeout(handle);
  }, [searchQuery, selectedCategory, queryFromUrl, setLocation]);

  const { data: categories, isLoading: catsLoading } = trpc.categories.list.useQuery();
  const { data: products, isLoading: prodsLoading } = trpc.products.list.useQuery({
    categorySlug: selectedCategory || undefined,
    search: searchQuery || undefined,
  });

  const grouped = useMemo(() => {
    const map = new Map<string, NonNullable<typeof products>>();
    for (const p of products ?? []) {
      const key = p.groupName?.trim() || "Pozostałe";
      const list = map.get(key) ?? [];
      list.push(p);
      map.set(key, list);
    }
    return Array.from(map.entries());
  }, [products]);

  const activeName = categories?.find((c) => c.slug === selectedCategory)?.name;

  function selectCategory(slug: string) {
    setLocation(catalogHref(slug, searchQuery));
  }

  function clearFilters() {
    setSearchQuery("");
    setLocation("/oferta");
  }

  return (
    <PublicLayout>
      <PageHeader
        crumbs={[{ label: "Strona główna", href: "/" }, { label: "Oferta handlowa" }]}
        title={activeName ?? "Oferta handlowa"}
        description="Realizacja z oferty podstawowej w dniu zamówienia — zamowienia@laser-parts.pl. Ceny netto; puste pole oznacza wycenę na zapytanie."
        meta={products ? `${products.length} pozycji` : undefined}
      />

      <div className="tech-grid">
        <div className="container py-10">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 shrink-0">
              <div className="lg:sticky lg:top-20 space-y-4">
                <div className="bg-white border border-border">
                  <h2 className="eyebrow text-muted-foreground px-4 py-3 border-b border-border">Marki</h2>
                  {catsLoading ? (
                    <div className="p-3 space-y-2">
                      {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      <button
                        type="button"
                        onClick={() => selectCategory("")}
                        aria-pressed={selectedCategory === ""}
                        className={`w-full text-left px-4 py-3 transition-colors ${
                          selectedCategory === ""
                            ? "bg-secondary text-white font-medium border-l-2 border-primary"
                            : "hover:bg-muted border-l-2 border-transparent"
                        }`}
                      >
                        Wszystkie
                      </button>
                      {categories?.map((cat) => (
                        <button
                          type="button"
                          key={cat.id}
                          onClick={() => selectCategory(cat.slug)}
                          aria-pressed={selectedCategory === cat.slug}
                          className={`w-full text-left px-4 py-3 transition-colors ${
                            selectedCategory === cat.slug
                              ? "bg-secondary text-white font-medium border-l-2 border-primary"
                              : "hover:bg-muted border-l-2 border-transparent"
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-secondary text-white p-5">
                  <div className="h-1 w-12 bg-primary mb-4" />
                  <p className="font-semibold mb-2">Inne marki</p>
                  <p className="text-xs text-white/70 mb-4 leading-relaxed">
                    Adige, Amada, Precitec, Prima, Salvagnini i inne — na zamówienie, 10–14 dni,
                    min. 1000 zł netto.
                  </p>
                  <Link href="/kontakt">
                    <Button size="sm" className="w-full uppercase tracking-[0.08em] text-[12px]">
                      Zapytaj
                    </Button>
                  </Link>
                </div>
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              <div className="mb-6">
                <CatalogSearch
                  id="szukaj"
                  query={searchQuery}
                  categorySlug={selectedCategory}
                  onQueryChange={setSearchQuery}
                />
              </div>

              {prodsLoading ? (
                <div className="space-y-3">
                  {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-11 w-full" />)}
                </div>
              ) : grouped.length === 0 ? (
                <div className="bg-white border border-border text-center py-16 px-6">
                  <Package className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" aria-hidden="true" />
                  <p className="font-medium mb-1">Brak pozycji dla podanych kryteriów.</p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Szukasz części spoza katalogu? Zadzwoń albo napisz.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button type="button" variant="outline" onClick={clearFilters}>
                      Wyczyść filtry
                    </Button>
                    <a href="tel:+48691732408">
                      <Button type="button" className="gap-2">
                        <Phone className="w-4 h-4" />
                        Zadzwoń
                      </Button>
                    </a>
                    <a href="mailto:zamowienia@laser-parts.pl">
                      <Button type="button" variant="outline">
                        zamowienia@laser-parts.pl
                      </Button>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {grouped.map(([group, rows]) => (
                    <section key={group}>
                      <div className="flex items-baseline gap-4 mb-3">
                        <h2 className="text-lg font-semibold tracking-tight">{group}</h2>
                        <span className="h-px flex-1 bg-border" />
                        <span className="font-mono text-xs text-muted-foreground">{rows.length}</span>
                      </div>
                      <div className="overflow-x-auto border border-border bg-white">
                        <table className="w-full text-[15px]">
                          <caption className="sr-only">Części z grupy {group}</caption>
                          <thead className="bg-secondary text-white">
                            <tr className="text-xs uppercase tracking-[0.08em]">
                              <th scope="col" className="text-left px-4 py-3 font-semibold">Nr ref.</th>
                              <th scope="col" className="text-left px-4 py-3 font-semibold hidden md:table-cell">Nr zam.</th>
                              <th scope="col" className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Szkic</th>
                              <th scope="col" className="text-left px-4 py-3 font-semibold">Nazwa części</th>
                              <th scope="col" className="text-left px-4 py-3 font-semibold">Cena netto</th>
                              <th scope="col" className="px-4 py-3"><span className="sr-only">Akcje</span></th>
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((p) => (
                              <tr
                                key={p.id}
                                className="border-b border-border last:border-0 odd:bg-muted/25 hover:bg-primary/15 transition-colors"
                              >
                                <td className="px-4 py-3 font-mono text-sm font-medium whitespace-nowrap">
                                  {p.referenceNumber ?? "—"}
                                </td>
                                <td className="px-4 py-3 font-mono text-sm text-muted-foreground hidden md:table-cell">
                                  {p.orderNumber ?? "—"}
                                </td>
                                <td className="px-4 py-3 hidden lg:table-cell">
                                  {p.sketchUrl || p.imageUrl ? (
                                    <img
                                      src={p.sketchUrl || p.imageUrl || ""}
                                      alt={`Szkic: ${p.name}`}
                                      className="h-12 w-12 object-contain"
                                    />
                                  ) : (
                                    <span className="text-muted-foreground">—</span>
                                  )}
                                </td>
                                <td className="px-4 py-3">
                                  <Link href={`/produkt/${p.slug}`} className="font-medium underline decoration-border decoration-2 underline-offset-4 hover:decoration-primary">
                                    {p.name}
                                  </Link>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap font-mono text-sm">
                                  {formatPrice(p.price)}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <Button
                                    variant="outline"
                                    className="gap-1.5 h-10"
                                    aria-label={`Dodaj ${p.name} do zapytania`}
                                    onClick={() => {
                                      addItem({
                                        productId: p.id,
                                        name: p.name,
                                        referenceNumber: p.referenceNumber,
                                        unit: p.unit,
                                      });
                                      toast.success("Dodano do zapytania");
                                    }}
                                  >
                                    <ClipboardPlus className="w-4 h-4" />
                                    <span className="hidden sm:inline">Do zapytania</span>
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
