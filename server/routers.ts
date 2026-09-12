import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { sdk } from "./_core/sdk";
import { verifyPassword } from "./password";
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  getProducts,
  getFeaturedProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createInquiry,
  getInquiries,
  getInquiryById,
  getInquiryItems,
  updateInquiryStatus,
  createContactMessage,
  getContactMessages,
  markContactMessageRead,
  getUserByEmail,
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  getUsedMachines,
  createUsedMachine,
  updateUsedMachine,
  deleteUsedMachine,
} from "./db";
import { notifyOwner } from "./_core/notification";

/**
 * The inquiry or message is already persisted by the time the owner is notified,
 * so an unconfigured or unreachable notification service must not turn a
 * successful submission into an error for the customer.
 */
async function notifyOwnerSafely(payload: { title: string; content: string }) {
  try {
    await notifyOwner(payload);
  } catch (error) {
    console.warn("[Notification] Nie udało się powiadomić właściciela:", error);
  }
}

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

const productFields = {
  categoryId: z.number(),
  name: z.string().min(1),
  slug: z.string().min(1),
  referenceNumber: z.string().optional().nullable(),
  orderNumber: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  specifications: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  sketchUrl: z.string().optional().nullable(),
  groupName: z.string().optional().nullable(),
  price: z.string().optional().nullable(),
  unit: z.string().optional(),
  inStock: z.boolean().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().optional(),
};

const categoriesRouter = router({
  list: publicProcedure.query(() => getCategories()),
  bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => getCategoryBySlug(input.slug)),
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        sortOrder: z.number().optional(),
      })
    )
    .mutation(({ input }) => createCategory(input)),
  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        sortOrder: z.number().optional(),
      })
    )
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return updateCategory(id, data);
    }),
  delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => deleteCategory(input.id)),
});

const productsRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          categorySlug: z.string().optional(),
          search: z.string().optional(),
          limit: z.number().optional(),
          offset: z.number().optional(),
        })
        .optional()
    )
    .query(({ input }) => getProducts(input)),
  featured: publicProcedure.query(() => getFeaturedProducts()),
  bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => getProductBySlug(input.slug)),
  byId: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) => getProductById(input.id)),
  create: adminProcedure.input(z.object(productFields)).mutation(({ input }) => createProduct(input as any)),
  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        categoryId: z.number().optional(),
        name: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        referenceNumber: z.string().optional().nullable(),
        orderNumber: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
        specifications: z.string().optional().nullable(),
        imageUrl: z.string().optional().nullable(),
        sketchUrl: z.string().optional().nullable(),
        groupName: z.string().optional().nullable(),
        price: z.string().optional().nullable(),
        unit: z.string().optional(),
        inStock: z.boolean().optional(),
        featured: z.boolean().optional(),
        sortOrder: z.number().optional(),
      })
    )
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return updateProduct(id, data as any);
    }),
  delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => deleteProduct(input.id)),
});

const inquiriesRouter = router({
  create: publicProcedure
    .input(
      z.object({
        companyName: z.string().min(1),
        nip: z.string().optional(),
        contactName: z.string().min(1),
        contactEmail: z.string().email(),
        contactPhone: z.string().optional(),
        notes: z.string().optional(),
        items: z
          .array(
            z.object({
              productId: z.number().nullable().optional(),
              productName: z.string().min(1),
              referenceNumber: z.string().optional().nullable(),
              quantity: z.number().min(1),
              note: z.string().optional().nullable(),
            })
          )
          .min(1),
      })
    )
    .mutation(async ({ input }) => {
      const inquiryNumber = `ZP-${Date.now()}-${nanoid(5).toUpperCase()}`;
      const { items, ...rest } = input;
      const inquiry = await createInquiry(
        { ...rest, inquiryNumber, status: "new" },
        items.map((item) => ({
          productId: item.productId ?? null,
          productName: item.productName,
          referenceNumber: item.referenceNumber ?? null,
          quantity: item.quantity,
          note: item.note ?? null,
        }))
      );
      await notifyOwnerSafely({
        title: `Nowe zapytanie ofertowe ${inquiryNumber}`,
        content: `Od: ${rest.companyName} (${rest.contactEmail})\nPozycji: ${items.length}`,
      });
      return inquiry;
    }),
  list: adminProcedure.query(() => getInquiries()),
  detail: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const inquiry = await getInquiryById(input.id);
    if (!inquiry) throw new TRPCError({ code: "NOT_FOUND" });
    const items = await getInquiryItems(inquiry.id);
    return { ...inquiry, items };
  }),
  updateStatus: adminProcedure
    .input(z.object({ id: z.number(), status: z.enum(["new", "in_progress", "closed"]) }))
    .mutation(({ input }) => updateInquiryStatus(input.id, input.status)),
});

