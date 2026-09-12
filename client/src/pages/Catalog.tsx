import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { Package, Phone } from "lucide-react";
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
import CatalogSearch from "@/components/CatalogSearch";
import QuantityStepper from "@/components/QuantityStepper";
import { catalogHref, parseCatalogSearch } from "@/lib/catalog-url";
import { OTHER_OEM } from "@shared/legacy-copy";
import {
  MACHINE_FAMILIES,
  PART_KINDS,
  brandSlugOf,
  partKindOf,
  type PartKind,
} from "@shared/catalog-taxonomy";
import { TEST_MACHINE_FAMILIES, catalogTestMock } from "@shared/catalog-test-mocks";
import { resultLabel } from "@/lib/plural";
import { trpc } from "@/lib/trpc";
import { useInquiry } from "@/contexts/InquiryContext";
import { useLocale } from "@/i18n/locale";
import type { MessageKey } from "@/i18n/messages";

const BRANDS = [
  { slug: "trumpf", name: "TRUMPF" },
  { slug: "bystronic", name: "BYSTRONIC" },
  { slug: "mazak", name: "MAZAK" },
  { slug: "lvd", name: "LVD" },
  { slug: "inne", name: "Inne marki" },
];

const ALL_FAMILIES = [...MACHINE_FAMILIES, ...TEST_MACHINE_FAMILIES];

function sketchOf(p: { sketchUrl: string | null; imageUrl: string | null }) {
  return p.sketchUrl || p.imageUrl || null;
}

function chunkBySharedSketch<T extends { sketchUrl: string | null; imageUrl: string | null }>(rows: T[]) {
  const chunks: { sketch: string | null; rows: T[] }[] = [];
  for (const row of rows) {
    const sketch = sketchOf(row);
    const last = chunks.at(-1);
    if (last && sketch && last.sketch === sketch) last.rows.push(row);
    else chunks.push({ sketch, rows: [row] });
  }
  return chunks;
}

type ProductRow = {
  id: number;
  name: string;
  slug: string;
  referenceNumber: string | null;
  orderNumber: string | null;
  description: string | null;
  groupName: string | null;
  unit: string;
  sketchUrl: string | null;
  imageUrl: string | null;
  categoryId: number;
};

