import { Link } from "wouter";
import { Phone, Mail, MapPin, Building2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-white/20 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">LP</span>
              </div>
              <span className="font-bold text-xl tracking-tight">LASER PARTS</span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Specjalizujemy się w sprzedaży materiałów eksploatacyjnych i części do przemysłowych
              wycinarek laserowych. Gwarantujemy szybkie terminy realizacji i atrakcyjne warunki handlowe.
            </p>
            <p className="text-primary-foreground/50 text-xs mt-4">
              Laser Parts nie jest powiązana z firmami TRUMPF®, Bystronic®, Mazak® ani innymi
              producentami wycinarek laserowych.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-primary-foreground/80">
              Nawigacja
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Strona główna", href: "/" },
                { label: "Oferta handlowa", href: "/oferta" },
                { label: "Technologia laserowa", href: "/technologia" },
                { label: "Oprogramowanie JETCAM", href: "/oprogramowanie" },
                { label: "Kontakt", href: "/kontakt" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-primary-foreground/80">
              Kontakt
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-primary-foreground/70">
                <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <a href="tel:+48691732408" className="hover:text-primary-foreground transition-colors block">
                    +48 691 732 408 (Anna)
                  </a>
                  <a href="tel:+48501676186" className="hover:text-primary-foreground transition-colors block">
                    +48 501 676 186 (Jacek)
                  </a>
                  <a href="tel:+48601225592" className="hover:text-primary-foreground transition-colors block">
                    +48 601 225 592 (Tomasz)
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2 text-primary-foreground/70">
                <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <a href="mailto:laser-parts@laser-parts.pl" className="hover:text-primary-foreground transition-colors block">
                    laser-parts@laser-parts.pl
                  </a>
                  <a href="mailto:zamowienia@laser-parts.pl" className="hover:text-primary-foreground transition-colors block">
                    zamowienia@laser-parts.pl
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Address */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-primary-foreground/80">
              Adresy
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-2 text-primary-foreground/70">
                <Building2 className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-primary-foreground/90">Siedziba</p>
                  <p>ul. Dworcowa 20/22</p>
                  <p>87-630 Skępe</p>
                </div>
              </li>
              <li className="flex items-start gap-2 text-primary-foreground/70">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-primary-foreground/90">Magazyn</p>
                  <p>ul. Bławatna 10M</p>
                  <p>55-095 Mirków</p>
                </div>
              </li>
            </ul>
            <div className="mt-4 text-xs text-primary-foreground/50">
              <p>NIP: 893-104-80-94</p>
              <p>REGON: 340043718</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-primary-foreground/50">
          <p>© {new Date().getFullYear()} Laser Parts. Wszelkie prawa zastrzeżone.</p>
          <div className="flex items-center gap-4">
            <Link href="/polityka-prywatnosci" className="hover:text-primary-foreground/80 transition-colors">
              Polityka prywatności
            </Link>
            <Link href="/regulamin" className="hover:text-primary-foreground/80 transition-colors">
              Regulamin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
