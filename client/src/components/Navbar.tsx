import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { ClipboardList, Menu, X, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInquiry } from "@/contexts/InquiryContext";
import { cn } from "@/lib/utils";
import BrandLockup from "@/components/BrandLockup";
import { useLocale } from "@/i18n/locale";
import { catalogHref } from "@/lib/catalog-url";

export default function Navbar() {
  const { t, locale, setLocale } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [location] = useLocation();
  const { totalItems } = useInquiry();
  const moreRef = useRef<HTMLDivElement>(null);

  const primary = [
    { label: t("nav.catalog"), href: "/oferta" },
    { label: t("nav.help"), href: "/kontakt" },
    { label: t("nav.order"), href: "/jak-zamawiac" },
    { label: t("nav.contact"), href: "/kontakt#dane" },
  ];
  const more = [
    { label: t("nav.optics"), href: "/optyka" },
    { label: t("nav.pvd"), href: "/nowosc" },
    { label: t("nav.software"), href: "/oprogramowanie" },
    { label: t("nav.tech"), href: "/technologia" },
    { label: "TRUMPF", href: catalogHref({ brand: "trumpf" }) },
    { label: "Bystronic", href: catalogHref({ brand: "bystronic" }) },
    { label: "Mazak", href: catalogHref({ brand: "mazak" }) },
    { label: "LVD", href: catalogHref({ brand: "lvd" }) },
  ];

  useEffect(() => {
    setMoreOpen(false);
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (!moreRef.current?.contains(event.target as Node)) setMoreOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setMoreOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#2F3438]">
      <div className="container">
        <div className="flex items-center justify-between h-16 gap-2">
          <Link href="/" className="shrink-0">
            <BrandLockup inverted />
          </Link>
          <nav className="hidden lg:flex items-center gap-1">
            {primary.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className={cn(
                  "flex items-center px-3 h-11 text-sm font-semibold",
                  location === link.href.split("#")[0] ? "text-primary" : "text-white/80 hover:text-white",
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="relative" ref={moreRef}>
              <button
                type="button"
                aria-expanded={moreOpen}
                className="flex items-center gap-1 px-3 h-11 text-sm font-semibold text-white/80 hover:text-white"
                onClick={() => setMoreOpen((open) => !open)}
              >
                {t("nav.more")}
                <ChevronDown className={cn("w-3.5 h-3.5", moreOpen && "rotate-180")} />
              </button>
              {moreOpen ? (
                <div className="absolute top-full right-0 pt-2 z-50">
                  <div className="w-52 bg-[#2F3438] border border-white/15 py-1">
                    {more.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-3 text-sm text-white/85 hover:bg-white/10"
                        onClick={() => setMoreOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </nav>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="flex rounded border border-white/20 text-xs font-semibold">
              <button
                type="button"
                className={cn("h-9 px-2", locale === "pl" ? "bg-primary text-primary-foreground" : "text-white/80")}
                onClick={() => setLocale("pl")}
                aria-pressed={locale === "pl"}
                lang="pl"
              >
                PL
              </button>
              <button
                type="button"
                className={cn("h-9 px-2", locale === "en" ? "bg-primary text-primary-foreground" : "text-white/80")}
                onClick={() => setLocale("en")}
                aria-pressed={locale === "en"}
                lang="en"
              >
                EN
              </button>
            </div>
            <a href="tel:+48691732408" className="hidden md:flex items-center gap-2 h-11 px-2 text-sm font-semibold text-white/90">
              <Phone className="w-4 h-4" />
              +48 691 732 408
            </a>
            <Link href="/zapytanie">
              <Button className="relative gap-2 px-3 sm:px-5 h-11 text-sm">
                <ClipboardList className="w-4 h-4" />
                <span className="hidden sm:inline">{t("nav.inquiry")}</span>
                {totalItems > 0 ? (
                  <span className="absolute -top-2 -right-2 bg-[#2F3438] text-primary text-xs font-bold min-w-5 h-5 px-1 flex items-center justify-center border border-primary">
                    <span className="sr-only">{t("nav.inquiryCount")} </span>
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                ) : null}
              </Button>
            </Link>
            <button
              className="lg:hidden h-11 w-11 flex items-center justify-center text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? t("nav.closeMenu") : t("nav.openMenu")}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      {mobileOpen ? (
        <div className="lg:hidden border-t border-white/15 bg-[#2F3438]">
          <nav className="container py-3 flex flex-col">
            <a href="tel:+48691732408" className="flex items-center gap-2 px-3 py-3 font-semibold text-white">
              <Phone className="w-4 h-4" />
              +48 691 732 408
            </a>
            {[...primary, ...more].map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="block px-3 py-3 text-white/85"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