export default function Catalog() {
  const { t, locale } = useLocale();
  const search = useSearch();
  const [, setLocation] = useLocation();
  const filters = parseCatalogSearch(search);
  const [searchQuery, setSearchQuery] = useState(filters.q);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { addItem, items, updateQuantity } = useInquiry();

  useEffect(() => {
    setSearchQuery(parseCatalogSearch(search).q);
  }, [search]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const next = catalogHref({ ...filters, q: searchQuery });
      const current = catalogHref(filters);
      if (next !== current) setLocation(next, { replace: true });
    }, 280);
    return () => window.clearTimeout(handle);
  }, [searchQuery, filters.brand, filters.kind, filters.model, filters.q, setLocation]);

  const { data: categories } = trpc.categories.list.useQuery();
  const { data: products, isLoading: prodsLoading } = trpc.products.list.useQuery({});

  const categoryById = useMemo(
    () => new Map((categories ?? []).map((c) => [c.id, c])),
    [categories],
  );

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    return (products ?? []).filter((p) => {
      const slug = categoryById.get(p.categoryId)?.slug ?? "";
      const brand = brandSlugOf(slug);
      const kind = partKindOf({ groupName: p.groupName, name: p.name, categorySlug: slug });
      const family = catalogTestMock({
        id: p.id,
        name: p.name,
        groupName: p.groupName,
        categorySlug: slug,
        description: p.description,
      }).family;
      if (filters.brand && brand !== filters.brand) return false;
      if (filters.kind && kind !== filters.kind) return false;
      if (filters.model && family !== filters.model) return false;
      if (q) {
        const blob = `${p.name} ${p.referenceNumber ?? ""} ${p.orderNumber ?? ""}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [products, categoryById, filters]);

  const modelOptions = useMemo(() => {
    if (!filters.brand) return [];
    const ids = new Set<string>();
    for (const p of products ?? []) {
      const slug = categoryById.get(p.categoryId)?.slug ?? "";
      if (brandSlugOf(slug) !== filters.brand) continue;
      const family = catalogTestMock({
        id: p.id,
        name: p.name,
        groupName: p.groupName,
        categorySlug: slug,
        description: p.description,
      }).family;
      if (family) ids.add(family);
    }
    return ALL_FAMILIES.filter((f) => ids.has(f.id));
  }, [products, categoryById, filters.brand]);

  const grouped = useMemo(() => {
    const map = new Map<string, ProductRow[]>();
    for (const p of filtered) {
      const key = p.groupName?.trim() || "Pozostałe";
      const list = map.get(key) ?? [];
      list.push(p);
      map.set(key, list);
    }
    return Array.from(map.entries());
  }, [filtered]);

  function setFilter(patch: Partial<typeof filters>) {
    setLocation(catalogHref({ ...filters, q: searchQuery, ...patch }));
  }

  function clearFilters() {
    setSearchQuery("");
    setLocation("/oferta");
  }

  function addProduct(p: ProductRow) {
    if (items.some((item) => item.productId === p.id)) return;
    const mock = catalogTestMock({
      id: p.id,
      name: p.name,
      groupName: p.groupName,
      categorySlug: categoryById.get(p.categoryId)?.slug,
      description: p.description,
    });
    addItem({
      productId: p.id,
      name: p.name,
      referenceNumber: p.referenceNumber,
      unit: mock.salesUnit,
      packSize: mock.packSize,
      quantity: 1,
    });
    toast.success(t("catalog.added"));
  }

  function updateProduct(p: ProductRow, count: number) {
    const index = items.findIndex((item) => item.productId === p.id);
    if (index < 0) return;
    updateQuantity(index, count);
    toast.success(t("catalog.updated"));
  }

  const kindLabel = (kind: PartKind) => t(`kind.${kind}` as MessageKey);

  return (
    <PublicLayout>
      <div className="border-b border-border bg-white">
        <div className="container py-6 lg:py-8">
          <nav aria-label="breadcrumb" className="text-sm font-mono text-muted-foreground mb-3">
            <Link href="/" className="underline underline-offset-4">
              {locale === "en" ? "Home" : "Strona główna"}
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="text-foreground">{t("catalog.title")}</span>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{t("catalog.title")}</h1>
          <p className="text-sm text-muted-foreground max-w-2xl mb-5">{t("catalog.intro")}</p>
          <CatalogSearch
            id="szukaj"
            query={searchQuery}
            filters={filters}
            onQueryChange={setSearchQuery}
            compact
            className="max-w-none"
          />
          <p className="mt-3 text-sm font-medium tabular-nums" aria-live="polite">
            {prodsLoading ? "…" : resultLabel(filtered.length, locale)}
          </p>
        </div>
      </div>

      <div className="container py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-60 shrink-0">
            <button
              type="button"
              className="lg:hidden w-full h-11 border border-border bg-white px-4 text-sm font-semibold mb-3"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen((open) => !open)}
            >
              {t("catalog.filters")}
            </button>
            <div className={`${filtersOpen ? "block" : "hidden"} lg:block space-y-4 lg:sticky lg:top-24`}>
              <FilterGroup
                title={t("catalog.brand")}
                value={filters.brand}
                allLabel={t("catalog.all")}
                options={BRANDS.map((b) => ({ id: b.slug, label: b.name }))}
                onChange={(brand) => setFilter({ brand, model: "" })}
              />
              <FilterGroup
                title={t("catalog.kind")}
                value={filters.kind}
                allLabel={t("catalog.all")}
                options={PART_KINDS.map((kind) => ({ id: kind, label: kindLabel(kind) }))}
                onChange={(kind) => setFilter({ kind })}
              />
              {modelOptions.length > 0 ? (
                <FilterGroup
                  title={t("catalog.model")}
                  value={filters.model}
                  allLabel={t("catalog.all")}
                  options={modelOptions.map((m) => ({ id: m.id, label: m.label }))}
                  onChange={(model) => setFilter({ model })}
                />
              ) : null}
              <p className="text-xs text-muted-foreground leading-relaxed">{OTHER_OEM}</p>
              <Link href="/kontakt" className="text-sm font-semibold underline underline-offset-4">
                {t("home.help")}
              </Link>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {prodsLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : grouped.length === 0 ? (
              <div className="bg-white border border-border text-center py-12 px-6">
                <Package className="w-10 h-10 text-muted-foreground/40 mx-auto mb-4" aria-hidden="true" />
                <p className="font-medium mb-2">{t("catalog.empty")}</p>
                <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">{t("catalog.emptyHint")}</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button type="button" variant="outline" onClick={clearFilters}>
                    {t("catalog.clear")}
                  </Button>
                  <a href="tel:+48691732408">
                    <Button type="button" className="gap-2">
                      <Phone className="w-4 h-4" />
                      {t("catalog.call")}
                    </Button>
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {grouped.map(([group, rows]) => {
                  const chunks = chunkBySharedSketch(rows);
                  const note = rows.find((r) => r.description)?.description;
                  return (
                    <section key={group}>
                      <h2 className="text-lg font-semibold tracking-tight mb-2">{group}</h2>
                      <div className="hidden md:block border border-border bg-white overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="hover:bg-transparent">
                              <TableHead className="pl-4 w-[9.5rem]">{t("catalog.ref")}</TableHead>
                              <TableHead className="w-[11rem] text-center">{t("catalog.sketch")}</TableHead>
                              <TableHead>{t("catalog.name")}</TableHead>
                              <TableHead className="w-48 pr-4 text-right">{t("catalog.add")}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {chunks.flatMap((chunk) =>
                              chunk.rows.map((p, i) => (
                                <TableRow key={p.id} className="hover:bg-muted/40">
                                  <TableCell className="pl-4 align-middle font-mono text-sm whitespace-nowrap">
                                    <div>{p.referenceNumber ?? "—"}</div>
                                    {p.orderNumber ? <div className="text-muted-foreground/70">{p.orderNumber}</div> : null}
                                  </TableCell>
                                  {i === 0 ? (
                                    <TableCell
                                      rowSpan={chunk.rows.length}
                                      className="align-middle text-center border-x border-border px-3 py-4"
                                    >
                                      {chunk.sketch ? (
                                        <img src={chunk.sketch} alt="" className="mx-auto w-[160px] max-w-full h-auto" />
                                      ) : (
                                        <Package className="w-8 h-8 text-muted-foreground/40 mx-auto" aria-hidden="true" />
                                      )}
                                    </TableCell>
                                  ) : null}
                                  <TableCell className="whitespace-normal">
                                    <Link href={`/produkt/${p.slug}`} className="text-sm font-medium hover:underline underline-offset-4">
                                      {p.name}
                                    </Link>
                                  </TableCell>
                                  <TableCell className="pr-4 align-top text-right">
                                    <RowActions
                                      productId={p.id}
                                      inList={items.some((item) => item.productId === p.id)}
                                      countInInquiry={items.find((item) => item.productId === p.id)?.quantity ?? 1}
                                      onAdd={() => addProduct(p)}
                                      onUpdate={(count) => updateProduct(p, count)}
                                    />
                                  </TableCell>
                                </TableRow>
                              )),
                            )}
                          </TableBody>
                        </Table>
                      </div>
                      <ul className="md:hidden space-y-3">
                        {rows.map((p) => (
                          <li key={p.id} className="bg-white border border-border p-4">
                            <p className="font-mono text-xs text-muted-foreground">{p.referenceNumber ?? "—"}</p>
                            <Link href={`/produkt/${p.slug}`} className="font-medium text-sm mt-1 block">
                              {p.name}
                            </Link>
                            <div className="mt-3">
                              <RowActions
                                productId={p.id}
                                inList={items.some((item) => item.productId === p.id)}
                                countInInquiry={items.find((item) => item.productId === p.id)?.quantity ?? 1}
                                onAdd={() => addProduct(p)}
                                onUpdate={(count) => updateProduct(p, count)}
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                      {note ? <p className="text-sm text-muted-foreground mt-3 max-w-3xl">{note}</p> : null}
                    </section>
                  );
                })}
              </div>
            )}
            <p className="mt-8 text-sm text-muted-foreground border-t border-border pt-6">{t("catalog.promo")}</p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

function FilterGroup({
  title,
  value,
  allLabel,
  options,
  onChange,
}: {
  title: string;
  value: string;
  allLabel: string;
  options: { id: string; label: string }[];
  onChange: (id: string) => void;
}) {
  return (
    <fieldset className="bg-white border border-border">
      <legend className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</legend>
      <div className="divide-y divide-border border-t border-border">
        <button
          type="button"
          aria-pressed={value === ""}
          onClick={() => onChange("")}
          className={`w-full text-left px-4 py-2.5 text-sm ${value === "" ? "bg-muted font-medium" : "hover:bg-muted/60"}`}
        >
          {allLabel}
        </button>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={value === option.id}
            onClick={() => onChange(option.id)}
            className={`w-full text-left px-4 py-2.5 text-sm ${value === option.id ? "bg-muted font-medium" : "hover:bg-muted/60"}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function RowActions({
  productId,
  inList,
  countInInquiry,
  onAdd,
  onUpdate,
}: {
  productId: number;
  inList: boolean;
  countInInquiry: number;
  onAdd: () => void;
  onUpdate: (count: number) => void;
}) {
  const { t } = useLocale();
  const [count, setCount] = useState(countInInquiry);
  useEffect(() => {
    if (inList) setCount(countInInquiry);
  }, [inList, countInInquiry]);

  return (
    <div className="flex flex-col items-stretch md:inline-flex md:items-end gap-2">
      <Button
        type="button"
        size="sm"
        className="h-11 px-3"
        onClick={() => (inList ? onUpdate(count) : onAdd())}
      >
        {inList ? t("catalog.update") : t("catalog.add")}
      </Button>
      {inList ? (
        <QuantityStepper id={`count-${productId}`} value={count} onChange={setCount} />
      ) : null}
    </div>
  );
}