const contactRouter = router({
  send: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        companyName: z.string().optional(),
        subject: z.string().optional(),
        message: z.string().min(10),
      })
    )
    .mutation(async ({ input }) => {
      await createContactMessage(input);
      await notifyOwnerSafely({
        title: `Nowa wiadomość kontaktowa od ${input.name}`,
        content: `Od: ${input.email}\nFirma: ${input.companyName ?? "-"}\nTemat: ${input.subject ?? "-"}\n\n${input.message}`,
      });
      return { success: true };
    }),
  list: adminProcedure.query(() => getContactMessages()),
  markRead: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => markContactMessageRead(input.id)),
});

const articleSection = z.enum(["technologia", "optyka", "nowosc", "oprogramowanie", "strona"]);

const articlesRouter = router({
  list: publicProcedure
    .input(z.object({ section: articleSection.optional(), publishedOnly: z.boolean().optional() }).optional())
    .query(({ input }) => getArticles({ ...input, publishedOnly: input?.publishedOnly ?? true })),
  adminList: adminProcedure.query(() => getArticles()),
  bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => getArticleBySlug(input.slug)),
  bySection: publicProcedure.input(z.object({ section: articleSection })).query(async ({ input }) => {
    const list = await getArticles({ section: input.section, publishedOnly: true });
    return list;
  }),
  create: adminProcedure
    .input(
      z.object({
        slug: z.string().min(1),
        title: z.string().min(1),
        excerpt: z.string().optional().nullable(),
        body: z.string().min(1),
        section: articleSection,
        published: z.boolean().optional(),
        sortOrder: z.number().optional(),
      })
    )
    .mutation(({ input }) => createArticle(input)),
  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        slug: z.string().min(1).optional(),
        title: z.string().min(1).optional(),
        excerpt: z.string().optional().nullable(),
        body: z.string().optional(),
        section: articleSection.optional(),
        published: z.boolean().optional(),
        sortOrder: z.number().optional(),
      })
    )
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return updateArticle(id, data);
    }),
  delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => deleteArticle(input.id)),
});

const machinesRouter = router({
  list: publicProcedure.query(() => getUsedMachines(true)),
  adminList: adminProcedure.query(() => getUsedMachines(false)),
  create: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional().nullable(),
        imageUrl: z.string().optional().nullable(),
        contactNote: z.string().optional().nullable(),
        active: z.boolean().optional(),
        sortOrder: z.number().optional(),
      })
    )
    .mutation(({ input }) => createUsedMachine(input)),
  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        description: z.string().optional().nullable(),
        imageUrl: z.string().optional().nullable(),
        contactNote: z.string().optional().nullable(),
        active: z.boolean().optional(),
        sortOrder: z.number().optional(),
      })
    )
    .mutation(({ input }) => {
      const { id, ...data } = input;
      return updateUsedMachine(id, data);
    }),
  delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => deleteUsedMachine(input.id)),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    login: publicProcedure
      .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        const user = await getUserByEmail(input.email);
        if (!user?.passwordHash) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Nieprawidłowy e-mail lub hasło" });
        }
        const ok = await verifyPassword(input.password, user.passwordHash);
        if (!ok) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Nieprawidłowy e-mail lub hasło" });
        }
        const token = await sdk.createSessionToken(user.openId, { name: user.name ?? "" });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });
        return { success: true as const };
      }),
  }),
  categories: categoriesRouter,
  products: productsRouter,
  inquiries: inquiriesRouter,
  contact: contactRouter,
  articles: articlesRouter,
  machines: machinesRouter,
});

export type AppRouter = typeof appRouter;
