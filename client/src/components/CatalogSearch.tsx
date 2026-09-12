import { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { catalogHref } from "@/lib/catalog-url";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";

export default function CatalogSearch({
  id,
  categorySlug = "",
  query,
  onQueryChange,
}: {
  id: string;
  categorySlug?: string;
  query: string;
  onQueryChange?: (value: string) => void;
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
      className="relative w-full max-w-xl"
      onSubmit={(event) => {
        event.preventDefault();
        const picked = showList ? suggestions[highlight] : undefined;
        if (picked) {
          setOpen(false);
          setLocation(`/produkt/${picked.slug}`);
          return;
        }
        goToCatalog();
      }}
    >
      <label htmlFor={id} className="sr-only">
        Szukaj po nazwie lub numerze referencyjnym
      </label>
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        id={id}
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        value={query}
        placeholder="np. 0260432 albo Ceramic nozzle holder"
        onChange={(event) => {
          onQueryChange?.(event.target.value);
          setOpen(true);
          setHighlight(0);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          if (!showList) return;
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setHighlight((i) => Math.min(i + 1, suggestions.length - 1));
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setHighlight((i) => Math.max(i - 1, 0));
          } else if (event.key === "Escape") {
            setOpen(false);
          }
        }}
        className="pl-12 h-12 bg-white border-border"
      />
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
