import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, CreditCard, Building2, MapPin, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import PublicLayout from "@/components/PublicLayout";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";

export default function Checkout() {
  const [, navigate] = useLocation();
  const { items, totalAmount, clearCart } = useCart();

  const [form, setForm] = useState({
    companyName: "",
    nip: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    addressStreet: "",
    addressCity: "",
    addressPostal: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const createOrder = trpc.orders.create.useMutation();
  const createCheckoutSession = trpc.stripe.createCheckoutSession.useMutation();

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!form.companyName) newErrors.companyName = "Nazwa firmy jest wymagana";
    if (!form.nip) newErrors.nip = "NIP jest wymagany";
    if (!form.contactName) newErrors.contactName = "Imię i nazwisko jest wymagane";
    if (!form.contactEmail) newErrors.contactEmail = "E-mail jest wymagany";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail))
      newErrors.contactEmail = "Nieprawidłowy adres e-mail";
    if (!form.addressStreet) newErrors.addressStreet = "Ulica jest wymagana";
    if (!form.addressCity) newErrors.addressCity = "Miasto jest wymagane";
    if (!form.addressPostal) newErrors.addressPostal = "Kod pocztowy jest wymagany";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) {
      toast.error("Koszyk jest pusty");
      return;
    }

    try {
      // 1. Create order in DB
      const order = await createOrder.mutateAsync({
        ...form,
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.name,
          referenceNumber: item.referenceNumber ?? undefined,
          quantity: item.quantity,
          unitPrice: item.price.toFixed(2),
          totalPrice: (item.price * item.quantity).toFixed(2),
        })),
        totalAmount: totalAmount.toFixed(2),
      });

      // 2. Create Stripe checkout session
      const session = await createCheckoutSession.mutateAsync({
        orderNumber: order.orderNumber,
        customerEmail: form.contactEmail,
        customerName: form.contactName,
        items: items.map((item) => ({
          name: item.name,
          referenceNumber: item.referenceNumber ?? undefined,
          quantity: item.quantity,
          unitPrice: Math.round(item.price * 100), // in grosze
        })),
        origin: window.location.origin,
      });

      clearCart();
      toast.success("Przekierowuję do płatności...");
      window.open(session.url, "_blank");
      navigate(`/zamowienie-potwierdzenie?nr=${order.orderNumber}`);
    } catch (err: any) {
      toast.error(err?.message ?? "Błąd podczas składania zamówienia");
    }
  }

  if (items.length === 0) {
    return (
      <PublicLayout>
        <div className="container py-16 text-center">
          <Package className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Koszyk jest pusty</h1>
          <Link href="/oferta">
            <Button>Przejdź do oferty</Button>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const isLoading = createOrder.isPending || createCheckoutSession.isPending;

  return (
    <PublicLayout>
      <div className="bg-muted/30 border-b border-border">
        <div className="container py-6">
          <Link href="/koszyk" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3 w-fit">
            <ArrowLeft className="w-4 h-4" />
            Wróć do koszyka
          </Link>
          <h1 className="text-2xl font-bold">Dane zamówienia</h1>
        </div>
      </div>

      <div className="container py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Company data */}
              <div className="bg-white rounded-lg border border-border p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Building2 className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-lg">Dane firmy</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="companyName">Nazwa firmy *</Label>
                    <Input
                      id="companyName"
                      value={form.companyName}
                      onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                      placeholder="Nazwa Sp. z o.o."
                      className={errors.companyName ? "border-destructive" : ""}
                    />
                    {errors.companyName && (
                      <p className="text-xs text-destructive mt-1">{errors.companyName}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="nip">NIP *</Label>
                    <Input
                      id="nip"
                      value={form.nip}
                      onChange={(e) => setForm({ ...form, nip: e.target.value })}
                      placeholder="000-000-00-00"
                      className={errors.nip ? "border-destructive" : ""}
                    />
                    {errors.nip && (
                      <p className="text-xs text-destructive mt-1">{errors.nip}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="contactName">Imię i nazwisko *</Label>
                    <Input
                      id="contactName"
                      value={form.contactName}
                      onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                      placeholder="Jan Kowalski"
                      className={errors.contactName ? "border-destructive" : ""}
                    />
                    {errors.contactName && (
                      <p className="text-xs text-destructive mt-1">{errors.contactName}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">E-mail *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={form.contactEmail}
                      onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                      placeholder="jan@firma.pl"
                      className={errors.contactEmail ? "border-destructive" : ""}
                    />
                    {errors.contactEmail && (
                      <p className="text-xs text-destructive mt-1">{errors.contactEmail}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="contactPhone">Telefon</Label>
                    <Input
                      id="contactPhone"
                      value={form.contactPhone}
                      onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                      placeholder="+48 000 000 000"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery address */}
              <div className="bg-white rounded-lg border border-border p-6">
                <div className="flex items-center gap-2 mb-5">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h2 className="font-semibold text-lg">Adres dostawy</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="addressStreet">Ulica i numer *</Label>
                    <Input
                      id="addressStreet"
                      value={form.addressStreet}
                      onChange={(e) => setForm({ ...form, addressStreet: e.target.value })}
                      placeholder="ul. Przykładowa 1/2"
                      className={errors.addressStreet ? "border-destructive" : ""}
                    />
                    {errors.addressStreet && (
                      <p className="text-xs text-destructive mt-1">{errors.addressStreet}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="addressPostal">Kod pocztowy *</Label>
                    <Input
                      id="addressPostal"
                      value={form.addressPostal}
                      onChange={(e) => setForm({ ...form, addressPostal: e.target.value })}
                      placeholder="00-000"
                      className={errors.addressPostal ? "border-destructive" : ""}
                    />
                    {errors.addressPostal && (
                      <p className="text-xs text-destructive mt-1">{errors.addressPostal}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="addressCity">Miasto *</Label>
                    <Input
                      id="addressCity"
                      value={form.addressCity}
                      onChange={(e) => setForm({ ...form, addressCity: e.target.value })}
                      placeholder="Warszawa"
                      className={errors.addressCity ? "border-destructive" : ""}
                    />
                    {errors.addressCity && (
                      <p className="text-xs text-destructive mt-1">{errors.addressCity}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="notes">Uwagi do zamówienia</Label>
                    <Textarea
                      id="notes"
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="Dodatkowe informacje, np. godziny dostawy..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div>
              <div className="bg-white rounded-lg border border-border p-6 sticky top-24">
                <h2 className="font-semibold text-lg mb-4">Podsumowanie</h2>
                <div className="space-y-2 text-sm mb-4 max-h-48 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-muted-foreground">
                      <span className="line-clamp-1 flex-1 mr-2">
                        {item.name} <span className="text-xs">×{item.quantity}</span>
                      </span>
                      <span className="shrink-0">
                        {(item.price * item.quantity).toFixed(2)} zł
                      </span>
                    </div>
                  ))}
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between font-bold text-lg mb-1">
                  <span>Razem (netto)</span>
                  <span className="text-primary">{totalAmount.toFixed(2)} zł</span>
                </div>
                <p className="text-xs text-muted-foreground mb-6">
                  + VAT 23% + koszty transportu
                </p>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2"
                  disabled={isLoading}
                >
                  <CreditCard className="w-4 h-4" />
                  {isLoading ? "Przetwarzanie..." : "Zapłać przez Stripe"}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-3">
                  Płatność obsługiwana przez Stripe. Twoje dane są bezpieczne.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </PublicLayout>
  );
}
