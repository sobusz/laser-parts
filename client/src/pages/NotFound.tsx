import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import BrandLockup from "@/components/BrandLockup";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-secondary text-white p-4 relative overflow-hidden">
      <div className="absolute inset-0 tech-grid-dark" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
      <div className="relative max-w-md text-center">
        <div className="flex justify-center mb-8">
          <BrandLockup inverted />
        </div>
        <p className="font-display text-7xl font-bold text-primary mb-3">404</p>
        <h1 className="text-xl font-semibold mb-2">Nie znaleziono strony</h1>
        <p className="text-white/70 mb-8">Adres nie istnieje albo treść została przeniesiona.</p>
        <Button className="h-11 px-6" onClick={() => setLocation("/")}>
          Strona główna
        </Button>
      </div>
    </div>
  );
}
