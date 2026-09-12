import PublicLayout from "@/components/PublicLayout";
import PageHeader from "@/components/PageHeader";

export default function Rodo() {
  return (
    <PublicLayout>
      <PageHeader
        crumbs={[{ label: "Strona główna", href: "/" }, { label: "Klauzula RODO" }]}
        title="Klauzula informacyjna RODO"
      />
      <div className="tech-grid">
        <div className="container py-12 max-w-3xl">
          <div className="bg-white border border-border p-6 md:p-10 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {`Zgodnie z art. 13 rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO) informujemy:

1. Administratorem danych osobowych jest Laser Parts, ul. Dworcowa 20/22, 87-630 Skępe.
2. Dane przetwarzane są w celu obsługi zapytań, oferty handlowej i komunikacji z kontrahentami.
3. Podanie danych jest dobrowolne, lecz niezbędne do odpowiedzi na zapytanie.
4. Dane przechowywane są przez okres współpracy oraz przedawnienia roszczeń.
5. Przysługują Państwu prawa: dostępu do danych, sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia, sprzeciwu oraz wniesienia skargi do Prezesa UODO.
6. Dane nie podlegają zautomatyzowanemu podejmowaniu decyzji, w tym profilowaniu w rozumieniu art. 22 RODO.

Kontakt w sprawach ochrony danych: laser-parts@laser-parts.pl.`}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
