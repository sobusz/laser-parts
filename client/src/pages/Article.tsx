import { Link, useParams } from "wouter";
import PublicLayout from "@/components/PublicLayout";
import PageHeader from "@/components/PageHeader";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/i18n/locale";
import { ARTICLE_TEST_EN } from "@shared/catalog-test-mocks";

const SECTION_META: Record<string, { titleKey: "nav.optics" | "nav.pvd" | "nav.software" | "nav.tech"; fallbackSlug: string }> = {
  optyka: { titleKey: "nav.optics", fallbackSlug: "optyka" },
  nowosc: { titleKey: "nav.pvd", fallbackSlug: "nowosc" },
  oprogramowanie: { titleKey: "nav.software", fallbackSlug: "oprogramowanie" },
  technologia: { titleKey: "nav.tech", fallbackSlug: "technologia" },
};

export default function ArticlePage({ section }: { section?: string }) {
  const { t, locale } = useLocale();
  const params = useParams<{ slug?: string }>();
  const sectionKey = section ?? "technologia";
  const meta = SECTION_META[sectionKey] ?? SECTION_META.technologia;
  const slug = params.slug ?? meta.fallbackSlug;
  const { data: article, isLoading } = trpc.articles.bySlug.useQuery({ slug });
  const en = locale === "en" ? ARTICLE_TEST_EN[slug] ?? ARTICLE_TEST_EN[sectionKey] : null;
  const title = en?.title ?? article?.title ?? t(meta.titleKey);
  const excerpt = en?.excerpt ?? article?.excerpt;
  const body = en?.body ?? article?.body;

  return (
    <PublicLayout>
      <PageHeader
        crumbs={[{ label: locale === "en" ? "Home" : "Strona główna", href: "/" }, { label: t(meta.titleKey) }]}
        title={title}
        description={excerpt}
      />
      <div className="container py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <article className="lg:col-span-3 bg-white border border-border p-6 md:p-12">
          {isLoading ? (
            <p className="text-muted-foreground">…</p>
          ) : body ? (
            <div className="whitespace-pre-wrap text-[15px] leading-[1.75] text-foreground/85 max-w-[68ch]">{body}</div>
          ) : (
            <p className="text-muted-foreground">{t("product.missing")}</p>
          )}
        </article>
        <aside>
          <Link href="/oferta">
            <Button className="w-full h-11">{t("nav.catalog")}</Button>
          </Link>
        </aside>
      </div>
    </PublicLayout>
  );
}

