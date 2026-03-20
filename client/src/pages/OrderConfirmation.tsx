import { useSearch } from "wouter";
import { CheckCircle2, Clock, Mail, ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import PublicLayout from "@/components/PublicLayout";

export default function OrderConfirmation() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const orderNumber = params.get("nr");
  const paid = params.get("paid") === "true";

  return (
    <PublicLayout>
      <div className="container py-16 max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>

        <h1 className="text-3xl font-bold mb-3">
          {paid ? "Dziękujemy za zamówienie!" : "Zamówienie zostało przyjęte"}
        </h1>

        {orderNumber && (
          <p className="text-muted-foreground mb-2">
            Numer zamówienia:{" "}
            <span className="font-mono font-semibold text-foreground">{orderNumber}</span>
          </p>
        )}

        <p className="text-muted-foreground mb-8 leading-relaxed">
          {paid
            ? "Płatność została zrealizowana. Potwierdzenie zamówienia zostanie wysłane na podany adres e-mail."
            : "Twoje zamówienie zostało przyjęte do realizacji. Skontaktujemy się z Tobą w celu potwierdzenia szczegółów."}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-muted/30 rounded-lg p-4 border border-border">
            <Mail className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Potwierdzenie e-mail</p>
            <p className="text-xs text-muted-foreground mt-1">Wyślemy potwierdzenie na Twój adres</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-4 border border-border">
            <Package className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Realizacja zamówienia</p>
            <p className="text-xs text-muted-foreground mt-1">Części z oferty podstawowej – w dniu zamówienia</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-4 border border-border">
            <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-sm font-medium">Faktura VAT</p>
            <p className="text-xs text-muted-foreground mt-1">Faktura zostanie wystawiona do zamówienia</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/oferta">
            <Button className="gap-2">
              Kontynuuj zakupy
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/kontakt">
            <Button variant="outline">Skontaktuj się z nami</Button>
          </Link>
        </div>

        <p className="text-xs text-muted-foreground mt-8">
          W razie pytań prosimy o kontakt: <a href="mailto:zamowienia@laser-parts.pl" className="underline">zamowienia@laser-parts.pl</a>
        </p>
      </div>
    </PublicLayout>
  );
}
