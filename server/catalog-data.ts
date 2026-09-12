/** Katalog z laser-parts.pl/oferta-handlowa — jedna pozycja = jedna część. */

export type SeedProduct = {
  category: string;
  name: string;
  referenceNumber?: string;
  orderNumber?: string;
  groupName: string;
  description?: string;
  specifications?: string;
  sketchUrl?: string;
};

const LENS_25 = `Ciśnienie robocze: do 25 bar
Średnica zewnętrzna: 38,1 mm
Grubość brzegowa: 7,4 mm
Pokrycie AR dla długości fali 10,6 µm`;

const LENS_16 = `Ciśnienie robocze: do 16 bar
Średnica zewnętrzna: 38,1 mm
Grubość brzegowa: 6,0 mm
Pokrycie AR dla długości fali 10,6 µm`;

const LENS_35 = `Ciśnienie robocze: do 35 bar
Średnica zewnętrzna: 38,1 mm
Grubość brzegowa: 9,0 mm
Pokrycie AR dla długości fali 10,6 µm`;

function zip(
  refs: string[],
  names: string[],
  base: Omit<SeedProduct, "name" | "referenceNumber">,
): SeedProduct[] {
  if (refs.length !== names.length) {
    throw new Error(`zip length mismatch: ${refs.length} refs vs ${names.length} names (${base.groupName})`);
  }
  return refs.map((referenceNumber, i) => ({ ...base, name: names[i], referenceNumber }));
}

