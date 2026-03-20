import { Link } from "wouter";
import { Zap, Target, Settings, Shield, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/PublicLayout";

export default function Technology() {
  return (
    <PublicLayout>
      {/* Page header */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container py-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Link href="/" className="hover:text-foreground transition-colors">Strona główna</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">Technologia laserowa</span>
          </nav>
          <h1 className="text-3xl font-bold">Technologia laserowa</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Podstawy działania wycinarek laserowych i kluczowe elementy eksploatacyjne
          </p>
        </div>
      </div>

      <div className="container py-12">
        {/* Intro */}
        <div className="max-w-3xl mb-12">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Wycinarka laserowa to precyzyjne urządzenie przemysłowe, w którym skoncentrowana wiązka
            laserowa umożliwia cięcie, grawerowanie i perforowanie szerokiej gamy materiałów — od
            stali i aluminium po tworzywa sztuczne i drewno. Jakość i trwałość elementów optycznych
            oraz eksploatacyjnych bezpośrednio wpływają na dokładność i efektywność procesu cięcia.
          </p>
        </div>

        {/* Key components */}
        <h2 className="text-2xl font-bold mb-6">Kluczowe elementy wycinarki laserowej</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {[
            {
              icon: Zap,
              title: "Dysze tnące",
              desc: "Dysza jest jednym z najczęściej wymienianych elementów eksploatacyjnych. Odpowiada za kierowanie strumienia gazu tnącego (azot, tlen, powietrze) na materiał. Jej geometria i stan techniczny bezpośrednio wpływają na jakość krawędzi cięcia. Oferujemy dysze do maszyn Trumpf, Bystronic, Mazak, LVD i innych wiodących producentów.",
              color: "bg-blue-50 text-blue-600",
            },
            {
              icon: Target,
              title: "Soczewki fokusujące",
              desc: "Soczewka skupia wiązkę laserową w punkt o bardzo małej średnicy, co umożliwia osiągnięcie wysokiej gęstości mocy niezbędnej do cięcia. Zanieczyszczona lub zarysowana soczewka powoduje rozproszenie wiązki, obniżenie jakości cięcia i wzrost zużycia energii. Regularna wymiana jest kluczowa dla utrzymania optymalnych parametrów procesu.",
              color: "bg-green-50 text-green-600",
            },
            {
              icon: Settings,
              title: "Ceramika głowicy",
              desc: "Uchwyty ceramiczne i izolatory elektryczne w głowicy tnącej zapewniają stabilne pozycjonowanie dyszy i izolację elektryczną niezbędną do działania czujnika pojemnościowego. Uszkodzona ceramika może prowadzić do błędów pomiaru odległości i kolizji głowicy z materiałem.",
              color: "bg-orange-50 text-orange-600",
            },
            {
              icon: Shield,
              title: "Szyby ochronne",
              desc: "Szyba ochronna (okno laserowe) chroni soczewkę fokusującą przed odpryskami i dymem powstającym podczas cięcia. Jest elementem jednorazowym — po zabrudzeniu lub zarysowaniu należy ją wymienić. Stosowanie oryginalnych lub równoważnych szyb o odpowiedniej transmisji zapobiega uszkodzeniu kosztownej soczewki.",
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

        {/* Supported brands */}
        <div className="bg-muted/30 rounded-xl border border-border p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Obsługiwane marki maszyn</h2>
          <p className="text-muted-foreground mb-6">
            Posiadamy w ofercie części eksploatacyjne do wycinarek laserowych następujących producentów:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {[
              "Trumpf", "Bystronic", "Mazak", "LVD", "Prima Power",
              "Amada", "Mitsubishi", "Messer", "Finn-Power", "Salvagnini",
              "Cincinnati", "Tanaka",
            ].map((brand) => (
              <div
                key={brand}
                className="bg-white rounded-lg border border-border px-4 py-3 text-sm font-medium text-center"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance tips */}
        <div className="max-w-3xl mb-12">
          <h2 className="text-2xl font-bold mb-6">Wskazówki dotyczące konserwacji</h2>
          <div className="space-y-4">
            {[
              {
                num: "01",
                title: "Regularna inspekcja dyszy",
                desc: "Sprawdzaj stan dyszy przed każdą zmianą produkcyjną. Deformacja lub zanieczyszczenie otworu dyszy powoduje asymetryczny przepływ gazu i pogorszenie jakości cięcia.",
              },
              {
                num: "02",
                title: "Czyszczenie optyki",
                desc: "Soczewki i szyby ochronne czyść wyłącznie dedykowanymi środkami i chusteczkami bezpyłowymi. Nigdy nie używaj sprężonego powietrza bez filtra oleju.",
              },
              {
                num: "03",
                title: "Kontrola ceramiki",
                desc: "Regularnie sprawdzaj stan ceramiki głowicy. Pęknięcia lub odpryski mogą prowadzić do błędów czujnika pojemnościowego i kolizji.",
              },
              {
                num: "04",
                title: "Używaj oryginalnych części",
                desc: "Stosowanie nieoryginalnych lub niskiej jakości elementów eksploatacyjnych może skrócić żywotność kosztownych komponentów laserowych i obniżyć jakość produkcji.",
              },
            ].map(({ num, title, desc }) => (
              <div key={num} className="flex gap-4 p-4 bg-white rounded-lg border border-border">
                <span className="text-2xl font-black text-primary/20 shrink-0 w-10">{num}</span>
                <div>
                  <h3 className="font-semibold mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">Potrzebujesz części do swojej maszyny?</h2>
          <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
            Skontaktuj się z nami, podając model maszyny i numer referencyjny części. Pomożemy dobrać właściwy element.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/oferta">
              <Button size="lg" variant="secondary">Przeglądaj ofertę</Button>
            </Link>
            <Link href="/kontakt">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Skontaktuj się
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
