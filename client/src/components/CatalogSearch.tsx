import { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { catalogHref } from "@/lib/catalog-url";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";

export default function CatalogSearch({
  id,
  categorySlug = "",
  query,
  onQueryChange,
  className,
  tone = "default",
}: {
  id: string;
  categorySlug?: string;
  query: string;
  onQueryChange?: (value: string) => void;
  className?: string;
  tone?: "default" | "onDark";
}) {
  const [, setLocation] = useLocation();
  const listId = useId();
  const rootRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [debounced, setDebounced] = useState(query);

  useEffect(() => {
    const handle = window.setTimeout(() => setDebounced(query.trim()), 220);
    return () => window.clearTimeout(handle);
  }, [query]);

  const enabled = debounced.length >= 2;
  const { data: hits } = trpc.products.list.useQuery(
    { search: debounced, limit: 8 },
    { enabled },
  );
  const suggestions = enabled ? hits ?? [] : [];
  const showList = open && enabled && suggestions.length > 0;

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, []);

  function goToCatalog() {
    setOpen(false);
    setLocation(catalogHref(categorySlug, query));
  }

  return (
    <form
      ref={rootRef}
      className={cn("relative w-full max-w-xl", className)}
      onSubmit={(event) => {
        event.preventDefault();
        goToCatalog();
      }}
    >
      <label
        htmlFor={id}
        className={cn(
          "block text-sm font-medium mb-1",
          tone === "onDark" ? "text-white" : "text-foreground",
        )}
      >
        Szukaj części
      </label>
      <p
        className={cn(
          "text-sm mb-2 leading-relaxed",
          tone === "onDark" ? "text-white/75" : "text-muted-foreground",
        )}
      >
        Wyszukiwanie po nazwie części lub numerze z etykiety. Podpowiedzi pojawiają się po dwóch znakach.
      </p>
      <div className="flex">
        <Input
          id={id}
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          value={query}
          placeholder="Nazwa części lub numer referencyjny"
          onChange={(event) => {
            onQueryChange?.(event.target.value);
            setOpen(true);
            setHighlight(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setOpen(false);
              return;
            }
            if (!showList) return;
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setHighlight((i) => Math.min(i + 1, suggestions.length - 1));
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setHighlight((i) => Math.max(i - 1, 0));
            }
          }}
          className="min-w-0 flex-1 h-12 rounded-r-none bg-white border-border text-foreground"
        />
        <Button type="submit" className="h-12 rounded-l-none px-5 shrink-0">
          <Search className="w-4 h-4" aria-hidden="true" />
          Szukaj
        </Button>
      </div>
      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-40 mt-1 w-full max-h-80 overflow-auto border border-border bg-white text-foreground shadow-sm"
        >
          {suggestions.map((item, index) => (
            <li key={item.id} role="option" aria-selected={index === highlight}>
              <Link
                href={`/produkt/${item.slug}`}
                className={cn(
                  "block px-4 py-3 text-left",
                  index === highlight ? "bg-primary/20" : "hover:bg-muted",
                )}
                onMouseEnter={() => setHighlight(index)}
                onClick={() => setOpen(false)}
              >
                <span className="font-mono text-sm font-medium">
                  {item.referenceNumber ?? "—"}
                </span>
                <span className="block text-sm mt-0.5">{item.name}</span>
              </Link>
            </li>
          ))}
          <li>
            <button
              type="button"
              className="w-full text-left px-4 py-3 text-sm font-medium border-t border-border hover:bg-muted"
              onClick={goToCatalog}
            >
              Pokaż wszystkie wyniki w ofercie
            </button>
          </li>
        </ul>
      )}
    </form>
  );
}
