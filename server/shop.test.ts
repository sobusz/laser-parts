import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

vi.mock("./db", () => ({
  getCategories: vi.fn().mockResolvedValue([
    { id: 1, name: "Trumpf", slug: "trumpf", description: "Parts for Trumpf", imageUrl: null, sortOrder: 0, createdAt: new Date() },
  ]),
  getCategoryBySlug: vi.fn().mockImplementation((slug: string) => {
    if (slug === "trumpf") return Promise.resolve({ id: 1, name: "Trumpf", slug: "trumpf", description: null, imageUrl: null, sortOrder: 0, createdAt: new Date() });
    return Promise.resolve(undefined);
  }),
  createCategory: vi.fn().mockResolvedValue(undefined),
  updateCategory: vi.fn().mockResolvedValue(undefined),
  deleteCategory: vi.fn().mockResolvedValue(undefined),
  getProducts: vi.fn().mockResolvedValue([
    { id: 1, categoryId: 1, name: "Dysza 1.0mm", slug: "dysza-1-0mm", referenceNumber: "0700-000-001", orderNumber: null, groupName: "Dysze", description: null, specifications: null, imageUrl: null, sketchUrl: null, price: "45.00", unit: "szt.", inStock: true, featured: true, sortOrder: 0, createdAt: new Date(), updatedAt: new Date() },
  ]),
  getFeaturedProducts: vi.fn().mockResolvedValue([
    { id: 1, categoryId: 1, name: "Dysza 1.0mm", slug: "dysza-1-0mm", referenceNumber: "0700-000-001", featured: true },
  ]),
  getProductBySlug: vi.fn().mockImplementation((slug: string) => {
    if (slug === "dysza-1-0mm") return Promise.resolve({ id: 1, categoryId: 1, name: "Dysza 1.0mm", slug: "dysza-1-0mm", referenceNumber: "0700-000-001", price: "45.00", unit: "szt." });
    return Promise.resolve(undefined);
  }),
  getProductById: vi.fn().mockResolvedValue(undefined),
  createProduct: vi.fn().mockResolvedValue(undefined),
  updateProduct: vi.fn().mockResolvedValue(undefined),
  deleteProduct: vi.fn().mockResolvedValue(undefined),
  createInquiry: vi.fn().mockResolvedValue({ id: 1, inquiryNumber: "ZP-TEST-001", status: "new", companyName: "Test Sp. z o.o.", contactName: "Jan Test", contactEmail: "jan@test.pl" }),
  getInquiries: vi.fn().mockResolvedValue([]),
  getInquiryById: vi.fn().mockResolvedValue(undefined),
  getInquiryItems: vi.fn().mockResolvedValue([]),
  updateInquiryStatus: vi.fn().mockResolvedValue(undefined),
  createContactMessage: vi.fn().mockResolvedValue(undefined),
  getContactMessages: vi.fn().mockResolvedValue([]),
  markContactMessageRead: vi.fn().mockResolvedValue(undefined),
  getUserByEmail: vi.fn().mockResolvedValue(undefined),
  getArticles: vi.fn().mockResolvedValue([]),
  getArticleBySlug: vi.fn().mockResolvedValue(undefined),
  createArticle: vi.fn().mockResolvedValue(undefined),
  updateArticle: vi.fn().mockResolvedValue(undefined),
  deleteArticle: vi.fn().mockResolvedValue(undefined),
  getUsedMachines: vi.fn().mockResolvedValue([]),
  getUsedMachineBySlug: vi.fn().mockImplementation((slug: string) => {
    if (slug === "trumatic-l3030") {
      return Promise.resolve({
        id: 1,
        title: "TRUMATIC L3030 (używana)",
        slug: "trumatic-l3030",
        description: "Urządzenie używane.",
        imageUrl: null,
        contactNote: "laser-parts@laser-parts.pl",
        active: true,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return Promise.resolve(undefined);
  }),
  createUsedMachine: vi.fn().mockResolvedValue(undefined),
  updateUsedMachine: vi.fn().mockResolvedValue(undefined),
  deleteUsedMachine: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

vi.mock("./password", () => ({
  verifyPassword: vi.fn(),
  hashPassword: vi.fn(),
}));

function createPublicCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as any,
    res: { clearCookie: vi.fn(), cookie: vi.fn() } as any,
  };
}

function createAdminCtx(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-open-id",
      email: "admin@laser-parts.pl",
      name: "Admin",
      loginMethod: "password",
      passwordHash: "x",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as any,
    res: { clearCookie: vi.fn(), cookie: vi.fn() } as any,
  };
}

describe("categories router", () => {
  it("list returns categories for public users", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    const result = await caller.categories.list();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Trumpf");
  });

  it("create requires admin role", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    await expect(caller.categories.create({ name: "Test", slug: "test" })).rejects.toThrow();
  });

  it("create succeeds for admin", async () => {
    const caller = appRouter.createCaller(createAdminCtx());
    await expect(caller.categories.create({ name: "Test", slug: "test" })).resolves.not.toThrow();
  });
});

describe("products router", () => {
  it("list returns products for public users", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    const result = await caller.products.list();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Dysza 1.0mm");
  });

  it("bySlug returns product when found", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    const result = await caller.products.bySlug({ slug: "dysza-1-0mm" });
    expect(result?.referenceNumber).toBe("0700-000-001");
  });

  it("delete requires admin role", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    await expect(caller.products.delete({ id: 1 })).rejects.toThrow();
  });
});

describe("inquiries router", () => {
  it("creates an inquiry for public users", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    const result = await caller.inquiries.create({
      companyName: "Test Sp. z o.o.",
      contactName: "Jan Test",
      contactEmail: "jan@test.pl",
      items: [{ productId: 1, productName: "Dysza 1.0mm", quantity: 2 }],
    });
    expect(result.inquiryNumber).toBe("ZP-TEST-001");
  });

  it("list requires admin role", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    await expect(caller.inquiries.list()).rejects.toThrow();
  });
});

describe("machines router", () => {
  it("bySlug returns an active listing", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    const result = await caller.machines.bySlug({ slug: "trumatic-l3030" });
    expect(result?.title).toBe("TRUMATIC L3030 (używana)");
  });
});

describe("contact router", () => {
  it("send creates a contact message", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    const result = await caller.contact.send({
      name: "Jan Kowalski",
      email: "jan@firma.pl",
      message: "Zapytanie o dysze do Trumpf TruLaser 3030",
    });
    expect(result.success).toBe(true);
  });

  it("list requires admin role", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    await expect(caller.contact.list()).rejects.toThrow();
  });
});

describe("auth router", () => {
  it("me returns null for unauthenticated users", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("me returns user for authenticated users", async () => {
    const caller = appRouter.createCaller(createAdminCtx());
    const result = await caller.auth.me();
    expect(result?.role).toBe("admin");
  });
});
