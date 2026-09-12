import { Link } from "wouter";
import PublicLayout from "@/components/PublicLayout";
import PageHeader from "@/components/PageHeader";

export default function Privacy() {
  return (
    <PublicLayout>
      <PageHeader
        crumbs={[{ label: "Strona główna", href: "/" }, { label: "Polityka prywatności" }]}
        title="Polityka prywatności"
      />
      <div className="tech-grid">
      <div className="container py-12 max-w-3xl">
        <div className="bg-white border border-border p-6 md:p-10 space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>
            Administratorem danych jest Laser Parts, ul. Dworcowa 20/22, 87-630 Skępe, NIP 893-104-80-94.
            Kontakt: laser-parts@laser-parts.pl, tel. +48 691 732 408.
          </p>
          <p>
            Dane z formularzy kontaktowych i zapytań ofertowych (imię, e-mail, telefon, nazwa firmy, treść
            wiadomości) przetwarzamy w celu odpowiedzi na zapytanie i realizacji współpracy handlowej
            (art. 6 ust. 1 lit. b i f RODO).
          </p>
          <p>
            Dane nie są sprzedawane. Mogą być powierzane dostawcom hostingu i poczty wyłącznie w zakresie
            niezbędnym do działania strony. Przysługuje Państwu prawo dostępu, sprostowania, usunięcia,
            ograniczenia przetwarzania oraz sprzeciwu. Skarga: Prezes UODO.
          </p>
          <p>
            Strona nie prowadzi sklepu internetowego ani płatności online. Szczegóły klauzuli informacyjnej:
            {" "}
            <Link href="/klauzula-rodo" className="font-medium text-foreground underline decoration-primary decoration-2 underline-offset-4">
              Klauzula RODO
            </Link>.
          </p>
        </div>
      </div>
      </div>
    </PublicLayout>
  );
}
