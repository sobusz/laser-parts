export type CatalogFilters = {
  brand?: string;
  kind?: string;
  model?: string;
  q?: string;
};

export function parseCatalogSearch(search: string): Required<CatalogFilters> {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const legacy = params.get("kategoria") ?? "";
  let brand = params.get("marka") ?? "";
  let kind = params.get("rodzaj") ?? "";
  if (!brand && !kind && legacy) {
    if (legacy === "optyka") kind = "optyka";
    else brand = legacy;
  }
  return {
    brand,
    kind,
    model: params.get("model") ?? "",
    q: params.get("q") ?? "",
  };
}

export function catalogHref(filters: CatalogFilters | string = {}, query = "") {
  const next: CatalogFilters =
    typeof filters === "string" ? { brand: filters === "optyka" ? "" : filters, kind: filters === "optyka" ? "optyka" : "", q: query } : filters;
  const params = new URLSearchParams();
  if (next.brand) params.set("marka", next.brand);
  if (next.kind) params.set("rodzaj", next.kind);
  if (next.model) params.set("model", next.model);
  if (next.q?.trim()) params.set("q", next.q.trim());
  const search = params.toString();
  return search ? `/oferta?${search}` : "/oferta";
}
