import { formatResultCount } from "@shared/catalog-taxonomy";

export function resultLabel(count: number, locale: "pl" | "en") {
  return formatResultCount(count, locale);
}
