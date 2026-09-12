import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { ClipboardList, Menu, X, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInquiry } from "@/contexts/InquiryContext";
import { cn } from "@/lib/utils";
import BrandLockup from "@/components/BrandLockup";

const navLinks = [
  {
    label: "Oferta",
    href: "/oferta",
    children: [
      { label: "Cała oferta", href: "/oferta" },
      { label: "TRUMPF", href: "/oferta?kategoria=trumpf" },
      { label: "Bystronic", href: "/oferta?kategoria=bystronic" },
      { label: "Mazak", href: "/oferta?kategoria=mazak" },
      { label: "LVD", href: "/oferta?kategoria=lvd" },
      { label: "Inne marki", href: "/oferta?kategoria=inne" },
    ],
  },
  { label: "Optyka", href: "/optyka" },
  { label: "Nowość", href: "/nowosc" },
  { label: "Oprogramowanie", href: "/oprogramowanie" },
  { label: "Technologia", href: "/technologia" },
  { label: "Kontakt", href: "/kontakt" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [location] = useLocation();
  const { totalItems } = useInquiry();
  const ofertaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (!ofertaRef.current?.contains(event.target as Node)) setDropdownOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setDropdownOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-black">
      <div className="container">
        <div className="flex items-center justify-between h-[72px]">
          <Link href="/" className="shrink-0">
            <BrandLockup inverted />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.href} className="relative" ref={ofertaRef}>
                  <button
                    type="button"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                    aria-controls="oferta-menu"
                    onClick={() => setDropdownOpen((open) => !open)}
                    className={cn(
                      "flex items-center gap-1 px-3 h-11 text-sm font-semibold transition-colors",
                      location.startsWith("/oferta") || dropdownOpen
                        ? "text-primary"
                        : "text-white/80 hover:text-white"
                    )}
                  >
                    {link.label}
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", dropdownOpen && "rotate-180")} />
                  </button>
                  {dropdownOpen ? (
                    <div id="oferta-menu" role="menu" className="absolute top-full left-0 pt-2 z-50">
                      <div className="w-52 bg-black border border-white/15 py-1">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            role="menuitem"
                            className="block px-4 py-3 text-sm text-white/85 hover:bg-white/10 hover:text-white"
                            onClick={() => setDropdownOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center px-3 h-11 text-sm font-semibold transition-colors",
                    location === link.href
                      ? "text-primary"
                      : "text-white/80 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="tel:+48691732408"
              className="hidden md:flex items-center gap-2 h-11 px-3 text-sm font-semibold text-white/90 hover:text-white"
            >
              <Phone className="w-4 h-4" />
              +48 691 732 408
            </a>
            <Link href="/zapytanie">
              <Button className="relative gap-2 px-5 h-11 text-sm">
                <ClipboardList className="w-4 h-4" />
                <span className="hidden sm:inline">Zapytanie</span>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-primary text-xs font-bold min-w-5 h-5 px-1 flex items-center justify-center">
                    <span className="sr-only">Pozycji w zapytaniu: </span>
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Button>
            </Link>
            <button
              className="lg:hidden h-11 w-11 flex items-center justify-center text-white hover:bg-white/10"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Zamknij menu" : "Otwórz menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-white/15 bg-black">
          <nav className="container py-3 flex flex-col gap-1">
            <a href="tel:+48691732408" className="flex items-center gap-2 px-3 py-3.5 text-base font-semibold text-white">
              <Phone className="w-4 h-4" />
              +48 691 732 408
            </a>
            {navLinks.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "block px-3 py-3.5 text-base font-medium",
                    location === link.href
                      ? "text-primary bg-white/10 border-l-2 border-primary"
                      : "text-white/85 hover:bg-white/10 hover:text-white"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="ml-4 flex flex-col">
                    {link.children.slice(1).map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-3 py-2.5 text-sm text-white/70 hover:text-white"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
