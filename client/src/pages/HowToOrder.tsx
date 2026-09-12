import CommercialTerms from "@/components/CommercialTerms";
import PublicLayout from "@/components/PublicLayout";
import { useLocale } from "@/i18n/locale";

export default function HowToOrder() {
  const { t } = useLocale();
  return (
    <PublicLayout>
      <div className="bg-white border-b border-border">
        <div className="container py-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">{t("order.title")}</h1>
          <p className="text-muted-foreground max-w-2xl">{t("order.lead")}</p>
        </div>
      </div>
      <div className="container py-10">
        <CommercialTerms />
      </div>
    </PublicLayout>
  );
}
