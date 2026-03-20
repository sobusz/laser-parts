import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the db module so tests don't need a real database
vi.mock("./db", () => ({
  getCategories: vi.fn().mockResolvedValue([
    { id: 1, name: "Trumpf", slug: "trumpf", description: "Parts for Trumpf", imageUrl: null, sortOrder: 0, createdAt: new Date(), updatedAt: new Date() },
  ]),
  getCategoryBySlug: vi.fn().mockImplementation((slug: string) => {
    if (slug === "trumpf") return Promise.resolve({ id: 1, name: "Trumpf", slug: "trumpf", description: null, imageUrl: null, sortOrder: 0, createdAt: new Date(), updatedAt: new Date() });
    return Promise.resolve(undefined);
  }),
  createCategory: vi.fn().mockResolvedValue(undefined),
  updateCategory: vi.fn().mockResolvedValue(undefined),
  deleteCategory: vi.fn().mockResolvedValue(undefined),
  getProducts: vi.fn().mockResolvedValue([
    { id: 1, categoryId: 1, name: "Dysza 1.0mm", slug: "dysza-1-0mm", referenceNumber: "0700-000-001", description: null, specifications: null, imageUrl: null, price: "45.00", unit: "szt.", inStock: true, featured: true, sortOrder: 0, createdAt: new Date(), updatedAt: new Date() },
  ]),
  getFeaturedProducts: vi.fn().mockResolvedValue([
    { id: 1, categoryId: 1, name: "Dysza 1.0mm", slug: "dysza-1-0mm", referenceNumber: "0700-000-001", description: null, specifications: null, imageUrl: null, price: "45.00", unit: "szt.", inStock: true, featured: true, sortOrder: 0, createdAt: new Date(), updatedAt: new Date() },
  ]),
  getProductBySlug: vi.fn().mockImplementation((slug: string) => {
    if (slug === "dysza-1-0mm") return Promise.resolve({ id: 1, categoryId: 1, name: "Dysza 1.0mm", slug: "dysza-1-0mm", referenceNumber: "0700-000-001", description: null, specifications: null, imageUrl: null, price: "45.00", unit: "szt.", inStock: true, featured: true, sortOrder: 0, createdAt: new Date(), updatedAt: new Date() });
    return Promise.resolve(undefined);
  }),
  getProductById: vi.fn().mockResolvedValue(undefined),
  createProduct: vi.fn().mockResolvedValue(undefined),
  updateProduct: vi.fn().mockResolvedValue(undefined),
  deleteProduct: vi.fn().mockResolvedValue(undefined),
  createOrder: vi.fn().mockResolvedValue({ id: 1, orderNumber: "LP-TEST-001", status: "pending", companyName: "Test Sp. z o.o.", nip: "1234567890", contactName: "Jan Test", contactEmail: "jan@test.pl", contactPhone: null, addressStreet: "ul. Testowa 1", addressCity: "Warszawa", addressPostal: "00-001", notes: null, totalAmount: "45.00", stripePaymentIntentId: null, stripeSessionId: null, createdAt: new Date(), updatedAt: new Date() }),
  getOrders: vi.fn().mockResolvedValue([]),
  getOrderByNumber: vi.fn().mockResolvedValue(undefined),
  getOrderById: vi.fn().mockResolvedValue(undefined),
  getOrderItems: vi.fn().mockResolvedValue([]),
  updateOrderStatus: vi.fn().mockResolvedValue(undefined),
  createContactMessage: vi.fn().mockResolvedValue(undefined),
  getContactMessages: vi.fn().mockResolvedValue([]),
  markContactMessageRead: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

function createPublicCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as any,
    res: { clearCookie: vi.fn() } as any,
  };
}

function createAdminCtx(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-open-id",
      email: "admin@laser-parts.pl",
      name: "Admin",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as any,
    res: { clearCookie: vi.fn() } as any,
  };
}

describe("categories router", () => {
  it("list returns categories for public users", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    const result = await caller.categories.list();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Trumpf");
  });

  it("bySlug returns category when found", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    const result = await caller.categories.bySlug({ slug: "trumpf" });
    expect(result?.name).toBe("Trumpf");
  });

  it("create requires admin role", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    await expect(
      caller.categories.create({ name: "Test", slug: "test" })
    ).rejects.toThrow();
  });

  it("create succeeds for admin", async () => {
    const caller = appRouter.createCaller(createAdminCtx());
    await expect(
      caller.categories.create({ name: "Test", slug: "test" })
    ).resolves.not.toThrow();
  });
});

describe("products router", () => {
  it("list returns products for public users", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    const result = await caller.products.list();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Dysza 1.0mm");
  });

  it("featured returns featured products", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    const result = await caller.products.featured();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].featured).toBe(true);
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

describe("orders router", () => {
  it("creates an order for public users", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    const result = await caller.orders.create({
      companyName: "Test Sp. z o.o.",
      nip: "1234567890",
      contactName: "Jan Test",
      contactEmail: "jan@test.pl",
      addressStreet: "ul. Testowa 1",
      addressCity: "Warszawa",
      addressPostal: "00-001",
      items: [
        {
          productId: 1,
          productName: "Dysza 1.0mm",
          quantity: 2,
          unitPrice: "45.00",
          totalPrice: "90.00",
        },
      ],
      totalAmount: "90.00",
    });
    expect(result.orderNumber).toBe("LP-TEST-001");
  });

  it("list requires admin role", async () => {
    const caller = appRouter.createCaller(createPublicCtx());
    await expect(caller.orders.list()).rejects.toThrow();
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
