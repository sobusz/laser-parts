import { useState } from "react";
import { Check, Copy, Gift } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BANK_FIELDS, PROMO_HEADING, PROMO_OVER_2000, TRADE_TERMS } from "@shared/legacy-copy";

function CopyRow({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="font-mono text-sm tracking-tight whitespace-nowrap overflow-x-auto">
          {value}
        </p>
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        className="shrink-0"
        aria-label={`Kopiuj: ${label}`}
        onClick={onCopy}
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      </Button>
    </div>
  );
}

export default function CommercialTerms({ compact }: { compact?: boolean }) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  async function copyValue(key: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      toast.success("Skopiowano do schowka");
      window.setTimeout(() => setCopiedKey((current) => (current === key ? null : current)), 1600);
    } catch {
      toast.error("Nie udało się skopiować");
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border border border-border">
        {TRADE_TERMS.map(({ title, desc }) => (
          <div key={title} className={compact ? "bg-white px-4 py-4" : "bg-white px-5 py-5"}>
            <p className="eyebrow text-foreground mb-2">{title}</p>
            <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
              {desc}
              {title === "Wysyłka" ? (
                <>
                  {" "}
                  <a href="mailto:zamowienia@laser-parts.pl" className="whitespace-nowrap underline underline-offset-2 hover:text-primary">
                    zamowienia@laser-parts.pl
                  </a>
                </>
              ) : null}
            </p>
          </div>
        ))}
      </div>

      <div className="border border-primary bg-[#F5C400]/12 px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex gap-4 items-start">
          <div className="hidden sm:flex size-11 shrink-0 items-center justify-center bg-primary text-primary-foreground">
            <Gift className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="eyebrow text-foreground mb-2">{PROMO_HEADING}</p>
            <p className="text-base text-foreground leading-relaxed text-pretty">{PROMO_OVER_2000}</p>
          </div>
        </div>
      </div>

      <div className="border border-border bg-white">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-muted/60">
          <h3 className="text-sm font-semibold tracking-tight">Dane do przelewu</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() =>
              copyValue(
                "all",
                BANK_FIELDS.map(({ label, value }) => `${label}: ${value}`).join("\n"),
              )
            }
          >
            {copiedKey === "all" ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            Kopiuj wszystko
          </Button>
        </div>
        <div>
          {BANK_FIELDS.map((field) => (
            <CopyRow
              key={field.label}
              label={field.label}
              value={field.value}
              copied={copiedKey === field.label}
              onCopy={() => copyValue(field.label, field.value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
