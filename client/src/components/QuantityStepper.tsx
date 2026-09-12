import { Minus, Plus } from "lucide-react";
import { useLocale } from "@/i18n/locale";

export default function QuantityStepper({
  id,
  value,
  onChange,
  labelledBy,
}: {
  id?: string;
  value: number;
  onChange: (value: number) => void;
  labelledBy?: string;
}) {
  const { t } = useLocale();
  return (
    <div className="inline-flex items-center border border-border bg-white">
      <button
        type="button"
        className="h-11 w-11 flex items-center justify-center hover:bg-muted"
        aria-label={t("product.qtyDec")}
        onClick={() => onChange(Math.max(1, value - 1))}
      >
        <Minus className="w-4 h-4" aria-hidden="true" />
      </button>
      <input
        id={id}
        aria-labelledby={labelledBy}
        className="w-12 h-11 text-center border-x border-border tabular-nums"
        inputMode="numeric"
        value={value}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (Number.isFinite(next) && next >= 1) onChange(Math.floor(next));
        }}
      />
      <button
        type="button"
        className="h-11 w-11 flex items-center justify-center hover:bg-muted"
        aria-label={t("product.qtyInc")}
        onClick={() => onChange(value + 1)}
      >
        <Plus className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
}
