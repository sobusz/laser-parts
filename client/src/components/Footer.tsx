import { Link } from "wouter";
import { Phone, Mail, MapPin, Building2 } from "lucide-react";
import BrandLockup from "@/components/BrandLockup";
import { FOOTER_BLURB, OEM_DISCLAIMER } from "@shared/legacy-copy";

const NAV_LINKS = [
  { label: "Oferta", href: "/oferta" },
  { label: "Optyka", href: "/optyka" },
  { label: "Oprogramowanie JETCAM", href: "/oprogramowanie" },
  { label: "Technologia", href: "/technologia" },
  { label: "Kontakt", href: "/kontakt" },
];

const PHONES = [
  { number: "+48 691 732 408", person: "Anna", tel: "+48691732408" },
  { number: "+48 501 676 186", person: "Jacek", tel: "+48501676186" },
  { number: "+48 601 225 592", person: "Tomasz", tel: "+48601225592" },
];

const EMAILS = ["laser-parts@laser-parts.pl", "zamowienia@laser-parts.pl"];

export default function Footer() {
  return (
    <footer className="mt-auto bg-black text-white/85">
      <div className="h-1 bg-primary" />
      <div className="container py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="mb-4">
              <BrandLockup inverted />
            </div>
            <p className="text-white/80 leading-relaxed text-pretty">
              {FOOTER_BLURB}
            </p>
            <p className="text-white/70 text-sm mt-4 leading-relaxed text-pretty">
              {OEM_DISCLAIMER}
            </p>
          </div>

          <nav aria-label="Nawigacja w stopce">
            <h3 className="eyebrow text-primary mb-3">Nawigacja</h3>
            <ul>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="block py-2 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="eyebrow text-primary mb-3">Kontakt</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-2.5">
                <Phone className="w-5 h-5 mt-2 shrink-0 text-primary" />
                <div>
                  {PHONES.map((p) => (
                    <a key={p.tel} href={`tel:${p.tel}`} className="block py-2 hover:text-primary transition-colors">
                      {p.number} <span className="text-white/70">({p.person})</span>
                    </a>
                  ))}
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-5 h-5 mt-2 shrink-0 text-primary" />
                <div>
                  {EMAILS.map((mail) => (
                    <a key={mail} href={`mailto:${mail}`} className="block py-2 hover:text-primary transition-colors">
                      {mail}
                    </a>
                  ))}
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="eyebrow text-primary mb-3">Adresy</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-2.5">
                <Building2 className="w-5 h-5 mt-0.5 shrink-0 text-primary" />
                <div>
                  <p className="text-white font-semibold">Siedziba</p>
                  <p>ul. Dworcowa 20/22</p>
                  <p>87-630 Skępe</p>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 mt-0.5 shrink-0 text-primary" />
                <div>
                  <p className="text-white font-semibold">Magazyn</p>
                  <p>ul. Bławatna 10M</p>
                  <p>55-095 Mirków</p>
                </div>
              </li>
            </ul>
            <div className="mt-5 text-sm text-white/70 space-y-1">
              <p>NIP: 893-104-80-94</p>
              <p>REGON: 340043718</p>
              <p className="whitespace-nowrap overflow-x-auto">PKO BP 65 1440 1185 0000 0000 0400 4892</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-white/70">
          <p className="text-pretty">
            © {new Date().getFullYear()} Laser Parts. Zdjęcia: Unsplash i Pexels (licencje Unsplash
            i Pexels).
          </p>
          <div className="flex items-center gap-5">
            <Link href="/klauzula-rodo" className="py-2 underline underline-offset-4 decoration-white/40 hover:text-primary">
              Klauzula RODO
            </Link>
            <Link href="/polityka-prywatnosci" className="py-2 underline underline-offset-4 decoration-white/40 hover:text-primary">
              Polityka prywatności
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
