export default function PreviewBanner() {
  if (import.meta.env.VITE_PREVIEW !== "true") return null;
  return (
    <div className="bg-primary text-primary-foreground text-center text-sm font-medium px-4 py-2">
      Podgląd do akceptacji — dane z katalogu, zapytania i kontakt nie są zapisywane.
    </div>
  );
}