export const PRODUCTS: SeedProduct[] = [
  { category: "trumpf", groupName: "Części szybko zużywające się – głowica", name: "Ceramic nozzle holder DIAS III", referenceNumber: "0260432", sketchUrl: "/catalog/Obraz1.png" },
  { category: "trumpf", groupName: "Części szybko zużywające się – głowica", name: "Ceramic nozzle holder", referenceNumber: "243839", sketchUrl: "/catalog/Obraz2.png" },
  { category: "trumpf", groupName: "Części szybko zużywające się – głowica", name: "Teflon cover DIAS III – white", referenceNumber: "256153", orderNumber: "0955826", sketchUrl: "/catalog/Obraz3.png" },

  ...zip(
    ["0124561", "0124562", "0966809", "0237497", "0237501", "1253211", "0126933", "0942742"],
    [
      "Dysza fi 0,8 mm standard",
      "Dysza fi 1,0 mm standard",
      "Dysza fi 1,2 mm standard",
      "Dysza fi 1,4 mm standard",
      "Dysza fi 1,7 mm standard",
      "Dysza fi 2,0 mm standard",
      "Dysza fi 2,3 mm standard",
      "Dysza fi 2,7 mm standard",
    ],
    {
      category: "trumpf",
      groupName: "Standardowe dysze miedziane",
      sketchUrl: "/catalog/Obraz4.png",
      description: "Dysze konfekcjonowane w opakowaniach po 10 szt. Zalecane szczególnie do maszyn z systemem PCS.",
    },
  ),

  ...zip(
    ["0352280", "0352281", "0352282", "0352283", "0352284", "1253211", "0352285", "0352286"],
    [
      "Dysza fi 0,8 mm chromowana",
      "Dysza fi 1,0 mm chromowana",
      "Dysza fi 1,2 mm chromowana",
      "Dysza fi 1,4 mm chromowana",
      "Dysza fi 1,7 mm chromowana",
      "Dysza fi 2,0 mm chromowana",
      "Dysza fi 2,3 mm chromowana",
      "Dysza fi 2,7 mm chromowana",
    ],
    {
      category: "trumpf",
      groupName: "Dysze z chromowym pokryciem PVD",
      sketchUrl: "/catalog/Obraz5.png",
    },
  ),

  {
    category: "trumpf",
    groupName: "Elementy optyki",
    name: 'Zn-Se Meniscus lens 3,75"',
    referenceNumber: "0346104",
    sketchUrl: "/catalog/Obraz6.png",
    specifications: `${LENS_25}\nEfektywna długość ogniskowej: 95,3 mm`,
  },
  {
    category: "trumpf",
    groupName: "Elementy optyki",
    name: 'Zn-Se Meniscus lens 5"',
    referenceNumber: "088114",
    sketchUrl: "/catalog/Obraz6.png",
    specifications: `${LENS_25}\nEfektywna długość ogniskowej: 127 mm`,
  },
  {
    category: "trumpf",
    groupName: "Elementy optyki",
    name: 'Zn-Se Meniscus lens 7,5"',
    referenceNumber: "097517",
    sketchUrl: "/catalog/Obraz6.png",
    specifications: `${LENS_25}\nEfektywna długość ogniskowej: 190,5 mm`,
  },
  {
    category: "trumpf",
    groupName: "Elementy optyki",
    name: 'Zn-Se Meniscus lens 9,0"',
    referenceNumber: "0141972",
    sketchUrl: "/catalog/Obraz6.png",
    specifications: `${LENS_25}\nEfektywna długość ogniskowej: 228,6 mm`,
  },
  { category: "trumpf", groupName: "Elementy optyki", name: "Lustro / Umlenkspiegel", referenceNumber: "0129881" },
  { category: "trumpf", groupName: "Elementy optyki", name: "Lustro / Phasenschieber", referenceNumber: "0129880" },
  { category: "trumpf", groupName: "Elementy optyki", name: "Lustro / Spiegel MMR", referenceNumber: "0961975", orderNumber: "096066" },
  { category: "trumpf", groupName: "Elementy optyki", name: "Lustro", referenceNumber: "1331867", orderNumber: "0976345" },
  {
    category: "trumpf",
    groupName: "Elementy optyki",
    name: "Papier do czyszczenia soczewek KODAK, 50 ark. 70×115 mm",
    sketchUrl: "/catalog/Obraz7.png",
  },

  { category: "trumpf", groupName: "Filtry wody", name: "Filtry przepływu wody Autolas plus – komplet wkładek (3 szt.)", referenceNumber: "146152-3", sketchUrl: "/catalog/Obraz8.png" },
  { category: "trumpf", groupName: "Filtry wody", name: "Filtr przepływu wody Autolas plus – wkład (1 szt.)", referenceNumber: "146152-1", sketchUrl: "/catalog/Obraz8.png" },

  { category: "trumpf", groupName: "Filtry powietrza agregatów chłodzących", name: "Filtr 1520 × 755 × 8", orderNumber: "1520 x 755 x 8" },
  { category: "trumpf", groupName: "Filtry powietrza agregatów chłodzących", name: "Filtr 1670 × 660 × 8", orderNumber: "1670 x 660 x 8" },
  { category: "trumpf", groupName: "Filtry powietrza agregatów chłodzących", name: "Filtr 2420 × 560 × 8", orderNumber: "2420 x 560 x 8" },
  { category: "trumpf", groupName: "Filtry powietrza agregatów chłodzących", name: "Filtr 1200 × 700 × 8", orderNumber: "1200 x 700 x 8" },
  { category: "trumpf", groupName: "Filtry powietrza agregatów chłodzących", name: "Filtr 990 × 890 × 8", orderNumber: "990 x 890 x 8" },

  { category: "trumpf", groupName: "Wkłady filtrów powietrza", name: "Wkład filtra powietrza FFP 03/10S", referenceNumber: "123674", sketchUrl: "/catalog/Obraz9.png" },
  { category: "trumpf", groupName: "Wkłady filtrów powietrza", name: "Wkład filtra powietrza SMFP 03/10S", referenceNumber: "123675", sketchUrl: "/catalog/Obraz9.png" },
  { category: "trumpf", groupName: "Wkłady filtrów powietrza", name: "Wkład filtra powietrza AKP 04/20S", referenceNumber: "123676", sketchUrl: "/catalog/Obraz9.png" },

  { category: "trumpf", groupName: "Materiały dodatkowe", name: "Ultra czysty aceton do czyszczenia optyki CZDA 200 ml", sketchUrl: "/catalog/Obraz10.png" },
  { category: "trumpf", groupName: "Materiały dodatkowe", name: "Preparat do zgrubnego czyszczenia optyki TOPOL-2 80 ml", sketchUrl: "/catalog/Obraz11.png" },
  { category: "trumpf", groupName: "Materiały dodatkowe", name: "Wata do czyszczenia 100% bawełna" },
  { category: "trumpf", groupName: "Materiały dodatkowe", name: "Biozid-Algenschutz 2594, 125 ml", referenceNumber: "344670" },
  { category: "trumpf", groupName: "Materiały dodatkowe", name: "Korrosionsschutz-Aluminium 2513, 125 ml", referenceNumber: "344669" },
  { category: "trumpf", groupName: "Materiały dodatkowe", name: "Stabrex / Sanitizer ST40, 30 ml", referenceNumber: "344899" },
  { category: "trumpf", groupName: "Materiały dodatkowe", name: "Walzkolben-pumpenöl N62 / Anderol 1000 ml", referenceNumber: "088014" },
  { category: "trumpf", groupName: "Materiały dodatkowe", name: "Ecosyn oil VE46, 1000 ml", referenceNumber: "134336" },
  {
    category: "trumpf",
    groupName: "Materiały dodatkowe",
    name: "MOBIL VACTRA OIL No. 1 – 500 ml",
    referenceNumber: "368910",
    description: "Zastępuje Shell Tonna Oil S-32, smarowanie szczotek przenośnika wzdłużnego (co 500 h).",
  },
  { category: "trumpf", groupName: "Materiały dodatkowe", name: "Tellus Oil DO 32 – 1000 ml", referenceNumber: "0125503" },
  { category: "trumpf", groupName: "Materiały dodatkowe", name: "Degol Oil BG 680 – 1000 ml", referenceNumber: "0133520" },
  { category: "trumpf", groupName: "Materiały dodatkowe", name: "Aero-Shell-Fluid 12 Mil-L6085C – 750 ml", referenceNumber: "0145961" },
  { category: "trumpf", groupName: "Materiały dodatkowe", name: "Omala 100 – 1000 ml", referenceNumber: "0108758" },

  { category: "lvd", groupName: "Części eksploatacyjne", name: "Pierścień izolacyjny – ceramiczny", referenceNumber: "4-01642", sketchUrl: "/catalog/Obraz22.png" },
  { category: "lvd", groupName: "Części eksploatacyjne", name: "Obsada dyszy", referenceNumber: "3-05497", sketchUrl: "/catalog/Obraz21.png" },
  { category: "lvd", groupName: "Części eksploatacyjne", name: "Obsada dyszy ze stożkiem samocentrującym", referenceNumber: "3-05497", sketchUrl: "/catalog/Obraz21.png" },
  { category: "lvd", groupName: "Części eksploatacyjne", name: "Stożek ceramiczny", referenceNumber: "4-01959", sketchUrl: "/catalog/Obraz20.png" },
  { category: "lvd", groupName: "Części eksploatacyjne", name: "Pierścień izolacyjny (teflon)", referenceNumber: "3-06035", sketchUrl: "/catalog/Obraz19.png" },

  ...zip(
    ["3-01910", "3-01911", "3-01912", "3-01913", "3-01914", "3-03854", "3-06112"],
    [
      "HK10 Dysza fi 1,00 mm ze stożkiem",
      "HK12 Dysza fi 1,25 mm ze stożkiem",
      "HK15 Dysza fi 1,50 mm ze stożkiem",
      "HK17 Dysza fi 1,75 mm ze stożkiem",
      "HK20 Dysza fi 2,00 mm ze stożkiem",
      "HK25 Dysza fi 2,50 mm ze stożkiem",
      "HK30 Dysza fi 3,00 mm ze stożkiem",
    ],
    { category: "bystronic", groupName: "Dysze wysokiego ciśnienia", sketchUrl: "/catalog/Obraz17.png" },
  ),
  { category: "bystronic", groupName: "Dysze wysokiego ciśnienia", name: "HK35 Dysza fi 3,50 mm ze stożkiem", orderNumber: "HK35", sketchUrl: "/catalog/Obraz17.png" },

  {
    category: "bystronic",
    groupName: "Elementy optyki",
    name: 'Zn-Se Meniscus lens 5" (do 16 bar)',
    referenceNumber: "4-00186",
    sketchUrl: "/catalog/Obraz15.png",
    specifications: `${LENS_16}\nEfektywna długość ogniskowej: 127 mm`,
  },
  {
    category: "bystronic",
    groupName: "Elementy optyki",
    name: 'Zn-Se Meniscus lens 7,5" (do 16 bar)',
    referenceNumber: "4-00187",
    sketchUrl: "/catalog/Obraz15.png",
    specifications: `${LENS_16}\nEfektywna długość ogniskowej: 190,5 mm`,
  },
  {
    category: "bystronic",
    groupName: "Elementy optyki",
    name: 'Zn-Se Meniscus lens 5" (do 35 bar)',
    referenceNumber: "4-05094",
    sketchUrl: "/catalog/Obraz15.png",
    specifications: `${LENS_35}\nEfektywna długość ogniskowej: 127 mm`,
  },
  {
    category: "bystronic",
    groupName: "Elementy optyki",
    name: 'Zn-Se Meniscus lens 7,5" (do 35 bar)',
    referenceNumber: "4-05095",
    sketchUrl: "/catalog/Obraz15.png",
    specifications: `${LENS_35}\nEfektywna długość ogniskowej: 190,5 mm`,
  },
  {
    category: "bystronic",
    groupName: "Elementy optyki",
    name: "Papier do czyszczenia soczewek KODAK, 50 ark. 70×115 mm",
    orderNumber: "lens cleaning paper",
    sketchUrl: "/catalog/Obraz1-1.png",
  },

  ...zip(
    ["3-01905", "3-01906", "3-01907", "3-01908", "3-01909", "3-04274"],
    [
      "K10 Dysza fi 1,00 mm ze stożkiem",
      "K12 Dysza fi 1,25 mm ze stożkiem",
      "K15 Dysza fi 1,50 mm ze stożkiem",
      "K17 Dysza fi 1,75 mm ze stożkiem",
      "K20 Dysza fi 2,00 mm ze stożkiem",
      "K25 Dysza fi 2,50 mm ze stożkiem",
    ],
    { category: "bystronic", groupName: "Dysze standardowe K", sketchUrl: "/catalog/Obraz17.png" },
  ),

  { category: "bystronic", groupName: "Materiały dodatkowe", name: "Ultraczysty aceton do czyszczenia optyki, 200 ml", orderNumber: "aceton" },
  { category: "bystronic", groupName: "Materiały dodatkowe", name: "Preparat do zgrubnego czyszczenia optyki TOPOL 2, 80 ml", orderNumber: "topol" },
  { category: "bystronic", groupName: "Filtry powietrza", name: "Filtr 400 × 600 × 8", orderNumber: "400 x 600 x 8" },
  { category: "bystronic", groupName: "Filtry powietrza", name: "Filtr 800 × 600 × 8", orderNumber: "800 x 600 x 8" },

  ...zip(
    ["3-16058", "3-16059", "3-16060", "3-14317", "3-14318", "3-14319", "3-16256", "3-16061", "3-16257"],
    [
      "NK10 Dysza fi 1,00 mm ze stożkiem … stal 4–5 mm",
      "NK12 Dysza fi 1,20 mm ze stożkiem … stal 6–8 mm",
      "NK15 Dysza fi 1,50 mm ze stożkiem … stal 10–12 mm",
      "NK17 Dysza fi 1,70 mm ze stożkiem … stal 15 mm",
      "NK20 Dysza fi 2,00 mm ze stożkiem … stal 16–18 mm",
      "NK25 Dysza fi 2,50 mm ze stożkiem … stal 20 mm",
      "NK25A Dysza fi 2,50 mm ze stożkiem … alu 5–8 mm",
      "NK30 Dysza fi 3,00 mm ze stożkiem … stal 25 mm",
      "NK30A Dysza fi 3,00 mm ze stożkiem … alu 10–12 mm",
    ],
    { category: "bystronic", groupName: "Podwójne dysze serii BY", sketchUrl: "/catalog/Obraz16.png" },
  ),

  { category: "mazak", groupName: "Turbo / Super Turbo – dysze Shower", name: "Tip fi 0,80 Shower type", referenceNumber: "46606330523" },
  { category: "mazak", groupName: "Turbo / Super Turbo – dysze Shower", name: "Tip fi 1,50 Shower type", referenceNumber: "46606330523.15" },

  ...zip(
    ["46603350508", "46603350511", "46603350512", "46603350520", "46603350517", "46603350522", "46603350523", "46603350525", "46603350530"],
    [
      "Tip fi 0,80",
      "Tip fi 1,00",
      "Tip fi 1,20",
      "Tip fi 1,50",
      "Tip fi 1,70",
      "Tip fi 2,00",
      "Tip fi 2,20",
      "Tip fi 2,50",
      "Tip fi 3,00",
    ],
    { category: "mazak", groupName: "Turbo / Super Turbo – dysze standardowe" },
  ),

  ...zip(
    ["46603350508C", "46603350511C", "46603350512C", "46603350520C", "46603350517C", "46603350522C", "46603350523C", "46603350525C", "46603350530C"],
    [
      "Tip fi 0,80 chromowana",
      "Tip fi 1,00 chromowana",
      "Tip fi 1,20 chromowana",
      "Tip fi 1,50 chromowana",
      "Tip fi 1,70 chromowana",
      "Tip fi 2,00 chromowana",
      "Tip fi 2,20 chromowana",
      "Tip fi 2,50 chromowana",
      "Tip fi 3,00 chromowana",
    ],
    { category: "mazak", groupName: "Turbo / Super Turbo – dysze chromowane" },
  ),

  { category: "mazak", groupName: "Części szybko zużywające się", name: "Retainer", referenceNumber: "46683300030" },
  { category: "mazak", groupName: "Części szybko zużywające się", name: "Tip adapter", referenceNumber: "46603350510" },
  { category: "mazak", groupName: "Części szybko zużywające się", name: "Base", referenceNumber: "46523300080" },
  { category: "mazak", groupName: "Części szybko zużywające się", name: "Ring", referenceNumber: "46603350002" },
  { category: "mazak", groupName: "Części szybko zużywające się", name: "Bolt M5x0.5 – opak. 4 szt. (cena za szt.)", referenceNumber: "46603300032" },

  ...zip(
    [
      "46683301950-08",
      "46683301950-10",
      "46683301950-12",
      "46683301950",
      "46683301821",
      "46683301821-22",
      "46683301960",
      "46683301970",
      "46683301970-35",
      "46683301970-40",
    ],
    [
      "Tip fi 0,80 – Side Blow",
      "Tip fi 1,00 – Side Blow",
      "Tip fi 1,20 – Side Blow",
      "Tip fi 1,50 – Side Blow",
      "Tip fi 2,00 – Side Blow",
      "Tip fi 2,20 – Side Blow",
      "Tip fi 2,50 – Side Blow",
      "Tip fi 3,00 – Side Blow",
      "Tip fi 3,50 – Side Blow",
      "Tip fi 4,00 – Side Blow",
    ],
    { category: "mazak", groupName: "Side Blow" },
  ),

  ...zip(
    [
      "46683301950-08/C",
      "46683301950-10/C",
      "46683301950-12/C",
      "46683301950/C",
      "46683301821/C",
      "46683301821-22/C",
      "46683301960/C",
      "46683301970/C",
      "46683301970-35/C",
      "46683301970-40/C",
    ],
    [
      "Tip fi 0,80 – Side Blow chromowana",
      "Tip fi 1,00 – Side Blow chromowana",
      "Tip fi 1,20 – Side Blow chromowana",
      "Tip fi 1,50 – Side Blow chromowana",
      "Tip fi 2,00 – Side Blow chromowana",
      "Tip fi 2,20 – Side Blow chromowana",
      "Tip fi 2,50 – Side Blow chromowana",
      "Tip fi 3,00 – Side Blow chromowana",
      "Tip fi 3,50 – Side Blow chromowana",
      "Tip fi 4,00 – Side Blow chromowana",
    ],
    { category: "mazak", groupName: "Side Blow – chromowane" },
  ),

  { category: "mazak", groupName: "Części zamienne Trumpf tips", name: "Teflon cover for TRUMPF tips", referenceNumber: "46683301840" },
  { category: "mazak", groupName: "Części zamienne Trumpf tips", name: "Adapter for TRUMPF tips", referenceNumber: "46683301830" },
  { category: "mazak", groupName: "Mazak 3D / PRECITEC", name: "Ring", referenceNumber: "4671330032" },
  {
    category: "mazak",
    groupName: "Mazak 3D / PRECITEC",
    name: "Części PRECITEC do MAZAK 3D",
    orderNumber: "na zamówienie",
    description: "Części nr 2–6 na zamówienie.",
  },

  {
    category: "optyka",
    groupName: "Soczewki CO2",
    name: "Duralens – soczewka High-Power CO2",
    description: "Kompatybilna z laserami CO2, absorpcja ≤ 0,2%, rekomendowana przez producentów OEM.",
  },
  {
    category: "optyka",
    groupName: "Soczewki CO2",
    name: "Soczewka o obniżonej absorpcji ciepła (High-Power CO2)",
    description: "Gwarantowana absorpcja < 0,15%. Do laserów CO2 w tym powyżej 5 kW. Cięcie aluminium i stali wysokostopowych.",
  },
  {
    category: "optyka",
    groupName: "Soczewki CO2",
    name: "Soczewka o najniższej absorpcji ciepła (High-Power CO2)",
    description: "Gwarantowana absorpcja < 0,13%. Przezroczysta powłoka — wiązka HeNe widoczna na detalu.",
  },
  {
    category: "optyka",
    groupName: "Lustra",
    name: "Lustra plano Cu i Si",
    description: "Krzem (niska masa, osie ruchome) lub miedź (przewodność cieplna, możliwość chłodzenia).",
  },
  {
    category: "optyka",
    groupName: "Lustra",
    name: "Lustra Cu chłodzone wodą",
    description: "Kanały chłodzące pod powłoką — ograniczenie ekspozycji cieplnej w maszynach dużej mocy.",
  },
  {
    category: "optyka",
    groupName: "Lustra",
    name: "Lustra sferyczne (ekspander wiązki)",
    description: "Układ teleskopowy: powierzchnia wypukła + wklęsła, bazujący na lustrach miedzianych.",
  },
  {
    category: "optyka",
    groupName: "Szkła ochronne",
    name: "Szkło ochronne do lasera fiber / dyskowego",
    description: "Szyba ochronna głowicy — po zabrudzeniu lub zarysowaniu wymaga wymiany.",
  },
  {
    category: "optyka",
    groupName: "Oprawki",
    name: "Wymienne oprawki soczewek Amada CO2",
    description: "Szybka wymiana bez śrub, uszczelnienie O-ring, wielokrotnego użytku.",
  },
  {
    category: "inne",
    groupName: "Na zamówienie",
    name: "Części Precitec / Amada / Prima / Salvagnini",
    description: "Elementy szybko zużywające się sprowadzane na zamówienie. Czas oczekiwania 10–14 dni. Minimalna wartość zamówienia 1000 zł netto.",
  },
];
