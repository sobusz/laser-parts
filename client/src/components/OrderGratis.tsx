import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { PROMO_NOTE, PROMO_OPTIONS, PROMO_THRESHOLD } from "@shared/legacy-copy";

export default function OrderGratis() {
  return (
    <div className="bg-black text-white px-6 py-8 sm:px-8 sm:py-9">
      <div className="h-1 w-12 bg-primary mb-5" />
      <p className="eyebrow text-primary mb-2">Gratis do zamówienia</p>
      <p className="font-semibold tracking-tight text-pretty text-3xl sm:text-4xl">
        Od {PROMO_THRESHOLD}
      </p>
      <p className="mt-3 max-w-xl text-[15px] text-white/70 leading-relaxed text-pretty">
        Do wartości netto zamówienia dołączamy jeden z dwóch materiałów eksploatacyjnych.
      </p>
      <ul className="mt-6 grid gap-px bg-white/15 border border-white/15 sm:grid-cols-2">
        {PROMO_OPTIONS.map((option) => (
          <li key={option.name} className="bg-black px-4 py-4">
            <p className="font-medium text-sm">{option.name}</p>
            <p className="text-sm text-white/60 mt-1 leading-relaxed text-pretty">{option.detail}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-white/55 leading-relaxed text-pretty">{PROMO_NOTE}</p>
      <Button asChild className="mt-6 h-11 px-6">
        <Link href="/zapytanie">Wskaż wariant w zapytaniu</Link>
      </Button>
    </div>
  );
}
