// Loaded here as well as in _core/index.ts so `pnpm seed` works as a standalone script.
import "dotenv/config";
import { getDb, getCategories, createCategory, createProduct, updateProduct, getArticles, createArticle, updateArticle, upsertUser, getUserByEmail, getProducts, getUsedMachines, createUsedMachine, updateUsedMachine } from "./db";
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
  { name: "Inne marki", slug: "inne", description: "Adige, Amada, Precitec, Prima, Salvagnini i inne — na zamówienie, 10–14 dni, min. 1000 zł netto.", sortOrder: 5 },
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
    excerpt: "Soczewki, lustra i szyby ochronne do laserów CO2 i fiber. Dobór na podstawie modelu maszyny i numeru referencyjnego.",
    body: `Oferta: soczewki · lustra · szkła ochronne

Soczewki Duralens
Soczewki dla High-Power CO2. Kompatybilne ze wszystkimi laserami CO2 na rynku. Zatwierdzone i używane przez producentów maszyn OEM. Zaprojektowane dla wysokiej trwałości i dokładności. Wytwarzane na obrabiarce CNC dla powtarzalności. Absorpcja ≤ 0,2%.

Soczewki o obniżonej absorpcji ciepła wiązki (High-Power CO2)
Kompatybilne ze wszystkimi laserami CO2 na rynku. Gwarantowana absorpcja < 0,15%. Maksymalna stabilizacja wiązki skupiającej. Najwyższa odporność na odpryski. Prostsze czyszczenie i utrzymanie. Odporne na wilgoć. Najtrwalsza powłoka na rynku. Rekomendowane przez producentów OEM. Proponowane dla laserów CO2, w tym powyżej 5 kW. Nieradioaktywna powłoka. Do cięcia aluminium i stali wysokostopowych.

Soczewki o najniższej absorpcji ciepła wiązki (High-Power CO2)
Gwarantowana absorpcja < 0,13%. Maksymalna stabilizacja wiązki tnącej. Przezroczysta powłoka pozwala wiązce HeNe być widoczną na detalu. Soczewki można sprawdzać na filtrach polaryzujących w celu wykrycia naprężeń termicznych. Rekomendowane przez producentów OEM. Proponowane dla laserów CO2, w tym powyżej 5 kW. Nieradioaktywna powłoka. Do cięcia aluminium i stali wysokostopowych.

Oprawki Amada
Pełna oferta wymiennych oprawek soczewek do laserów Amada CO2. Szybka i bezpieczna wymiana soczewek — bez wymiany oprawki. Usprawnione czyszczenie. Regulacja długości ogniskowej. Samozamykający się mechanizm — bez śrub i nakrętek. O-ring zamiast toksycznej substancji z klasycznego rozwiązania. Wielokrotnego użytku.

Lustra
W laserach CO2 transport wiązki z rezonatora do głowicy opiera się na lustrach. W uproszczeniu minimalna liczba luster w laserach 2D może wynosić 2, w praktyce nowoczesne maszyny mają ich więcej; w 3D liczba jeszcze rośnie.

Lustra plano Cu i Si
Bazą jest krzem (Si) oraz miedź (Cu). Lustra krzemowe mają niską masę — preferowane w osiach ruchomych przy dużych przyspieszeniach. Lustra miedziane mają dobrą przewodność cieplną i mogą być chłodzone cieczą; z kanałami chłodzącymi — w maszynach dużej mocy. Właściwości optyczne (odbicie, przesunięcie fazowe) wynikają z powłok.

Lustra Cu chłodzone wodą
Wzrost mocy laserów CO2 stawia wyższe wymagania trwałości. Chłodzenie wodą ogranicza ekspozycję cieplną: kanały tuż pod powłoką. Rozwiązanie możliwe tylko w lustrach miedzianych.

Lustra sferyczne
Mała średnica wiązki z lasera CO2 ma dużą rozbieżność i wysoką gęstość. Średnicę zwiększa układ teleskopowy: lustro wypukłe + wklęsłe, na bazie miedzi.

Szkła ochronne
Dla laserów fiber i dyskowych. Chronią optykę fokusującą przed odpryskami i dymem. Po zabrudzeniu lub zarysowaniu wymagają wymiany.

Dobór: model maszyny i numer referencyjny — kontakt lub katalog optyki.`,
  },
  {
    slug: "nowosc",
    section: "nowosc" as const,
    title: "Nowość: dysze chromowane PVD do TRUMPF",
    excerpt: "Dysze chromowane PVD do maszyn TRUMPF: powłoka ogranicza przywieranie odprysków do otworu i wydłuża stabilność procesu cięcia. Numery znajdują się w katalogu TRUMPF.",
    body: `Jeden z największych producentów obrabiarek na rynku europejskim w artykule „Zmienianie dysz jest łatwe” napisał:

„Dla zmian bezzałogowych nieprzerwane działanie w bezpiecznych warunkach jest najistotniejsze. Aby zapewnić ciągłość wysokiej jakości cięcia, zużyte dysze muszą być wymienione bezzwłocznie. Podczas programowania użytkownik może wyszczególnić, kiedy — po konkretnej liczbie godzin — zużyte dysze muszą być wymienione automatycznie.”

Oto problem: zniszczenie albo ograniczenie funkcji dyszy przez rozpryski jest nieprzewidywalne — zarówno na maszynach bezobsługowych, jak i przy operatorze.

Dwa podstawowe czynniki niszczące dysze tnące

1. Przyklejenia / zaklejenia
Rozprysk, który przywiera do dyszy, rozregulowuje ognisko, upośledza pojemnościowe układy pomiarowe, zakłóca ciśnienie i strugę gazów roboczych. Skutkiem jest zła jakość cięcia aż do przerwania procesu. Rozpryski przylegające często niszczą dyszę natychmiast. Wiele źródeł nie zaleca automatycznego czyszczenia dyszy, bo usuwa tylko rozpryski na zewnątrz, nie wewnątrz. Miedź jest delikatna — rozkalibrowaniu ulega też otwór. Lepiej powlekać dysze tak, aby rozpryski nie mogły przywierać.

2. „Zamazania”
Zniszczenie dyszy na skutek zetknięcia z materiałem (kolizja). Wymaga uważniejszego programowania.

Pokrycie PVD chromowe
Polecane dla stali „czarnej”, stali nierdzewnych i kwasoodpornych. Rozpryski nie przywierają do zewnętrznych ani wewnętrznych części dyszy. Odpryski z wnętrza są wydmuchiwane przez gaz roboczy i nie zwężają otworu. Sprawdzają się przy foliowanych arkuszach blach nierdzewnych i aluminiowych: roztopiona folia nie przywiera, pozostałości łatwo zetrzeć.

Oferta dysz chromowanych: katalog TRUMPF.`,
  },
  {
    slug: "oprogramowanie",
    section: "oprogramowanie" as const,
    title: "Oprogramowanie JETCAM",
    excerpt: "JETCAM Expert CAD/CAM — oprogramowanie do nestingu i sterowania wycinarką. W Polsce zapewniamy wdrożenie, szkolenia i wsparcie, od pojedynczej maszyny po park z automatycznym załadunkiem. Zapytania: laser-parts@laser-parts.pl.",
    body: `JETCAM Expert CAD/CAM oraz komplet programów dopasowują się do wielkości firmy — od małych zakładów do korporacji. Dla firm szukających maksymalnej automatyzacji JETCAM Expert dostarcza programy dla wykrawarek, wycinarek laserowych do cięcia metalu, frezarek kształtowych, zaginarek oraz wycinarek do kompozytów, a także dla konfiguracji z załadunkiem/rozładunkiem i nożycami.

JETCAM jest instalowany i używany w ponad 70 krajach. Wysoki stopień automatyzacji przy łatwej obsłudze. System oparty na bazie danych w technologii SEKT: automatyczne łączenie materiału, narzędzi i parametrów maszyny. Rozwiązanie dla pojedynczej maszyny i dla parku maszyn. Klienci dostają gwarancję aktualizacji całego programu albo wybranych funkcji.

Funkcja Free Form High Performance Nesting w porównaniu z konkurencyjnym rozmieszczeniem daje zwykle ok. 10% oszczędności materiału.

Geometria
JETCAM ma funkcje CAD do rysowania oraz import DXF i IGES.

Procedury oraz wybór narzędzi
Na bazie SEKT system dobiera procedury i narzędzia według parametrów maszyny, materiału i preferencji użytkownika. M.in.: mikrozłączenia, automatyczne pozycjonowanie, wybór narożnika (pętle, promienie), cięcie ażurów, algorytmy autorozmieszczania.

Rozmieszczanie / pakietowanie
Od opcji prostych do zaawansowanych. Autorozmieszczanie z modułem optymalizacji obniża koszt, zużycie materiału i czas. Współpraca z MRP. Dobór narzędzi i ścieżek według SEKT, parametrów maszyny i klienta. Ryzyko kolizji głowicy z materiałem jest zminimalizowane. Ścieżki można poprawić ręcznie.

Przykładowa lista sterowanych maszyn
Accu-Router, Adige Sala, AKS (plasma), Amada, American GFM Cutter, Balliu, Baltec, Beyeler, Behrens, Blackman & White, Burny, Bystronic, Carrier, Cincinnati, Creneau, Danobat, Di-Acro, Economos, Edel, ESAB, Esprit, Euromac, Exact, Fagor, Farley Plasma, Finn-Power, Flow, Gerber, GFM, Goiti, Haco (Omes), Hangkwang, Heidenhain, Held Pedilas, Hypertherm, Jinfangyuan, Komatsu, Koike Whitney, Zinser, Zund, Komo, Lazerblade, Lasercomb, Laser Lab, Lectra, LVD/Shape, Mazak, Messer Griesheim, Metrisa, Microstep, Mitsubishi, Motion Master, Multicam, Murata Wiedemann, Nisshinbo, NTC Nippei, Omax, Pass, Power Press, Prima, Pullmax, Rainer, Raskin, Rhodes Pierce-all, Rohmer and Stimpfig, Ridder Waricut, Safan Laser, Salvagnini, Samho, Shadow, Shoda, Smeral, Strippit, Tailift, Thermwood, TrennTek, Trumpf, Vanad, Wadkin.

Jako partner JETCAM w Polsce: wsparcie, szkolenia, wdrożenia. Zapytania: laser-parts@laser-parts.pl.`,
  },
  {
    slug: "technologia",
    section: "technologia" as const,
    title: "Technologia laserowa",
    excerpt: "Wprowadzenie do cięcia laserowego: powstawanie wiązki, gazy procesowe oraz zachowanie materiałów. Opracowanie pochodzi z naszej oferty handlowej i pozostaje aktualne jako materiał poglądowy.",
    body: `1. Wprowadzenie
2. Powstawanie promienia laserowego
3. Cięcie laserowe
4. Gazy laserowe
5. Przykładowe detale

1. Wprowadzenie
Cięcie laserowe — jedna z metod cięcia termicznego — stanowi podstawę ekonomicznej produkcji w przemyśle metalowym. Cechą jest punktowe wprowadzenie energii i wysokoenergetyczny strumień tnący. Celem jest wytwarzanie elementów, które bez dodatkowej obróbki nadają się do dalszej przeróbki. Warunkiem dobrej jakości i utrzymania wymiarów jest dokładnie prowadzony strumień w połączeniu ze stabilną maszyną o dużej odporności na drgania i dobrej powtarzalności. Wysokie wymagania wobec geometrii powierzchni cięcia spełniają swobodnie programowalne maszyny CNC.

2. Powstawanie promienia laserowego
Do wytworzenia ciepła stosuje się gazowe lasery CO2 oraz lasery na ciele stałym (Nd-YAG). Szczególnie duże sprawności i moce daje laser gazowy CO2. W wyniku drgań cząsteczki CO2 powstaje podczerwień o długości fali 10,6 µm. Aby uzyskać wymaganą ilość ciepła na blachę / w szczelinie, promień musi zostać zogniskowany przez soczewki lub system luster. Absorpcja nagrzewa przedmiot do temperatury procesu: temperatury zapłonu przy cięciu ze spalaniem (utlenianiem) albo temperatury topnienia przy cięciu przez stapianie.

3. Cięcie laserowe
Cięcie promieniem lasera ma tolerancje zbliżone do obróbki mechanicznej. Obok maszyn x-y stosuje się układy do cięcia 3D. Na ostrych narożach potrzebne jest automatyczne przyporządkowanie parametrów (moc do prędkości) wycinanemu konturowi.

Według DIN 2310 trzy metody:
· cięcie ze spalaniem
· cięcie przez stapianie
· cięcie z wykorzystaniem sublimacji

Cięcie ze spalaniem (utlenianiem)
Materiał nagrzewa się w szczelinie do temperatury zapłonu (dla stali konstrukcyjnej 1150–1200 °C). Najczęstsze zastosowanie: stale niestopowe i niskostopowe. W tlenie materiał spala się, tworząc rzadkopłynny żużel wydmuchiwany energią kinetyczną strumienia. Reakcja egzotermiczna dostarcza część energii i pozwala na duże prędkości przy względnie małej mocy.

Cięcie przez stapianie
Materiał jest stapiany na całej grubości i wydmuchiwany gazem o dużej energii kinetycznej. Stosowane głównie do stali wysokostopowych i metali nieżelaznych. Gaz tnący (i ochrona optyki): azot lub argon. Cała energia do temperatury topnienia musi pochodzić z promienia (lub dodatkowo z energii elektrycznej). Bez reakcji egzotermicznej prędkość jest mniejsza niż przy spalaniu. Zaleta: powierzchnie wolne od tlenków — ważne przy stalach wysokostopowych. Dla stali Cr-Ni i powierzchni bez gratu: ciśnienie gazu 15–20 bar; głowica i instalacja gazu muszą to wytrzymać.

Cięcie z sublimacją
Materiał w szczelinie wyparowuje pod zogniskowanym promieniem i jest wydmuchiwany ciśnieniem pary oraz gazu tnącego. W praktyce trzech metod nie da się ostro rozdzielić.

4. Gazy laserowe
Mieszanina dwutlenku węgla, helu i azotu o bardzo dużej czystości. Stosunek składników dobiera się do typu lasera. Do lasera potrzebne jest specjalne doprowadzenie, żeby zachować czystość.

Gazy robocze (tnące)
TLEN — do cięcia ze spalaniem stali niestopowych: tlen 3,5 (99,95%). Wobec 2,5 (99,5%) prędkość większa o ok. 20%.
AZOT — stale wysokostopowe, materiały ocynkowane, powlekane galwanicznie, niemetale. Produkcyjnie często 2,8 (99,8%); mogą występować barwy nalotowe na dolnych krawędziach. Metalicznie czyste krawędzie: azot min. 3,5 — drożej.
INNE — aluminium: mieszaniny azotu, tlenu i argonu. Tytan: czysty argon lub argon–tlen. Stosuje się też sprężone powietrze o podwyższonej czystości, kosztem spadku wydajności.

5. Przykładowe detale
Przede wszystkim stale zwykłej jakości i stopowe. Dobrze poddają się też metale nieżelazne: miedź i jej stopy oraz aluminium. Dopuszcza się niemetale, np. pleksi, tworzywa, sklejkę — pod warunkiem, że materiał nie wydziela związków trujących lub wybuchowych. Wykluczone jest cięcie PVC.

Przy niemetalach problemem jest odległość dyszy. W nowoczesnych urządzeniach ustawiają ją czujniki pojemnościowe — nie działają przy materiałach nieprzewodzących.

Dla urządzenia ok. 1,8 kW orientacyjne grubości: stal St do 15 mm; INOX do 6 mm; aluminium i miedź do 4 mm.`,
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

  const machines = await getUsedMachines(false);
  const l3030 = {
    title: "TRUMATIC L3030 (używana)",
    slug: "trumatic-l3030",
    description:
      "Urządzenie używane. Producent: TRUMPF. Nazwa handlowa: TRUMATIC L3030. Parametry i stan — kontakt telefoniczny lub e-mail.",
    contactNote: "+48 693 606 067 lub laser-parts@laser-parts.pl",
    active: true,
    sortOrder: 0,
  };
  const existingL3030 = machines.find((m) => m.slug === l3030.slug);
  if (existingL3030) {
    await updateUsedMachine(existingL3030.id, l3030);
  } else {
    await createUsedMachine(l3030);
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

