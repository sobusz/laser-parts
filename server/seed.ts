// Loaded here as well as in _core/index.ts so `pnpm seed` works as a standalone script.
import "dotenv/config";
import { getDb, getCategories, createCategory, createProduct, updateProduct, getArticles, createArticle, updateArticle, upsertUser, getUserByEmail, getProducts } from "./db";
import { hashPassword } from "./password";
import { PRODUCTS } from "./catalog-data";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 120);
}

const CATEGORIES = [
  { name: "TRUMPF", slug: "trumpf", description: "Dysze, ceramika, optyka, filtry i oleje do wycinarek TRUMPF.", sortOrder: 1 },
  { name: "BYSTRONIC", slug: "bystronic", description: "Części eksploatacyjne i optyka do wycinarek Bystronic.", sortOrder: 2 },
  { name: "MAZAK", slug: "mazak", description: "Dysze i części głowicy do laserów Mazak.", sortOrder: 3 },
  { name: "LVD", slug: "lvd", description: "Elementy eksploatacyjne do wycinarek LVD.", sortOrder: 4 },
  { name: "Inne marki", slug: "inne", description: "Części na zamówienie: Amada, Precitec, Prima, Salvagnini i inne.", sortOrder: 5 },
  { name: "Optyka", slug: "optyka", description: "Soczewki Zn-Se, lustra i szkła ochronne.", sortOrder: 6 },
];

function catalogSlug(p: (typeof PRODUCTS)[number]) {
  return slugify(`${p.category}-${p.referenceNumber ?? ""}-${p.orderNumber ?? ""}-${p.name}`);
}

