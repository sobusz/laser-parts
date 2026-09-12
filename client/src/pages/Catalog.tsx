import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { ClipboardPlus, Package, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import PublicLayout from "@/components/PublicLayout";
import PageHeader from "@/components/PageHeader";
import CatalogSearch from "@/components/CatalogSearch";
import CommercialTerms from "@/components/CommercialTerms";
import { catalogHref } from "@/lib/catalog-url";
import { CATALOG_INTRO, OTHER_OEM } from "@shared/legacy-copy";
import { trpc } from "@/lib/trpc";
import { useInquiry } from "@/contexts/InquiryContext";

function sketchOf(p: { sketchUrl: string | null; imageUrl: string | null }) {
  return p.sketchUrl || p.imageUrl || null;
}

function chunkBySharedSketch<T extends { sketchUrl: string | null; imageUrl: string | null }>(rows: T[]) {
  const chunks: { sketch: string | null; rows: T[] }[] = [];
  for (const row of rows) {
    const sketch = sketchOf(row);
    const last = chunks.at(-1);
    if (last && sketch && last.sketch === sketch) {
      last.rows.push(row);
    } else {
      chunks.push({ sketch, rows: [row] });
    }
  }
  return chunks;
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
        title={activeName ?? "Oferta"}
        description={CATALOG_INTRO}
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
                  <p className="text-xs text-white/70 mb-4 leading-relaxed text-pretty">{OTHER_OEM}</p>
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
              <div className="mb-8">
                <CommercialTerms compact />
              </div>

              {prodsLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-36 w-full" />)}
                </div>
              ) : grouped.length === 0 ? (
                <div className="bg-white border border-border text-center py-16 px-6">
                  <Package className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" aria-hidden="true" />
                  <p className="font-medium mb-2">Brak pozycji spełniającej kryteria wyszukiwania.</p>
                  <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed text-pretty">
                    Numer może być zapisany w innej formie albo część jest dostępna wyłącznie na zamówienie. Prosimy o kontakt telefoniczny lub e-mail:{" "}
                    <a href="mailto:zamowienia@laser-parts.pl" className="whitespace-nowrap underline underline-offset-2">
                      zamowienia@laser-parts.pl
                    </a>
                    .
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
                <div className="space-y-10">
                  {grouped.map(([group, rows]) => {
                    const chunks = chunkBySharedSketch(rows);
                    const note = rows.find((r) => r.description)?.description;
                    return (
                    <section key={group}>
                      <h2 className="text-lg font-semibold tracking-tight mb-2">{group}</h2>
                      <div className="border border-border bg-white">
                        <Table>
                          <TableHeader>
                            <TableRow className="hover:bg-transparent">
                              <TableHead className="pl-4 w-[9.5rem]">Nr referencyjny</TableHead>
                              <TableHead className="w-[13.5rem] text-center">Szkic</TableHead>
                              <TableHead className="pr-4">Nazwa części</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {chunks.flatMap((chunk) =>
                              chunk.rows.map((p, i) => (
                                <TableRow key={p.id} className="hover:bg-muted/40">
                                  <TableCell className="pl-4 align-middle font-mono text-sm whitespace-nowrap">
                                    <div>{p.referenceNumber ?? "—"}</div>
                                    {p.orderNumber ? (
                                      <div className="text-muted-foreground/70">{p.orderNumber}</div>
                                    ) : null}
                                  </TableCell>
                                  {i === 0 ? (
                                    <TableCell
                                      rowSpan={chunk.rows.length}
                                      className="align-middle text-center border-x border-border w-[13.5rem] px-4 py-6 whitespace-normal"
                                    >
                                      {chunk.sketch ? (
                                        <img
                                          src={chunk.sketch}
                                          alt={`Szkic: ${group}`}
                                          className="mx-auto w-[200px] max-w-full h-auto"
                                        />
                                      ) : (
                                        <Package className="w-8 h-8 text-muted-foreground/40 mx-auto" aria-hidden="true" />
                                      )}
                                    </TableCell>
                                  ) : null}
                                  <TableCell className="pr-4 whitespace-normal">
                                    <div className="flex items-center justify-between gap-3">
                                      <Link
                                        href={`/produkt/${p.slug}`}
                                        className="text-sm hover:underline underline-offset-4"
                                      >
                                        {p.name}
                                      </Link>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="shrink-0 h-8 w-8"
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
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )),
                            )}
                          </TableBody>
                        </Table>
                      </div>
                      {note ? (
                        <p className="text-sm text-muted-foreground mt-3 max-w-3xl">{note}</p>
                      ) : null}
                    </section>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
