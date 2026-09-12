import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PreviewBanner from "./PreviewBanner";
import { useLocale } from "@/i18n/locale";

export default function PublicLayout({ children }: { children: ReactNode }) {
  const { t } = useLocale();
  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#tresc"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-5 focus:py-3 focus:font-semibold"
      >
        {t("skip")}
      </a>
      <PreviewBanner />
      <Navbar />
      <main id="tresc" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
