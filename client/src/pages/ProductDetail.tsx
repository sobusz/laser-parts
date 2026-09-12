import { useState } from "react";
import { Link, useParams } from "wouter";
import { ChevronRight, Package, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import PublicLayout from "@/components/PublicLayout";
import QuantityStepper from "@/components/QuantityStepper";
import { trpc } from "@/lib/trpc";
import { useInquiry } from "@/contexts/InquiryContext";
import { useLocale } from "@/i18n/locale";
import { catalogHref } from "@/lib/catalog-url";
import { brandSlugOf, MACHINE_FAMILIES } from "@shared/catalog-taxonomy";
import { catalogTestMock, TEST_MACHINE_FAMILIES } from "@shared/catalog-test-mocks";

export default function ProductDetail() {
  const { t } = useLocale();
  const { slug } = useParams<{ slug: string }>();
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useInquiry();
  const { data: product, isLoading } = trpc.products.bySlug.useQuery({ slug: slug ?? "" });
  const { data: categories } = trpc.categories.list.useQuery();
  const category = categories?.find((c) => c.id === product?.categoryId);
  const { data: family } = trpc.products.list.useQuery(
    { categorySlug: category?.slug === "optyka" ? undefined : category?.slug },
    { enabled: Boolean(category?.slug) },
  );
  const variants = (family ?? []).filter((p) => {
    if (!product) return false;
    const sameGroup = (p.groupName ?? "") === (product.groupName ?? "");
    const sameSketch = (p.sketchUrl || p.imageUrl) === (product.sketchUrl || product.imageUrl);
    return sameGroup && sameSketch;
  });

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container py-8">
          <Skeleton className="h-64 w-full" />
        </div>
      </PublicLayout>
    );
  }

  if (!product) {
    return (
      <PublicLayout>
        <div className="container py-16 text-center">
          <Package className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">{t("product.missing")}</h1>
          <Link href="/oferta">
            <Button>{t("product.back")}</Button>
          </Link>
        </div>
      </PublicLayout>
    );
  }

  const mock = catalogTestMock({
    id: product.id,
    name: product.name,
    groupName: product.groupName,
    categorySlug: category?.slug,
    description: product.description,
  });
  const packSize = mock.packSize;
  const familyLabel = [...MACHINE_FAMILIES, ...TEST_MACHINE_FAMILIES].find((f) => f.id === mock.family)?.label ?? mock.family;
  const brand = brandSlugOf(category?.slug);

  return (
    <PublicLayout>
      <div className="bg-white border-b border-border">
        <div className="container py-4">
          <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-2 text-sm font-mono text-muted-foreground">
            <Link href="/" className="underline underline-offset-4 decoration-border hover:text-primary py-1">
              Laser Parts
            </Link>
            <ChevronRight className="w-4 h-4 text-border" />
            <Link href="/oferta" className="underline underline-offset-4 decoration-border hover:text-primary py-1">
              {t("catalog.title")}
            </Link>
            {category ? (
              <>
                <ChevronRight className="w-4 h-4 text-border" />
                <Link
                  href={catalogHref({ brand, kind: category.slug === "optyka" ? "optyka" : undefined })}
                  className="text-foreground underline underline-offset-4 py-1"
                >
                  {category.name}
                </Link>
              </>
            ) : null}
          </nav>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,16rem)_1fr] gap-10 items-start">
          <div className="bg-white border border-border p-4 flex items-center justify-center min-h-48">
            {product.sketchUrl || product.imageUrl ? (
              <img
                src={product.sketchUrl || product.imageUrl || ""}
                alt=""
                className="block max-h-64 w-auto mx-auto"
              />
            ) : (
              <Package className="w-20 h-20 text-muted-foreground/30" />
            )}
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">{product.name}</h1>
            {product.referenceNumber ? (
              <p className="font-mono text-sm mb-1">
                {t("catalog.ref")}: <span className="font-medium">{product.referenceNumber}</span>
              </p>
            ) : null}
            {product.orderNumber ? (
              <p className="font-mono text-sm text-muted-foreground mb-3">{product.orderNumber}</p>
            ) : null}
            {category ? <Badge variant="secondary" className="mb-3">{category.name}</Badge> : null}
            {familyLabel ? (
              <p className="text-sm mb-3">
                <span className="font-medium">{t("product.testCompat")}: </span>
                {familyLabel}
              </p>
            ) : null}
            <p className="text-sm text-muted-foreground mb-4 max-w-xl">{t("product.compatHint")}</p>
            {product.specifications ? (
              <div className="mb-6">
                <h2 className="text-sm font-semibold mb-2">{t("product.specs")}</h2>
                <pre className="text-sm whitespace-pre-wrap font-sans bg-white border border-border p-4">{product.specifications}</pre>
              </div>
            ) : null}
            <p className="text-xl font-semibold mb-4">
              {product.price
                ? `${Number(product.price).toFixed(2)} zł netto / ${product.unit}`
                : t("product.priceInquiry")}
            </p>
            <div className="mb-4">
              <p className="text-sm font-semibold">{t("product.availability")}</p>
              <p className="text-sm text-muted-foreground">
                {mock.availability === "in_stock" ? t("product.inStock") : t("product.onOrder")}
              </p>
            </div>
            {product.description ? <p className="text-muted-foreground mb-4">{product.description}</p> : null}
            <p id="qty-label" className="text-sm font-medium mb-2">
              {t("product.qty")}
              {packSize ? ` — ${t("product.pack")} (${packSize} ${t("product.pcs")})` : ` — ${t("product.pcs")}`}
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              {packSize ? t("product.packHint").replace("{n}", String(packSize)) : t("product.unitHint")}
            </p>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <QuantityStepper labelledBy="qty-label" value={quantity} onChange={setQuantity} />
              <Button
                size="lg"
                className="h-11 px-6"
                onClick={() => {
                  addItem({
                    productId: product.id,
                    name: product.name,
                    referenceNumber: product.referenceNumber,
                    quantity,
                    unit: mock.salesUnit,
                    packSize,
                  });
                  toast.success(t("catalog.added"));
                }}
              >
                {t("product.add")}
              </Button>
            </div>
            <a href="tel:+48691732408" className="inline-flex">
              <Button variant="outline" className="h-11 gap-2">
                <Phone className="w-4 h-4" />
                {t("product.help")}: +48 691 732 408
              </Button>
            </a>
            {variants.length > 1 ? (
              <div className="mt-8">
                <h2 className="text-sm font-semibold mb-1">{t("product.variants")}</h2>
                <p className="text-sm text-muted-foreground mb-3">{t("product.variantsHint")}</p>
                <ul className="border border-border divide-y divide-border">
                  {variants.map((v) => (
                    <li key={v.id}>
                      {v.id === product.id ? (
                        <span className="flex justify-between gap-4 px-3 py-2 text-sm bg-muted/60">
                          <span className="font-medium">{v.name}</span>
                          <span className="font-mono text-muted-foreground">{v.referenceNumber ?? "—"}</span>
                        </span>
                      ) : (
                        <Link href={`/produkt/${v.slug}`} className="flex justify-between gap-4 px-3 py-2 text-sm hover:bg-primary/10">
                          <span>{v.name}</span>
                          <span className="font-mono text-muted-foreground">{v.referenceNumber ?? "—"}</span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
