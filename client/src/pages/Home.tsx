import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Zap, Shield, Clock, Truck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PublicLayout from "@/components/PublicLayout";
import { trpc } from "@/lib/trpc";

const BRAND_LOGOS = [
  { name: "TRUMPF", color: "text-red-600" },
  { name: "BYSTRONIC", color: "text-blue-600" },
  { name: "MAZAK", color: "text-gray-700" },
  { name: "LVD", color: "text-orange-600" },
  { name: "PRECITEC", color: "text-green-700" },
];

const FEATURES = [
  {
    icon: Clock,
    title: "Szybka realizacja",
    desc: "Części z oferty podstawowej wysyłamy w dniu zamówienia.",
  },
  {
    icon: Shield,
    title: "Wysoka jakość",
    desc: "Oryginalne i zamienne części najwyższej jakości z gwarancją.",
  },
  {
    icon: Truck,
    title: "Sprawna dostawa",
    desc: "Poczta Polska, DHL lub inna firma kurierska według życzenia.",
  },
  {
    icon: Zap,
    title: "Kredyt kupiecki",
    desc: "14-dniowy termin płatności dla zweryfikowanych kontrahentów.",
  },
];

const CATEGORIES = [
  {
    slug: "trumpf",
    name: "Trumpf",
    desc: "Dysze, soczewki, uchwyty ceramiczne i elementy optyki do maszyn Trumpf.",
    icon: "🔴",
  },
  {
    slug: "bystronic",
    name: "Bystronic",
    desc: "Materiały eksploatacyjne i części zamienne do wycinarek Bystronic.",
    icon: "🔵",
  },
  {
    slug: "mazak",
    name: "Mazak",
    desc: "Części i akcesoria do laserów Mazak Optiplex i innych serii.",
    icon: "⚫",
  },
  {
    slug: "lvd",
    name: "LVD",
    desc: "Elementy eksploatacyjne do wycinarek laserowych LVD.",
    icon: "🟠",
  },
  {
    slug: "optyka",
    name: "Elementy optyki",
    desc: "Soczewki Zn-Se, lustra, papiery do czyszczenia optyki.",
    icon: "🔬",
  },
  {
    slug: "filtry",
    name: "Filtry i wkłady",
    desc: "Filtry wody, filtry powietrza i wkłady do agregatów chłodzących.",
    icon: "🌊",
  },
];

