import { Link } from "wouter";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import PublicLayout from "@/components/PublicLayout";
import { useCart } from "@/contexts/CartContext";

export default function Cart() {
  const { items, totalAmount, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <PublicLayout>
        <div className="container py-16 text-center">
          <ShoppingCart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Koszyk jest pusty</h1>
          <p className="text-muted-foreground mb-6">
            Dodaj produkty z naszej oferty, aby złożyć zamówienie.
          </p>
          <Link href="/oferta">
            <Button className="gap-2">
              Przejdź do oferty
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="bg-muted/30 border-b border-border">
        <div className="container py-6">
          <h1 className="text-2xl font-bold">Koszyk</h1>
          <p className="text-muted-foreground mt-1">{items.length} pozycji</p>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 p-4 bg-white rounded-lg border border-border"
              >
                {/* Image */}
                <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center shrink-0">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <Package className="w-8 h-8 text-muted-foreground/40" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground line-clamp-2 text-sm">{item.name}</h3>
                  {item.referenceNumber && (
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                      Ref: {item.referenceNumber}
                    </p>
                  )}
                  <p className="text-sm font-semibold text-primary mt-1">
                    {item.price.toFixed(2)} zł / {item.unit}
                  </p>
                </div>

                {/* Quantity */}
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center border border-border rounded-md">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="px-2 py-1 hover:bg-muted transition-colors rounded-l-md"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 py-1 text-sm font-medium min-w-[2.5rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="px-2 py-1 hover:bg-muted transition-colors rounded-r-md"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-sm font-bold text-foreground">
                    {(item.price * item.quantity).toFixed(2)} zł
                  </p>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div>
            <div className="bg-white rounded-lg border border-border p-6 sticky top-24">
              <h2 className="font-semibold text-lg mb-4">Podsumowanie zamówienia</h2>
              <div className="space-y-2 text-sm mb-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-muted-foreground">
                    <span className="line-clamp-1 flex-1 mr-2">{item.name}</span>
                    <span className="shrink-0">
                      {item.quantity} × {item.price.toFixed(2)} zł
                    </span>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between font-bold text-lg mb-2">
                <span>Razem (netto)</span>
                <span className="text-primary">{totalAmount.toFixed(2)} zł</span>
              </div>
              <p className="text-xs text-muted-foreground mb-6">
                Do kwoty zostanie doliczony VAT 23% oraz koszty transportu.
              </p>
              <Link href="/zamowienie">
                <Button size="lg" className="w-full gap-2">
                  Przejdź do zamówienia
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/oferta">
                <Button variant="ghost" size="sm" className="w-full mt-2">
                  Kontynuuj zakupy
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