const ARTICLES = [
  {
    slug: "optyka",
    section: "optyka" as const,
    title: "Optyka laserowa",
    excerpt: "Soczewki II-VI i Ophir, lustra oraz szkła ochronne do laserów CO2 i fiber.",
    body: `Oferujemy optykę do przemysłowych wycinarek laserowych: soczewki do laserów CO2 (II-VI / Ophir), lustra plano, sferyczne i chłodzone wodą oraz szkła ochronne do laserów fiber i dyskowych.

Soczewki Duralens
Soczewki dla High-Power CO2, kompatybilne z laserami CO2 na rynku. Zatwierdzone i używane przez producentów maszyn OEM. Wysoka trwałość i dokładność, obróbka CNC, absorpcja ≤ 0,2%.

Soczewki o obniżonej absorpcji
Absorpcja < 0,15%, maksymalna stabilizacja wiązki, odporność na odpryski i wilgoć. Rekomendowane także dla laserów powyżej 5 kW oraz cięcia aluminium i stali wysokostopowych.

Soczewki o najniższej absorpcji
Absorpcja < 0,13%. Przezroczysta powłoka pozwala wiązce HeNe być widoczną na detalu. Soczewki można sprawdzać na filtrach polaryzujących pod kątem naprężeń termicznych.

Lustra plano Cu i Si
Transport wiązki z rezonatora do głowicy opiera się na lustrach. Bazą jest krzem (Si) — niska masa, osie ruchome — lub miedź (Cu) — przewodność cieplna i możliwość chłodzenia. Właściwości optyczne (odbicie, przesunięcie fazowe) wynikają z powłok.

Lustra Cu chłodzone wodą
Kanały chłodzące tuż pod powłoką ograniczają ekspozycję cieplną w maszynach dużej mocy. Rozwiązanie możliwe w lustrach miedzianych.

Lustra sferyczne
Mała średnica wiązki ma dużą rozbieżność i wysoką gęstość. Średnicę zwiększa układ teleskopowy: lustro wypukłe + wklęsłe, na bazie miedzi.

Szkła ochronne
Dla laserów fiber i dyskowych. Chronią soczewkę fokusującą przed odpryskami i dymem. Po zabrudzeniu lub zarysowaniu wymagają wymiany.

Oprawki Amada
Wymienne oprawki soczewek do laserów Amada CO2: szybka wymiana bez śrub, O-ring zamiast toksycznej substancji, wielokrotnego użytku.

Dobór: prosimy o kontakt z modelem maszyny i numerem referencyjnym.`,
  },
  {
    slug: "nowosc",
    section: "nowosc" as const,
    title: "Nowość: dysze chromowane PVD do TRUMPF",
    excerpt: "Pokrycie chromem ogranicza przywieranie odprysków i chroni otwór dyszy.",
    body: `Problemy ze zniszczonymi dyszami? Przyklejenia odprysków? Mamy rozwiązanie.

Rozprysk, który przywiera do dyszy, rozregulowuje ognisko, pogarsza działanie czujników pojemnościowych i zakłóca ciśnienie gazów roboczych. Skutkiem może być zła jakość cięcia albo przerwanie procesu. Miedź jest delikatna — otwór dyszy ulega rozkalibrowaniu. Lepiej powlekać dysze tak, aby rozpryski nie przywierały.

Proponujemy dysze do wycinarek TRUMPF z pokryciem chromowym PVD.

Pokrycie PVD chromowe
Polecane dla stali „czarnej”, stali nierdzewnych i kwasoodpornych. Rozpryski nie przywierają do zewnętrznych ani wewnętrznych części dyszy. Odpryski z wnętrza są wydmuchiwane przez gaz roboczy. Sprawdzają się także przy foliowanych arkuszach blach nierdzewnych i aluminiowych — roztopiona folia nie przywiera, a pozostałości łatwo zetrzeć.

Oferta dysz chromowanych znajduje się w katalogu TRUMPF.`,
  },
  {
    slug: "oprogramowanie",
    section: "oprogramowanie" as const,
    title: "Oprogramowanie JETCAM",
    excerpt: "JETCAM Expert CAD/CAM do programowania wycinarek laserowych, plazmowych i wodnych.",
    body: `JETCAM Expert CAD/CAM oraz komplet programów dopasowują się do wielkości firmy — od małych zakładów do korporacji.

JETCAM to oprogramowanie CAD/CAM do automatycznego programowania maszyn do cięcia blach. Stosowane przez ponad 10 000 użytkowników w ponad 70 krajach. Oferuje nesting i programowanie NC dla wycinarek laserowych, plazmowych, wodnych oraz wykrawarek.

Główne funkcje
- Automatyczny nesting minimalizujący odpad
- Postprocesory NC dla Trumpf, Bystronic, Mazak, LVD, Amada i innych
- Integracja z ERP/MES (JETCAM Orders)

Wersje
JETCAM Expert — programowanie NC, import DXF/DWG/IGES/STEP, nesting, symulacja cięcia.
JETCAM Orders — zarządzanie zleceniami, planowanie nestingu, praca sieciowa.

Jako partner JETCAM w Polsce oferujemy wsparcie, szkolenia i wdrożenia. Zapytania: laser-parts@laser-parts.pl.`,
  },
  {
    slug: "technologia",
    section: "technologia" as const,
    title: "Technologia laserowa",
    excerpt: "Podstawy zastosowania technologii laserowej w metalurgii oraz kluczowe elementy eksploatacyjne.",
    body: `Zachęcamy do lektury o podstawach zastosowania technologii laserowej w metalurgii. Przybliżamy procesy i metody wykorzystania urządzeń laserowych.

Wycinarka laserowa to precyzyjne urządzenie przemysłowe, w którym skoncentrowana wiązka umożliwia cięcie, grawerowanie i perforowanie materiałów. Jakość elementów optycznych i eksploatacyjnych wpływa na dokładność procesu.

Kluczowe elementy
Dysze tnące — kierują gaz tnący (azot, tlen, powietrze). Geometria i stan dyszy wpływają na krawędź cięcia.
Soczewki fokusujące — skupiają wiązkę. Zanieczyszczenie obniża jakość cięcia.
Ceramika głowicy — pozycjonowanie dyszy i izolacja czujnika pojemnościowego.
Szyby ochronne — chronią soczewkę przed odpryskami.

Konserwacja
Regularna inspekcja dyszy, czyszczenie optyki dedykowanymi środkami, kontrola ceramiki. Części prezentowane w ofercie są częściami wykonanymi dla lub przez Laser Parts. Odniesienia do numerów katalogowych producentów służą orientacji.`,
  },
];