export default function Home() {
  const { data: featuredProducts } = trpc.products.featured.useQuery();
  const { data: categoriesData } = trpc.categories.list.useQuery();

  const displayCategories = categoriesData && categoriesData.length > 0 ? categoriesData : CATEGORIES;

  return (
    <PublicLayout>
      {/* ─── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-primary via-primary/80 to-[oklch(0.25_0.08_0)] text-white overflow-hidden">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="container relative py-20 lg:py-28">
          <div className="max-w-3xl">
            <Badge className="bg-white/20 text-white border-white/30 mb-4 text-xs uppercase tracking-wider">
              Sklep B2B dla przemysłu
            </Badge>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6">
              Części do wycinarek{" "}
              <span className="text-yellow-300">laserowych</span>
            </h1>
            <p className="text-lg lg:text-xl text-white/80 mb-8 max-w-2xl leading-relaxed">
              Materiały eksploatacyjne i części zamienne do przemysłowych wycinarek laserowych
              Trumpf, Bystronic, Mazak, LVD i innych. Szybka realizacja, atrakcyjne warunki B2B.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/oferta">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold gap-2">
                  Przeglądaj ofertę
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/kontakt">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10 bg-transparent font-semibold"
                >
                  Skontaktuj się z nami
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 mt-10">
              {[
                "Szybka wysyłka",
                "Faktura VAT",
                "Kredyt kupiecki",
                "Wsparcie techniczne",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-white/80">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Brand logos ───────────────────────────────────────────────────── */}
      <section className="border-b border-border bg-muted/30">
        <div className="container py-6">
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            <span className="text-xs text-muted-foreground uppercase tracking-wider shrink-0">
              Obsługiwane marki:
            </span>
            {BRAND_LOGOS.map((brand) => (
              <span
                key={brand.name}
                className={`font-bold text-lg lg:text-xl tracking-tight ${brand.color} opacity-70 hover:opacity-100 transition-opacity`}
              >
                {brand.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ──────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex flex-col items-start gap-3 p-6 rounded-lg border border-border hover:border-primary/30 hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Categories ────────────────────────────────────────────────────── */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground">Oferta handlowa</h2>
            <p className="text-muted-foreground mt-2 text-lg">
              Szeroki wybór części eksploatacyjnych do wycinarek laserowych
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayCategories.map((cat: any) => (
              <Link
                key={cat.slug}
                href={`/oferta?kategoria=${cat.slug}`}
                className="group"
              >
                <Card className="h-full hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{cat.icon || "⚙️"}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {cat.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                          {cat.description || cat.desc}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/oferta">
              <Button variant="outline" size="lg" className="gap-2">
                Zobacz całą ofertę
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Featured products ─────────────────────────────────────────────── */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Wyróżnione produkty</h2>
                <p className="text-muted-foreground mt-1">Najpopularniejsze części w naszej ofercie</p>
              </div>
              <Link href="/oferta" className="hidden sm:block">
                <Button variant="ghost" className="gap-2 text-primary">
                  Wszystkie produkty
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredProducts.slice(0, 8).map((product) => (
                <Link key={product.id} href={`/produkt/${product.slug}`} className="group">
                  <Card className="h-full hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer">
                    <CardContent className="p-4">
                      <div className="aspect-square bg-muted rounded-md mb-3 overflow-hidden flex items-center justify-center">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <div className="text-muted-foreground text-4xl">⚙️</div>
                        )}
                      </div>
                      {product.referenceNumber && (
                        <p className="text-xs text-muted-foreground font-mono mb-1">
                          Ref: {product.referenceNumber}
                        </p>
                      )}
                      <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mt-auto">
                        {product.price ? (
                          <span className="font-bold text-primary">
                            {Number(product.price).toFixed(2)} zł
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Cena na zapytanie</span>
                        )}
                        <Badge variant="secondary" className="text-xs">
                          {product.inStock ? "Dostępny" : "Na zamówienie"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── About section ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                O firmie
              </Badge>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Laser Parts – Twój partner w branży laserowej
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Laser Parts specjalizuje się w sprzedaży materiałów eksploatacyjnych i części zamiennych
                do przemysłowych wycinarek laserowych. Oferujemy również używane urządzenia laserowe
                oraz oprogramowanie CAD/CAM JETCAM Expert.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Nasze produkty są wykonane dla lub przez Laser Parts i spełniają najwyższe standardy
                jakości. Gwarantujemy szybkie terminy realizacji zamówień oraz atrakcyjne warunki
                handlowe dla firm.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: "Szybka wysyłka", value: "w dniu zamówienia" },
                  { label: "Kredyt kupiecki", value: "14 dni" },
                  { label: "Obsługiwane marki", value: "5+" },
                  { label: "Rodzajów części", value: "100+" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white rounded-lg p-4 border border-border">
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
              <Link href="/kontakt">
                <Button className="gap-2">
                  Skontaktuj się z nami
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10">
                <h3 className="font-semibold text-foreground mb-4">Dane do przelewu</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Firma</span>
                    <span className="font-medium">LASER PARTS</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">NIP</span>
                    <span className="font-medium font-mono">893-104-80-94</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">REGON</span>
                    <span className="font-medium font-mono">340043718</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Bank</span>
                    <span className="font-medium">PKOBP S.A.</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Konto</span>
                    <span className="font-medium font-mono text-xs">65 1440 1185 0000 0000 0400 4892</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-primary text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Gotowy do zamówienia?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Przeglądaj naszą ofertę online lub skontaktuj się z nami bezpośrednio.
            Oferujemy indywidualne warunki dla firm.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/oferta">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold gap-2">
                Przejdź do sklepu
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/kontakt">
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10 bg-transparent font-semibold"
              >
                Zapytaj o ofertę
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
