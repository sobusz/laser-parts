import { eq, desc, and, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  categories,
  products,
  contactMessages,
  inquiries,
  inquiryItems,
  articles,
  usedMachines,
  type InsertProduct,
  type InsertCategory,
  type InsertContactMessage,
  type InsertInquiry,
  type InsertInquiryItem,
  type InsertArticle,
  type InsertUsedMachine,
  type Inquiry,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod", "passwordHash"] as const;

  for (const field of textFields) {
    const value = user[field];
    if (value === undefined) continue;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  }

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }

  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0];
}

export async function getCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(categories).orderBy(categories.sortOrder, categories.name);
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result[0];
}

export async function createCategory(data: InsertCategory) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(categories).values(data);
}

export async function updateCategory(id: number, data: Partial<InsertCategory>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(categories).set(data).where(eq(categories.id, id));
}

export async function deleteCategory(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(categories).where(eq(categories.id, id));
}

export async function getProducts(opts?: {
  categorySlug?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];

  if (opts?.categorySlug) {
    const cat = await getCategoryBySlug(opts.categorySlug);
    if (cat) conditions.push(eq(products.categoryId, cat.id));
    else return [];
  }

  if (opts?.search) {
    conditions.push(
      or(
        like(products.name, `%${opts.search}%`),
        like(products.referenceNumber, `%${opts.search}%`),
        like(products.orderNumber, `%${opts.search}%`)
      )
    );
  }

  if (opts?.featured !== undefined) {
    conditions.push(eq(products.featured, opts.featured));
  }

  return db
    .select()
    .from(products)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(products.sortOrder, products.groupName, products.name)
    .limit(opts?.limit ?? 500)
    .offset(opts?.offset ?? 0);
}

export async function getFeaturedProducts() {
  return getProducts({ featured: true, limit: 8 });
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return result[0];
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result[0];
}

export async function createProduct(data: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(products).values(data);
}

export async function updateProduct(id: number, data: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(products).set(data).where(eq(products.id, id));
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(products).where(eq(products.id, id));
}

export async function createInquiry(data: InsertInquiry, items: Omit<InsertInquiryItem, "inquiryId">[]) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(inquiries).values(data);
  const [created] = await db
    .select()
    .from(inquiries)
    .where(eq(inquiries.inquiryNumber, data.inquiryNumber))
    .limit(1);
  if (!created) throw new Error("Inquiry creation failed");
  if (items.length > 0) {
    await db.insert(inquiryItems).values(items.map((item) => ({ ...item, inquiryId: created.id })));
  }
  return created;
}

export async function getInquiries() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
}

export async function getInquiryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(inquiries).where(eq(inquiries.id, id)).limit(1);
  return result[0];
}

export async function getInquiryItems(inquiryId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(inquiryItems).where(eq(inquiryItems.inquiryId, inquiryId));
}

export async function updateInquiryStatus(id: number, status: Inquiry["status"]) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(inquiries).set({ status }).where(eq(inquiries.id, id));
}

export async function createContactMessage(data: InsertContactMessage) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(contactMessages).values(data);
}

export async function getContactMessages() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

export async function markContactMessageRead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(contactMessages).set({ read: true }).where(eq(contactMessages.id, id));
}

export async function getArticles(opts?: { section?: InsertArticle["section"]; publishedOnly?: boolean }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (opts?.section) conditions.push(eq(articles.section, opts.section));
  if (opts?.publishedOnly) conditions.push(eq(articles.published, true));
  return db
    .select()
    .from(articles)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(articles.sortOrder, articles.title);
}

export async function getArticleBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
  return result[0];
}

export async function createArticle(data: InsertArticle) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(articles).values(data);
}

export async function updateArticle(id: number, data: Partial<InsertArticle>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(articles).set(data).where(eq(articles.id, id));
}

export async function deleteArticle(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(articles).where(eq(articles.id, id));
}

export async function getUsedMachines(activeOnly = false) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(usedMachines)
    .where(activeOnly ? eq(usedMachines.active, true) : undefined)
    .orderBy(usedMachines.sortOrder, usedMachines.title);
}

export async function getUsedMachineBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(usedMachines).where(eq(usedMachines.slug, slug)).limit(1);
  return result[0];
}

export async function createUsedMachine(data: InsertUsedMachine) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(usedMachines).values(data);
}

export async function updateUsedMachine(id: number, data: Partial<InsertUsedMachine>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(usedMachines).set(data).where(eq(usedMachines.id, id));
}

export async function deleteUsedMachine(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(usedMachines).where(eq(usedMachines.id, id));
}
