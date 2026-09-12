import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PreviewBanner from "./PreviewBanner";

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#tresc"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-5 focus:py-3 focus:font-semibold"
      >
        Przejdź do treści
      </a>
      <PreviewBanner />
      <Navbar />
      <main id="tresc" className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
