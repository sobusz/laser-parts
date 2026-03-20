import { useState, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { Search, SlidersHorizontal, ShoppingCart, ChevronRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import PublicLayout from "@/components/PublicLayout";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";
// Product type inferred from tRPC
type Product = {
  id: number;
  name: string;
  slug: string;
  referenceNumber: string | null;
  price: string | null;
  unit: string;
  inStock: boolean;
  featured: boolean;
  imageUrl: string | null;
  categoryId: number;
  description: string | null;
  specifications: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export default function Catalog() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initialCategory = params.get("kategoria") ?? "";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  useEffect(() => {
    const p = new URLSearchParams(search);
    setSelectedCategory(p.get("kategoria") ?? "");
  }, [search]);

  const { data: categories, isLoading: catsLoading } = trpc.categories.list.useQuery();
  const { data: products, isLoading: prodsLoading } = trpc.products.list.useQuery({
    categorySlug: selectedCategory || undefined,
    search: searchQuery || undefined,
  });

  const { addItem } = useCart();

  function handleAddToCart(product: Product) {
    if (!product.price) {
      toast.info("Ten produkt wymaga wyceny. Skontaktuj się z nami.", { duration: 4000 });
      return;
    }
    addItem({
      productId: product.id,
      name: product.name,
      referenceNumber: product.referenceNumber,
      price: Number(product.price),
      unit: product.unit,
      imageUrl: product.imageUrl,
    });
    toast.success(`Dodano do koszyka: ${product.name}`);
  }

  return (
    <PublicLayout>
      {/* Page header */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container py-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Link href="/" className="hover:text-foreground transition-colors">Strona główna</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">Oferta handlowa</span>
          </nav>
          <h1 className="text-3xl font-bold text-foreground">Oferta handlowa</h1>
          <p className="text-muted-foreground mt-1">
            Materiały eksploatacyjne i części do wycinarek laserowych
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar – categories */}
          <aside className="lg:w-60 shrink-0">
            <div className="sticky top-24">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                Kategorie
              </h2>
              {catsLoading ? (
                <div className="space-y-2">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-9 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      selectedCategory === ""
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    Wszystkie produkty
                  </button>
                  {categories?.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                        selectedCategory === cat.slug
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
                <p className="text-sm font-medium text-foreground mb-1">Nie widzisz produktu?</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Skontaktuj się z nami – realizujemy zamówienia indywidualne.
                </p>
                <Link href="/kontakt">
                  <Button size="sm" variant="outline" className="w-full text-xs">
                    Zapytaj o produkt
                  </Button>
                </Link>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Search bar */}
            <div className="flex gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Szukaj po nazwie lub numerze referencyjnym..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Results count */}
            {!prodsLoading && (
              <p className="text-sm text-muted-foreground mb-4">
                {products?.length ?? 0} produktów
                {selectedCategory && categories && (
                  <> w kategorii <strong>{categories.find((c) => c.slug === selectedCategory)?.name}</strong></>
                )}
              </p>
            )}

            {/* Products grid */}
            {prodsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(9)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <Skeleton className="aspect-square w-full rounded-md mb-3" />
                      <Skeleton className="h-3 w-24 mb-2" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-3/4 mb-3" />
                      <Skeleton className="h-8 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map((product) => (
                  <Card
                    key={product.id}
                    className="group hover:shadow-md hover:border-primary/30 transition-all duration-200"
                  >
                    <CardContent className="p-4">
                      {/* Image */}
                      <Link href={`/produkt/${product.slug}`}>
                        <div className="aspect-square bg-muted rounded-md mb-3 overflow-hidden flex items-center justify-center cursor-pointer">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-200"
                            />
                          ) : (
                            <Package className="w-12 h-12 text-muted-foreground/40" />
                          )}
                        </div>
                      </Link>

                      {/* Ref number */}
                      {product.referenceNumber && (
                        <p className="text-xs text-muted-foreground font-mono mb-1">
                          Ref: {product.referenceNumber}
                        </p>
                      )}

                      {/* Name */}
                      <Link href={`/produkt/${product.slug}`}>
                        <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2 cursor-pointer">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Price + stock */}
                      <div className="flex items-center justify-between mb-3">
                        {product.price ? (
                          <span className="font-bold text-primary">
                            {Number(product.price).toFixed(2)} zł
                            <span className="text-xs font-normal text-muted-foreground ml-1">
                              / {product.unit}
                            </span>
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Cena na zapytanie</span>
                        )}
                        <Badge
                          variant={product.inStock ? "default" : "secondary"}
                          className={`text-xs ${product.inStock ? "bg-green-100 text-green-700 border-green-200" : ""}`}
                        >
                          {product.inStock ? "Dostępny" : "Na zamówienie"}
                        </Badge>
                      </div>

                      {/* Add to cart */}
                      <Button
                        size="sm"
                        className="w-full gap-2"
                        onClick={() => handleAddToCart(product)}
                        variant={product.price ? "default" : "outline"}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        {product.price ? "Dodaj do koszyka" : "Zapytaj o cenę"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Package className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Brak produktów</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {searchQuery
                    ? `Nie znaleziono produktów dla "${searchQuery}"`
                    : "W tej kategorii nie ma jeszcze produktów."}
                </p>
                <Link href="/kontakt">
                  <Button variant="outline" size="sm">
                    Zapytaj o produkt
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
