import type { TRPCLink } from "@trpc/client";
import { TRPCClientError } from "@trpc/client";
import { observable } from "@trpc/server/observable";
import type { AppRouter } from "../../../server/routers";
import {
  filterProducts,
  previewArticles,
  previewCategories,
  previewMachines,
  previewProducts,
} from "./mock-data";

function resolve(path: string, input: unknown): unknown {
  switch (path) {
    case "system.health":
      return { ok: true };
    case "auth.me":
      return null;
    case "auth.logout":
      return { success: true };
    case "auth.login":
      throw new TRPCClientError("Podgląd statyczny — logowanie do panelu jest wyłączone.");
    case "categories.list":
      return previewCategories;
    case "categories.bySlug": {
      const slug = (input as { slug: string }).slug;
      return previewCategories.find((c) => c.slug === slug);
    }
    case "products.list":
      return filterProducts(input as Parameters<typeof filterProducts>[0]);
    case "products.featured":
      return previewProducts.filter((p) => p.featured);
    case "products.bySlug": {
      const slug = (input as { slug: string }).slug;
      return previewProducts.find((p) => p.slug === slug) ?? null;
    }
    case "products.byId": {
      const id = (input as { id: number }).id;
      return previewProducts.find((p) => p.id === id) ?? null;
    }
    case "articles.list":
    case "articles.adminList": {
      const section = (input as { section?: string } | undefined)?.section;
      return section ? previewArticles.filter((a) => a.section === section) : previewArticles;
    }
    case "articles.bySlug": {
      const slug = (input as { slug: string }).slug;
      return previewArticles.find((a) => a.slug === slug) ?? null;
    }
    case "articles.bySection": {
      const section = (input as { section: string }).section;
      return previewArticles.filter((a) => a.section === section);
    }
    case "machines.list":
    case "machines.adminList":
      return previewMachines;
    case "inquiries.create":
      return { id: 1, inquiryNumber: `ZP-PODGLAD-${Date.now().toString().slice(-6)}` };
    case "contact.send":
      return { success: true };
    default:
      throw new TRPCClientError("Ta funkcja jest niedostępna w podglądzie.");
  }
}

export const previewLink: TRPCLink<AppRouter> = () => {
  return ({ op }) =>
    observable((observer) => {
      try {
        const data = resolve(op.path, op.input);
        observer.next({ result: { type: "data", data } });
        observer.complete();
      } catch (error) {
        observer.error(error instanceof TRPCClientError ? error : new TRPCClientError(String(error)));
      }
    });
};

export const isPreview = import.meta.env.VITE_PREVIEW === "true";
