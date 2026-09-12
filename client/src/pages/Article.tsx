import { Link, useParams } from "wouter";
import PublicLayout from "@/components/PublicLayout";
import PageHeader from "@/components/PageHeader";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";

const SECTION_META: Record<string, { title: string; fallbackSlug: string }> = {
  optyka: { title: "Optyka", fallbackSlug: "optyka" },
  nowosc: { title: "Nowość", fallbackSlug: "nowosc" },
  oprogramowanie: { title: "Oprogramowanie", fallbackSlug: "oprogramowanie" },
  technologia: { title: "Technologia", fallbackSlug: "technologia" },
};

export default function ArticlePage({ section }: { section?: string }) {
  const params = useParams<{ slug?: string }>();
  const sectionKey = section ?? "technologia";
  const meta = SECTION_META[sectionKey] ?? SECTION_META.technologia;
  const slug = params.slug ?? meta.fallbackSlug;

  const { data: article, isLoading } = trpc.articles.bySlug.useQuery({ slug });
  const { data: related } = trpc.articles.bySection.useQuery({ section: sectionKey as any });

  return (
    <PublicLayout>
      <PageHeader
        crumbs={[{ label: "Strona główna", href: "/" }, { label: meta.title }]}
        title={article?.title ?? meta.title}
        description={article?.excerpt}
      />
      <div className="tech-grid">
        <div className="container py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <article className="lg:col-span-3 bg-white border border-border p-6 md:p-12">
            {isLoading ? (
              <p className="text-muted-foreground">Ładowanie…</p>
            ) : article ? (
              <div className="whitespace-pre-wrap text-[15px] leading-[1.75] text-foreground/85 max-w-[68ch]">
                {article.body}
              </div>
            ) : (
              <p className="text-muted-foreground">Brak treści. Uzupełnij artykuł w panelu administracyjnym.</p>
            )}
          </article>
          <aside className="space-y-4">
            {related && related.length > 1 && (
              <div className="bg-white border border-border">
                <h2 className="eyebrow text-muted-foreground px-4 py-3 border-b border-border">W tej sekcji</h2>
                <ul className="divide-y divide-border">
                  {related.map((a) => (
                    <li key={a.id}>
                      <Link
                        href={`/${sectionKey}/${a.slug}`}
                        className="block px-4 py-2.5 text-sm hover:bg-muted border-l-2 border-transparent hover:border-primary transition-colors"
                      >
                        {a.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="bg-secondary text-white p-5">
              <div className="h-1 w-12 bg-primary mb-4" />
              <p className="font-semibold mb-2">Szukasz konkretnej części?</p>
              <p className="text-xs text-white/60 mb-4 leading-relaxed">
                Katalog z numerami referencyjnymi dla Trumpf, Bystronic, Mazak i LVD.
              </p>
              <Link href="/oferta">
                <Button size="sm" className="w-full uppercase tracking-[0.08em] text-[12px]">
                  Zobacz ofertę
                </Button>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </PublicLayout>
  );
}
