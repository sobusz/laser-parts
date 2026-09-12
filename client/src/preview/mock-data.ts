import { PRODUCTS } from "../../../server/catalog-data";
import { publicUrl } from "../lib/public-url";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 120);
}

const now = new Date("2026-01-01T00:00:00.000Z");

export const previewCategories = [
  { id: 1, name: "TRUMPF", slug: "trumpf", description: "Dysze, ceramika, optyka, filtry i oleje do wycinarek TRUMPF.", imageUrl: null, sortOrder: 1, createdAt: now },
  { id: 2, name: "BYSTRONIC", slug: "bystronic", description: "Części eksploatacyjne i optyka do wycinarek Bystronic.", imageUrl: null, sortOrder: 2, createdAt: now },
  { id: 3, name: "MAZAK", slug: "mazak", description: "Dysze i części głowicy do laserów Mazak.", imageUrl: null, sortOrder: 3, createdAt: now },
  { id: 4, name: "LVD", slug: "lvd", description: "Elementy eksploatacyjne do wycinarek LVD.", imageUrl: null, sortOrder: 4, createdAt: now },
  { id: 5, name: "Inne marki", slug: "inne", description: "Amada, Precitec, Prima, Salvagnini — na zamówienie.", imageUrl: null, sortOrder: 5, createdAt: now },
  { id: 6, name: "Optyka", slug: "optyka", description: "Soczewki Zn-Se, lustra i szkła ochronne.", imageUrl: null, sortOrder: 6, createdAt: now },
];

const categoryIdBySlug = Object.fromEntries(previewCategories.map((c) => [c.slug, c.id]));

export const previewProducts = PRODUCTS.map((p, index) => ({
  id: index + 1,
  categoryId: categoryIdBySlug[p.category] ?? 5,
  name: p.name,
  slug: slugify(`${p.category}-${p.referenceNumber ?? ""}-${p.orderNumber ?? ""}-${p.name}`),
  referenceNumber: p.referenceNumber ?? null,
  orderNumber: p.orderNumber ?? null,
  description: p.description ?? null,
  specifications: p.specifications ?? null,
  imageUrl: null,
  sketchUrl: p.sketchUrl ? publicUrl(p.sketchUrl) : null,
  groupName: p.groupName,
  price: null,
  unit: "szt.",
  inStock: true,
  featured: false,
  sortOrder: index,
  createdAt: now,
  updatedAt: now,
}));

export const previewArticles = [
  {
    id: 1,
    slug: "optyka",
    section: "optyka" as const,
    title: "Optyka laserowa",
    excerpt: "Soczewki, lustra i szyby ochronne do laserów CO2 i fiber. Dobór na podstawie modelu maszyny i numeru referencyjnego.",
    body: "Soczewki, lustra i szyby ochronne do laserów CO2 i fiber. Dobór na podstawie modelu maszyny i numeru referencyjnego.\n\nPełny artykuł jest w wersji produkcyjnej z panelem administracyjnym.",
    published: true,
    sortOrder: 0,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    slug: "nowosc",
    section: "nowosc" as const,
    title: "Nowość: dysze chromowane PVD do TRUMPF",
    excerpt: "Dysze chromowane PVD do maszyn TRUMPF: powłoka ogranicza przywieranie odprysków do otworu i wydłuża stabilność procesu cięcia.",
    body: "Dysze chromowane PVD do maszyn TRUMPF: powłoka ogranicza przywieranie odprysków do otworu i wydłuża stabilność procesu cięcia. Numery znajdują się w katalogu TRUMPF.",
    published: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    slug: "oprogramowanie",
    section: "oprogramowanie" as const,
    title: "Oprogramowanie JETCAM",
    excerpt: "JETCAM Expert CAD/CAM — oprogramowanie do nestingu i sterowania wycinarką.",
    body: "JETCAM Expert CAD/CAM — oprogramowanie do nestingu i sterowania wycinarką. W Polsce zapewniamy wdrożenie, szkolenia i wsparcie.",
    published: true,
    sortOrder: 2,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 4,
    slug: "technologia",
    section: "technologia" as const,
    title: "Technologia laserowa",
    excerpt: "Wprowadzenie do cięcia laserowego: powstawanie wiązki, gazy procesowe oraz zachowanie materiałów.",
    body: "Wprowadzenie do cięcia laserowego: powstawanie wiązki, gazy procesowe oraz zachowanie materiałów. Pełny tekst jest dostępny w wersji produkcyjnej.",
    published: true,
    sortOrder: 3,
    createdAt: now,
    updatedAt: now,
  },
];

export const previewMachines = [
  {
    id: 1,
    title: "TRUMATIC L3030 (używana)",
    slug: "trumatic-l3030",
    description: "Urządzenie używane. Producent: TRUMPF. Nazwa handlowa: TRUMATIC L3030.",
    imageUrl: null,
    contactNote: "+48 693 606 067 lub laser-parts@laser-parts.pl",
    active: true,
    sortOrder: 0,
    createdAt: now,
    updatedAt: now,
  },
];

export function filterProducts(input?: {
  categorySlug?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  let rows = previewProducts;
  if (input?.categorySlug) {
    const categoryId = categoryIdBySlug[input.categorySlug];
    rows = categoryId ? rows.filter((p) => p.categoryId === categoryId) : [];
  }
  if (input?.search?.trim()) {
    const q = input.search.trim().toLowerCase();
    rows = rows.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.referenceNumber ?? "").toLowerCase().includes(q) ||
        (p.orderNumber ?? "").toLowerCase().includes(q),
    );
  }
  const offset = input?.offset ?? 0;
  const limit = input?.limit ?? 500;
  return rows.slice(offset, offset + limit);
}
