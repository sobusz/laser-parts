import { useState } from "react";
import { Link, useParams } from "wouter";
import { ChevronRight, Package, Minus, Plus, Phone, ClipboardPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import PublicLayout from "@/components/PublicLayout";
import { trpc } from "@/lib/trpc";
import { useInquiry } from "@/contexts/InquiryContext";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useInquiry();
  const { data: product, isLoading } = trpc.products.bySlug.useQuery({ slug: slug ?? "" });
  const { data: categories } = trpc.categories.list.useQuery();
  const category = categories?.find((c) => c.id === product?.categoryId);

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container py-8">
          <Skeleton className="h-64 w-full" />
        </div>
      </PublicLayout>
    );
  }

  if (!product) {
    return (
      <PublicLayout>
        <div className="container py-16 text-center">
          <Package className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Pozycja nie znaleziona</h1>
          <Link href="/oferta"><Button>Wróć do oferty</Button></Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="bg-white border-b border-border">
        <div className="container py-4">
          <nav aria-label="Ścieżka nawigacji" className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
            <Link href="/" className="underline underline-offset-4 decoration-border hover:text-primary py-1">Strona główna</Link>
            <ChevronRight className="w-4 h-4 text-border" />
            <Link href="/oferta" className="underline underline-offset-4 decoration-border hover:text-primary py-1">Oferta</Link>
            {category && (
              <>
                <ChevronRight className="w-4 h-4 text-border" />
                <Link href={`/oferta?kategoria=${category.slug}`} className="text-foreground underline underline-offset-4 decoration-border hover:text-primary py-1">{category.name}</Link>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-white tech-grid border border-border flex items-center justify-center overflow-hidden">
            {product.sketchUrl || product.imageUrl ? (
              <img src={product.sketchUrl || product.imageUrl || ""} alt={`Szkic: ${product.name}`} className="max-h-full object-contain p-8" />
            ) : (
              <Package className="w-20 h-20 text-muted-foreground/30" />
            )}
          </div>
          <div>
            {category && <Badge variant="secondary" className="mb-3">{category.name}</Badge>}
            <h1 className="text-2xl lg:text-3xl font-bold mb-3">{product.name}</h1>
            {product.referenceNumber && (
              <p className="text-sm font-mono text-muted-foreground mb-1">
                Nr referencyjny: <span className="text-foreground font-medium">{product.referenceNumber}</span>
              </p>
            )}
            {product.orderNumber && (
              <p className="text-sm font-mono text-muted-foreground mb-3">
                Nr zamówieniowy: <span className="text-foreground font-medium">{product.orderNumber}</span>
              </p>
            )}
            <p className="text-xl font-semibold mb-4 border-l-2 border-primary pl-3">
              {product.price ? `${Number(product.price).toFixed(2)} zł netto / ${product.unit}` : "Cena na zapytanie"}
            </p>
            {product.description && <p className="text-muted-foreground mb-6">{product.description}</p>}
            <Separator className="my-6" />
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center border border-border">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-muted">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} className="px-3 py-2 hover:bg-muted">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <Button
                size="lg"
                className="flex-1 gap-2"
                onClick={() => {
                  addItem({
                    productId: product.id,
                    name: product.name,
                    referenceNumber: product.referenceNumber,
                    quantity,
                    unit: product.unit,
                  });
                  toast.success("Dodano do zapytania ofertowego");
                }}
              >
                <ClipboardPlus className="w-4 h-4" />
                Dodaj do zapytania
              </Button>
            </div>
            <a href="tel:+48691732408">
              <Button variant="outline" className="gap-2">
                <Phone className="w-4 h-4" />
                +48 691 732 408
              </Button>
            </a>
          </div>
        </div>
        {product.specifications && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">Specyfikacja</h2>
            <pre className="text-sm whitespace-pre-wrap font-sans bg-white border border-border p-6">{product.specifications}</pre>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
