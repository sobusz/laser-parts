import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X, Phone, Mail, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Strona główna", href: "/" },
  {
    label: "Oferta",
    href: "/oferta",
    children: [
      { label: "Wszystkie produkty", href: "/oferta" },
      { label: "Trumpf", href: "/oferta?kategoria=trumpf" },
      { label: "Bystronic", href: "/oferta?kategoria=bystronic" },
      { label: "Mazak", href: "/oferta?kategoria=mazak" },
      { label: "LVD", href: "/oferta?kategoria=lvd" },
      { label: "Inne marki", href: "/oferta?kategoria=inne" },
    ],
  },
  { label: "Technologia", href: "/technologia" },
  { label: "Oprogramowanie", href: "/oprogramowanie" },
  { label: "Kontakt", href: "/kontakt" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [location] = useLocation();
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground text-xs py-1.5">
        <div className="container flex items-center justify-between gap-4">
          <span className="hidden sm:block font-medium">Laser Parts – Części do wycinarek laserowych</span>
          <div className="flex items-center gap-4 ml-auto">
            <a href="tel:+48691732408" className="flex items-center gap-1 hover:text-white/80 transition-colors">
              <Phone className="w-3 h-3" />
              +48 691 732 408
            </a>
            <a href="mailto:laser-parts@laser-parts.pl" className="flex items-center gap-1 hover:text-white/80 transition-colors">
              <Mail className="w-3 h-3" />
              laser-parts@laser-parts.pl
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-primary rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm leading-none">LP</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-primary text-lg tracking-tight">LASER PARTS</span>
              <span className="text-muted-foreground text-[10px] uppercase tracking-widest hidden sm:block">
                Części do laserów
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button
                    className={cn(
                      "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      location.startsWith("/oferta")
                        ? "text-primary bg-primary/5"
                        : "text-foreground hover:text-primary hover:bg-muted"
                    )}
                  >
                    {link.label}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-md shadow-lg border border-border py-1 z-50">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    location === link.href
                      ? "text-primary bg-primary/5"
                      : "text-foreground hover:text-primary hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Cart + mobile toggle */}
          <div className="flex items-center gap-2">
            <Link href="/koszyk">
              <Button variant="outline" size="sm" className="relative gap-2">
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">Koszyk</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Button>
            </Link>

            <button
              className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-white">
          <nav className="container py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <div key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "block px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                    location === link.href
                      ? "text-primary bg-primary/5"
                      : "text-foreground hover:text-primary hover:bg-muted"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="ml-4 mt-1 flex flex-col gap-0.5">
                    {link.children.slice(1).map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-3 py-2 text-xs text-muted-foreground hover:text-primary transition-colors"
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
