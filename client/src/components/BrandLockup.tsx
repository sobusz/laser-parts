import { cn } from "@/lib/utils";

export default function BrandLockup({ inverted = false }: { inverted?: boolean }) {
  return (
    <span
      className={cn(
        "font-mono text-[15px] sm:text-lg font-bold tracking-[0.08em] leading-none",
        inverted ? "text-primary" : "text-foreground"
      )}
    >
      Laser-Parts
    </span>
  );
}
