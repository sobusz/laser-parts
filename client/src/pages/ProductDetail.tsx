import { useState } from "react";
import { Link, useParams } from "wouter";
import { ChevronRight, ShoppingCart, Package, Minus, Plus, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import PublicLayout from "@/components/PublicLayout";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const { data: product, isLoading } = trpc.products.bySlug.useQuery({ slug: slug ?? "" });
  const { data: categories } = trpc.categories.list.useQuery();

  const category = categories?.find((c) => c.id === product?.categoryId);

  function handleAddToCart() {
    if (!product) return;
    if (!product.price) {
      toast.info("Ten produkt wymaga wyceny. Skontaktuj się z nami.", { duration: 4000 });
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        referenceNumber: product.referenceNumber,
        price: Number(product.price),
        unit: product.unit,
        imageUrl: product.imageUrl,
      });
    }
    toast.success(`Dodano ${quantity} szt. do koszyka`);
  }

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container py-8">
          <Skeleton className="h-4 w-64 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!product) {
    return (
      <PublicLayout>
        <div className="container py-16 text-center">
          <Package className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Produkt nie znaleziony</h1>
          <p className="text-muted-foreground mb-6">
            Produkt, którego szukasz, nie istnieje lub został usunięty.
          </p>
          <Link href="/oferta">
            <Button>Wróć do oferty</Button>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Strona główna</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/oferta" className="hover:text-foreground transition-colors">Oferta</Link>
            {category && (
              <>
                <ChevronRight className="w-3 h-3" />
                <Link
                  href={`/oferta?kategoria=${category.slug}`}
                  className="hover:text-foreground transition-colors"
                >
                  {category.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="aspect-square bg-muted rounded-xl flex items-center justify-center overflow-hidden border border-border">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain p-8"
              />
            ) : (
              <Package className="w-24 h-24 text-muted-foreground/30" />
            )}
          </div>

          {/* Details */}
          <div>
            {category && (
              <Link href={`/oferta?kategoria=${category.slug}`}>
                <Badge variant="secondary" className="mb-3 cursor-pointer hover:bg-primary/10">
                  {category.name}
                </Badge>
              </Link>
            )}

            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">{product.name}</h1>

            {product.referenceNumber && (
              <p className="text-sm text-muted-foreground font-mono mb-4">
                Nr referencyjny: <span className="font-semibold">{product.referenceNumber}</span>
              </p>
            )}

            {/* Price */}
            <div className="flex items-center gap-4 mb-4">
              {product.price ? (
                <span className="text-3xl font-bold text-primary">
                  {Number(product.price).toFixed(2)} zł
                  <span className="text-base font-normal text-muted-foreground ml-1">
                    / {product.unit}
                  </span>
                </span>
              ) : (
                <span className="text-lg text-muted-foreground italic">Cena na zapytanie</span>
              )}
              <Badge
                className={
                  product.inStock
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-orange-100 text-orange-700 border-orange-200"
                }
              >
                {product.inStock ? "Dostępny" : "Na zamówienie"}
              </Badge>
            </div>

            {product.description && (
              <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>
            )}

            <Separator className="my-6" />

            {/* Quantity + Add to cart */}
            {product.price ? (
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center border border-border rounded-md">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 hover:bg-muted transition-colors rounded-l-md"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-2 hover:bg-muted transition-colors rounded-r-md"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <Button size="lg" className="flex-1 gap-2" onClick={handleAddToCart}>
                  <ShoppingCart className="w-4 h-4" />
                  Dodaj do koszyka
                </Button>
              </div>
            ) : (
              <div className="flex gap-3 mb-4">
                <Link href="/kontakt" className="flex-1">
                  <Button size="lg" className="w-full gap-2">
                    <Mail className="w-4 h-4" />
                    Zapytaj o cenę
                  </Button>
                </Link>
                <a href="tel:+48691732408">
                  <Button size="lg" variant="outline" className="gap-2">
                    <Phone className="w-4 h-4" />
                    Zadzwoń
                  </Button>
                </a>
              </div>
            )}

            {/* Shipping info */}
            <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground space-y-1">
              <p>✓ Realizacja zamówień w dniu złożenia (dla produktów z oferty podstawowej)</p>
              <p>✓ Transport: Poczta Polska, DHL lub inna firma kurierska</p>
              <p>✓ Faktura VAT wystawiana do każdego zamówienia</p>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {product.specifications && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">Specyfikacja techniczna</h2>
            <div className="bg-muted/30 rounded-lg p-6 border border-border">
              <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                {product.specifications}
              </pre>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