export async function seedIfEmpty() {
  const db = await getDb();
  if (!db) {
    console.warn("[Seed] Brak połączenia z bazą — pomijam seed.");
    return;
  }

  const email = process.env.ADMIN_EMAIL ?? "admin@laser-parts.pl";
  const password = process.env.ADMIN_PASSWORD ?? "laserparts-admin";
  const existingAdmin = await getUserByEmail(email);
  if (!existingAdmin?.passwordHash) {
    await upsertUser({
      openId: existingAdmin?.openId ?? `local:${email}`,
      email,
      name: "Administrator",
      loginMethod: "password",
      role: "admin",
      passwordHash: await hashPassword(password),
      lastSignedIn: new Date(),
    });
  }

  let cats = await getCategories();
  const existingCatSlugs = new Set(cats.map((c) => c.slug));
  for (const cat of CATEGORIES) {
    if (!existingCatSlugs.has(cat.slug)) {
      await createCategory(cat);
    }
  }
  cats = await getCategories();
  const bySlug = Object.fromEntries(cats.map((c) => [c.slug, c.id]));

  const existingProducts = await getProducts({ limit: 5000 });
  const claimed = new Set<number>();
  const catalogRefCount = new Map<string, number>();
  for (const p of PRODUCTS) {
    if (!p.referenceNumber) continue;
    catalogRefCount.set(p.referenceNumber, (catalogRefCount.get(p.referenceNumber) ?? 0) + 1);
  }

  let created = 0;
  let updated = 0;
  for (let index = 0; index < PRODUCTS.length; index++) {
    const p = PRODUCTS[index];
    const categoryId = bySlug[p.category];
    if (!categoryId) continue;
    const slug = catalogSlug(p);
    const payload = {
      categoryId,
      name: p.name,
      slug,
      referenceNumber: p.referenceNumber ?? null,
      orderNumber: p.orderNumber ?? null,
      groupName: p.groupName,
      description: p.description ?? null,
      specifications: p.specifications ?? null,
      sketchUrl: p.sketchUrl ?? null,
      unit: "szt.",
      inStock: true,
      featured: false,
      sortOrder: index,
    };

    const byExactSlug = existingProducts.find((row) => row.slug === slug && !claimed.has(row.id));
    const byName = existingProducts.find(
      (row) => row.name === p.name && row.groupName === p.groupName && !claimed.has(row.id),
    );
    const uniqueRef =
      p.referenceNumber &&
      catalogRefCount.get(p.referenceNumber) === 1
        ? existingProducts.find((row) => row.referenceNumber === p.referenceNumber && !claimed.has(row.id))
        : undefined;
    const match = byExactSlug ?? byName ?? uniqueRef;

    if (match) {
      claimed.add(match.id);
      await updateProduct(match.id, payload);
      updated += 1;
    } else {
      await createProduct(payload);
      created += 1;
    }
  }

  const existingArticles = await getArticles();
  for (let i = 0; i < ARTICLES.length; i++) {
    const a = ARTICLES[i];
    const found = existingArticles.find((row) => row.slug === a.slug);
    if (found) {
      await updateArticle(found.id, { ...a, published: true, sortOrder: i });
    } else {
      await createArticle({ ...a, published: true, sortOrder: i });
    }
  }

  console.log(`[Seed] Katalog: ${PRODUCTS.length} pozycji (nowe ${created}, zaktualizowane ${updated}). Login admin:`, email);
}

if (process.argv[1] && /seed\.(ts|js)$/.test(process.argv[1])) {
  seedIfEmpty()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

