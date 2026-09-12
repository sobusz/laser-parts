import { Link, useParams } from "wouter";
import { ChevronRight, Package, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PublicLayout from "@/components/PublicLayout";
import { trpc } from "@/lib/trpc";
import { useLocale } from "@/i18n/locale";

export default function UsedMachine() {
  const { t } = useLocale();
  const { slug } = useParams<{ slug: string }>();
  const { data: machine, isLoading } = trpc.machines.bySlug.useQuery({ slug: slug ?? "" });

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container py-8">
          <Skeleton className="h-64 w-full" />
        </div>
      </PublicLayout>
    );
  }

  if (!machine) {
    return (
      <PublicLayout>
        <div className="container py-16 text-center">
          <Package className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">{t("machine.missing")}</h1>
          <Link href="/">
            <Button>{t("machine.back")}</Button>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="bg-white border-b border-border">
        <div className="container py-4">
          <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-2 text-sm font-mono text-muted-foreground">
            <Link href="/" className="underline underline-offset-4 decoration-border hover:text-primary py-1">
              Laser Parts
            </Link>
            <ChevronRight className="w-4 h-4 text-border" />
            <span>{t("home.machines")}</span>
            <ChevronRight className="w-4 h-4 text-border" />
            <span className="text-foreground">{machine.title}</span>
          </nav>
        </div>
      </div>
      <div className="container py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="border border-border bg-muted/30 aspect-[4/3] flex items-center justify-center overflow-hidden">
          {machine.imageUrl ? (
            <img src={machine.imageUrl} alt={machine.title} className="w-full h-full object-contain" />
          ) : (
            <Package className="w-16 h-16 text-muted-foreground/30" aria-hidden />
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-3">{machine.title}</h1>
          <p className="text-sm text-muted-foreground mb-6">{t("machine.lead")}</p>
          {machine.description ? (
            <p className="text-muted-foreground whitespace-pre-wrap mb-6">{machine.description}</p>
          ) : null}
          {machine.contactNote ? <p className="text-sm font-medium mb-6">{machine.contactNote}</p> : null}
          <div className="flex flex-wrap gap-3">
            <Link href="/kontakt">
              <Button size="lg" className="h-11">
                {t("machine.contact")}
              </Button>
            </Link>
            <a href="tel:+48691732408" className="inline-flex">
              <Button variant="outline" size="lg" className="h-11 gap-2">
                <Phone className="w-4 h-4" />
                +48 691 732 408
              </Button>
            </a>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
