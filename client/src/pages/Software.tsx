import { Link } from "wouter";
import { Monitor, Layers, Cpu, Globe, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PublicLayout from "@/components/PublicLayout";

export default function Software() {
  return (
    <PublicLayout>
      {/* Page header */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container py-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Link href="/" className="hover:text-foreground transition-colors">Strona główna</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">Oprogramowanie</span>
          </nav>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">Oprogramowanie JETCAM</h1>
            <Badge className="bg-primary/10 text-primary border-primary/20">CAD/CAM</Badge>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Profesjonalne oprogramowanie CAD/CAM do programowania wycinarek laserowych, plazmowych i wodnych
          </p>
        </div>
      </div>

      <div className="container py-12">
        {/* Hero section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
          <div>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              <strong className="text-foreground">JETCAM</strong> to wiodące oprogramowanie CAD/CAM
              przeznaczone do automatycznego programowania maszyn do cięcia blach. Stosowane przez
              ponad 10 000 użytkowników w ponad 70 krajach, JETCAM oferuje zaawansowane funkcje
              nestingu i programowania NC dla wycinarek laserowych, plazmowych, wodnych oraz
              wykrawarek i giętarek.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Jako autoryzowany partner JETCAM w Polsce, oferujemy pełne wsparcie techniczne,
              szkolenia oraz wdrożenia oprogramowania dla firm produkcyjnych.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/kontakt">
                <Button className="gap-2">Zapytaj o licencję</Button>
              </Link>
              <a href="https://www.jetcam.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2">
                  Strona producenta
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </a>
            </div>
          </div>
          <div className="bg-muted/30 rounded-xl border border-border p-8 flex items-center justify-center aspect-video">
            <div className="text-center">
              <Monitor className="w-16 h-16 text-primary/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">JETCAM Expert / Orders</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <h2 className="text-2xl font-bold mb-6">Główne funkcje</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: Layers,
              title: "Automatyczny nesting",
              desc: "Zaawansowane algorytmy nestingu minimalizują odpady materiału. JETCAM automatycznie rozmieszcza detale na arkuszu, optymalizując wykorzystanie materiału nawet o kilkanaście procent w porównaniu z ręcznym programowaniem.",
              color: "bg-blue-50 text-blue-600",
            },
            {
              icon: Cpu,
              title: "Postprocesory NC",
              desc: "JETCAM obsługuje ponad 100 postprocesorów dla wszystkich wiodących producentów maszyn: Trumpf, Bystronic, Mazak, LVD, Amada i wielu innych. Generowanie kodu NC jest w pełni zautomatyzowane.",
              color: "bg-green-50 text-green-600",
            },
            {
              icon: Globe,
              title: "Integracja z ERP/MES",
              desc: "JETCAM Orders umożliwia integrację z systemami ERP i MES, automatyzując przepływ zleceń produkcyjnych. Moduł importuje zlecenia bezpośrednio z systemu zarządzania produkcją.",
              color: "bg-purple-50 text-purple-600",
            },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="bg-white rounded-xl border border-border p-6">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-3">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Product variants */}
        <h2 className="text-2xl font-bold mb-6">Wersje oprogramowania</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {[
            {
              name: "JETCAM Expert",
              badge: "Programowanie NC",
              features: [
                "Import DXF, DWG, IGES, STEP",
                "Edytor geometrii 2D",
                "Automatyczny nesting",
                "Generowanie kodu NC",
                "Obsługa 100+ postprocesorów",
                "Symulacja cięcia",
              ],
            },
            {
              name: "JETCAM Orders",
              badge: "Zarządzanie zleceniami",
              features: [
                "Wszystkie funkcje JETCAM Expert",
                "Moduł zarządzania zleceniami",
                "Integracja z ERP/MES",
                "Automatyczne planowanie nestingu",
                "Raportowanie i statystyki",
                "Wielostanowiskowa praca sieciowa",
              ],
            },
          ].map(({ name, badge, features }) => (
            <div key={name} className="bg-white rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="font-bold text-xl">{name}</h3>
                <Badge variant="secondary">{badge}</Badge>
              </div>
              <ul className="space-y-2 mb-6">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/kontakt">
                <Button variant="outline" className="w-full">Zapytaj o cenę</Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { value: "10 000+", label: "Użytkowników na świecie" },
            { value: "70+", label: "Krajów" },
            { value: "100+", label: "Postprocesorów" },
            { value: "30+", label: "Lat na rynku" },
          ].map(({ value, label }) => (
            <div key={label} className="bg-muted/30 rounded-xl border border-border p-5 text-center">
              <p className="text-3xl font-black text-primary mb-1">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-primary rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">Zainteresowany oprogramowaniem JETCAM?</h2>
          <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
            Skontaktuj się z nami, aby uzyskać wycenę, demonstrację lub informacje o szkoleniach.
          </p>
          <Link href="/kontakt">
            <Button size="lg" variant="secondary">Skontaktuj się z nami</Button>
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
