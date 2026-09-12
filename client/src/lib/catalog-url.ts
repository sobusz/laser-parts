export function catalogHref(category = "", query = "") {
  const params = new URLSearchParams();
  if (category) params.set("kategoria", category);
  if (query.trim()) params.set("q", query.trim());
  const search = params.toString();
  return search ? `/oferta?${search}` : "/oferta";
}
