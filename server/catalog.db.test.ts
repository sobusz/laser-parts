/**
 * Integration coverage for the path the admin panel actually uses.
 *
 * Unlike shop.test.ts, this file does not mock ./db, so every assertion below
 * travels through the tRPC routers into the MySQL instance named by
 * DATABASE_URL. It only ever touches a product it creates itself, identified by
 * a timestamped slug, and removes it again afterwards.
 */
import "dotenv/config";
import { afterAll, describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { deleteProduct, getProductBySlug } from "./db";

const SLUG = `integration-test-${Date.now()}`;

function baseCtx() {
  return {
    req: { protocol: "https", headers: {} } as any,
    res: { clearCookie: () => {}, cookie: () => {} } as any,
  };
}

function publicCtx(): TrpcContext {
  return { ...baseCtx(), user: null };
}

function adminCtx(): TrpcContext {
  return {
    ...baseCtx(),
    user: {
      id: 1,
      openId: "integration-test-admin",
      email: "admin@laser-parts.pl",
      name: "Admin",
      loginMethod: "password",
      passwordHash: "unused",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
  };
}

const admin = appRouter.createCaller(adminCtx());
const anon = appRouter.createCaller(publicCtx());

describe.skipIf(!process.env.DATABASE_URL)("admin writes reach the database", () => {
  afterAll(async () => {
    const leftover = await getProductBySlug(SLUG);
    if (leftover) await deleteProduct(leftover.id);
  });

  it("serves the seeded catalog to anonymous visitors", async () => {
    const categories = await anon.categories.list();
    expect(categories.length).toBeGreaterThan(0);

    const products = await anon.products.list();
    expect(products.length).toBeGreaterThan(0);
  });

  it("refuses writes from visitors who are not signed in as admin", async () => {
    const [category] = await anon.categories.list();
    await expect(
      anon.products.create({ categoryId: category.id, name: "Nie powinno powstać", slug: SLUG }),
    ).rejects.toThrow();
    expect(await getProductBySlug(SLUG)).toBeUndefined();
  });

  it("persists an admin create so the public catalog can read it back", async () => {
    const [category] = await anon.categories.list();
    await admin.products.create({
      categoryId: category.id,
      name: "Pozycja testowa",
      slug: SLUG,
      referenceNumber: "TEST-0001",
      price: "199.99",
    });

    const created = await anon.products.bySlug({ slug: SLUG });
    expect(created?.name).toBe("Pozycja testowa");
    expect(created?.price).toBe("199.99");
  });

  it("persists an admin edit", async () => {
    const created = await anon.products.bySlug({ slug: SLUG });
    await admin.products.update({ id: created!.id, name: "Pozycja testowa po edycji", price: "249.50" });

    const updated = await anon.products.bySlug({ slug: SLUG });
    expect(updated?.name).toBe("Pozycja testowa po edycji");
    expect(updated?.price).toBe("249.50");
  });

  it("persists an admin delete", async () => {
    const existing = await anon.products.bySlug({ slug: SLUG });
    await admin.products.delete({ id: existing!.id });
    expect(await anon.products.bySlug({ slug: SLUG })).toBeUndefined();
  });
});
