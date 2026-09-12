import { brandSlugOf, machineFamilyOf, packFromText, partKindOf } from "./catalog-taxonomy";

export const TEST_MACHINE_FAMILIES = [
  { id: "trulaser-test", label: "TruLaser (test)" },
  { id: "bystar-test", label: "ByStar (test)" },
  { id: "optiplex-test", label: "Optiplex (test)" },
  { id: "electra-test", label: "Electra (test)" },
] as const;

const TEST_FAMILY_BY_BRAND: Record<string, string> = {
  trumpf: "trulaser-test",
  bystronic: "bystar-test",
  mazak: "optiplex-test",
  lvd: "electra-test",
};

export type TestAvailability = "in_stock" | "on_order";

export type CatalogTestMock = {
  availability: TestAvailability;
  packSize: number | null;
  salesUnit: "szt." | "opakowanie";
  family: string | null;
};

export function catalogTestMock(input: {
  id: number;
  name: string;
  groupName?: string | null;
  categorySlug?: string | null;
  description?: string | null;
}): CatalogTestMock {
  const kind = partKindOf(input);
  const fromText = packFromText(input.description, input.name);
  const packSize = fromText ?? (kind === "dysze" ? 10 : kind === "filtry" ? 1 : null);
  const salesUnit = packSize && packSize > 1 ? "opakowanie" : "szt.";
  const onRequestCopy = /na zamówienie/i.test(`${input.description ?? ""} ${input.name}`);
  const availability: TestAvailability = onRequestCopy || input.id % 4 === 0 ? "on_order" : "in_stock";
  const confirmed = machineFamilyOf(input);
  const brand = brandSlugOf(input.categorySlug);
  const family = confirmed ?? (brand ? TEST_FAMILY_BY_BRAND[brand] ?? null : null);
  return { availability, packSize, salesUnit, family };
}

export const ARTICLE_TEST_EN: Record<string, { title: string; excerpt: string; body: string }> = {
  optyka: {
    title: "Laser optics",
    excerpt: "Lenses, mirrors and protective windows for CO2 and fiber lasers. Selection is based on the machine model and reference number.",
    body: "Test copy (EN): lenses, mirrors and protective glass. Match the part using the number on the label. Full production article will come from the admin panel.",
  },
  nowosc: {
    title: "PVD-coated nozzles for TRUMPF",
    excerpt: "Chrome PVD nozzles for TRUMPF machines: the coating reduces spatter build-up in the orifice.",
    body: "Test copy (EN): PVD-coated nozzles for TRUMPF. Reference numbers are in the TRUMPF catalogue section.",
  },
  oprogramowanie: {
    title: "JETCAM software",
    excerpt: "JETCAM Expert CAD/CAM — nesting and cutting-machine programming.",
    body: "Test copy (EN): JETCAM Expert CAD/CAM. In Poland we provide implementation, training and support.",
  },
  technologia: {
    title: "Laser cutting technology",
    excerpt: "Introduction to laser cutting: beam generation, process gases and material behaviour.",
    body: "Test copy (EN): beam generation, assist gases and how materials respond. The full article will be maintained in the admin panel.",
  },
};
