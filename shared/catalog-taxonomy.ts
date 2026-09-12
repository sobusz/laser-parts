export type PartKind = "dysze" | "optyka" | "ceramika" | "filtry" | "oleje" | "inne";

export const PART_KINDS: PartKind[] = ["dysze", "optyka", "ceramika", "filtry", "oleje", "inne"];

export const MACHINE_FAMILIES = [
  { id: "turbo", label: "Turbo / Super Turbo" },
  { id: "side-blow", label: "Side Blow" },
  { id: "mazak-3d", label: "Mazak 3D / PRECITEC" },
  { id: "dias-iii", label: "DIAS III" },
] as const;

export function partKindOf(input: { groupName?: string | null; name: string; categorySlug?: string | null }): PartKind {
  const slug = input.categorySlug ?? "";
  const g = `${input.groupName ?? ""} ${input.name}`.toLowerCase();
  if (slug === "optyka" || /optyk|soczew|lustr|spiegel|szkł|szkl|lens/.test(g)) return "optyka";
  if (/dysz|nozzle|tip fi|shower|side blow|\bhk\d|seria by|dysze serii/.test(g)) return "dysze";
  if (/ceramic|ceramik|teflon cover|nozzle holder|obsada|pierścień izol|stozek ceramic|stożek ceramic/.test(g)) {
    return "ceramika";
  }
  if (/filtr/.test(g)) return "filtry";
  if (
    /olej|oil|aceton|topol|wata|biozid|korrosion|stabrex|sanitizer|tellus|degol|aero-shell|omala|ecosyn|anderol|walzkolben/.test(
      g,
    )
  ) {
    return "oleje";
  }
  return "inne";
}

export function machineFamilyOf(input: { groupName?: string | null; name: string }): string | null {
  const g = `${input.groupName ?? ""} ${input.name}`;
  if (/Turbo\s*\/\s*Super Turbo/i.test(g)) return "turbo";
  if (/Side Blow/i.test(g)) return "side-blow";
  if (/Mazak 3D|PRECITEC/i.test(g)) return "mazak-3d";
  if (/DIAS III/i.test(g)) return "dias-iii";
  return null;
}

export function packFromText(description?: string | null, name?: string | null): number | null {
  const text = `${description ?? ""} ${name ?? ""}`;
  const match =
    text.match(/opakowan\w*\s+po\s+(\d+)/i) ||
    text.match(/opak\.?\s*(\d+)\s*szt/i) ||
    text.match(/komplet wkładek\s*\((\d+)\s*szt/i);
  return match ? Number(match[1]) : null;
}

export function brandSlugOf(categorySlug: string | null | undefined): string {
  if (!categorySlug || categorySlug === "optyka") return "";
  return categorySlug;
}

export function formatResultCount(n: number, locale: "pl" | "en"): string {
  if (locale === "en") return n === 1 ? "1 item" : `${n} items`;
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (n === 1) return "1 pozycja";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} pozycje`;
  return `${n} pozycji`;
}
