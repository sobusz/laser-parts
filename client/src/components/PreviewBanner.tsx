import { useLocale } from "@/i18n/locale";

export default function PreviewBanner() {
  const { t } = useLocale();
  if (import.meta.env.VITE_PREVIEW !== "true") return null;
  return (
    <div className="bg-primary text-primary-foreground text-center text-sm font-medium px-4 py-2">
      {t("preview.banner")}
    </div>
  );
}
