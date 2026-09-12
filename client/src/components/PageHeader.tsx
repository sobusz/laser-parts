import { Link } from "wouter";
import { ReactNode } from "react";

export default function PageHeader({
  crumbs,
  title,
  description,
  meta,
}: {
  crumbs: { label: string; href?: string }[];
  title: string;
  description?: ReactNode;
  meta?: string;
}) {
  return (
    <div className="relative overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 tech-grid-dark" />
      <div className="container relative pt-10 pb-10 lg:pt-12 lg:pb-12">
        <nav aria-label="Ścieżka nawigacji" className="flex flex-wrap items-center gap-2 text-sm font-mono text-white/55 mb-6">
          {crumbs.map((c, i) => (
            <span key={`${c.label}-${i}`} className="flex items-center gap-2">
              {i > 0 && <span className="text-white/25">/</span>}
              {c.href ? (
                <Link href={c.href} className="underline underline-offset-4 decoration-white/30 hover:text-primary hover:decoration-primary transition-colors py-1">
                  {c.label}
                </Link>
              ) : (
                <span className="text-white" aria-current="page">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
        <div className="h-1 w-14 bg-primary mb-5" />
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight max-w-3xl text-white text-balance">{title}</h1>
            {description && (
              <div className="text-white/75 text-[17px] mt-4 max-w-[42rem] leading-relaxed text-pretty">{description}</div>
            )}
          </div>
          {meta && (
            <p className="font-mono text-sm text-primary whitespace-nowrap">{meta}</p>
          )}
        </div>
      </div>
    </div>
  );
}
