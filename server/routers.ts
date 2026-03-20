import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import Stripe from "stripe";
import { getStripe } from "./stripe";
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
  createOrder,
  getOrders,
  getOrderByNumber,
  getOrderById,
  getOrderItems,
  updateOrderStatus,
  createContactMessage,
  getContactMessages,
  markContactMessageRead,
} from "./db";
import { notifyOwner } from "./_core/notification";

// ─── Admin guard ──────────────────────────────────────────────────────────────
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

// ─── Categories router ────────────────────────────────────────────────────────
const categoriesRouter = router({
  list: publicProcedure.query(() => getCategories()),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ input }) => getCategoryBySlug(input.slug)),

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

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteCategory(input.id)),
});

// ─── Products router ──────────────────────────────────────────────────────────
const productsRouter = router({
  list: publicProcedure
    .input(
      z.object({
        categorySlug: z.string().optional(),
        search: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
      }).optional()
    )
    .query(({ input }) => getProducts(input)),

  featured: publicProcedure.query(() => getFeaturedProducts()),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ input }) => getProductBySlug(input.slug)),

  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => getProductById(input.id)),

  create: adminProcedure
    .input(
      z.object({
        categoryId: z.number(),
        name: z.string().min(1),
        slug: z.string().min(1),
        referenceNumber: z.string().optional(),
        description: z.string().optional(),
        specifications: z.string().optional(),
        imageUrl: z.string().optional(),
        price: z.string().optional(),
        unit: z.string().optional(),
        inStock: z.boolean().optional(),
        featured: z.boolean().optional(),
        sortOrder: z.number().optional(),
      })
    )
    .mutation(({ input }) => createProduct(input as any)),

  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        categoryId: z.number().optional(),
        name: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        referenceNumber: z.string().optional(),
        description: z.string().optional(),
        specifications: z.string().optional(),
        imageUrl: z.string().optional(),
        price: z.string().optional(),
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

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteProduct(input.id)),
});

// ─── Orders router ────────────────────────────────────────────────────────────
const ordersRouter = router({
  create: publicProcedure
    .input(
      z.object({
        companyName: z.string().min(1),
        nip: z.string().min(1),
        contactName: z.string().min(1),
        contactEmail: z.string().email(),
        contactPhone: z.string().optional(),
        addressStreet: z.string().min(1),
        addressCity: z.string().min(1),
        addressPostal: z.string().min(1),
        notes: z.string().optional(),
        items: z.array(
          z.object({
            productId: z.number(),
            productName: z.string(),
            referenceNumber: z.string().optional(),
            quantity: z.number().min(1),
            unitPrice: z.string(),
            totalPrice: z.string(),
          })
        ),
        totalAmount: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const orderNumber = `LP-${Date.now()}-${nanoid(6).toUpperCase()}`;
      const { items, ...orderData } = input;
      const order = await createOrder(
        { ...orderData, orderNumber, status: "pending" },
        items.map((item) => ({
          ...item,
          orderId: 0, // will be replaced in createOrder
          referenceNumber: item.referenceNumber ?? null,
        }))
      );
      await notifyOwner({
        title: `Nowe zamówienie ${orderNumber}`,
        content: `Zamówienie od ${orderData.companyName} (${orderData.contactEmail}) na kwotę ${orderData.totalAmount} zł.`,
      });
      return order;
    }),

  byNumber: publicProcedure
    .input(z.object({ orderNumber: z.string() }))
    .query(async ({ input }) => {
      const order = await getOrderByNumber(input.orderNumber);
      if (!order) throw new TRPCError({ code: "NOT_FOUND" });
      const items = await getOrderItems(order.id);
      return { ...order, items };
    }),

  list: adminProcedure.query(() => getOrders()),

  detail: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const order = await getOrderById(input.id);
      if (!order) throw new TRPCError({ code: "NOT_FOUND" });
      const items = await getOrderItems(order.id);
      return { ...order, items };
    }),

  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "paid", "processing", "shipped", "delivered", "cancelled"]),
      })
    )
    .mutation(({ input }) => updateOrderStatus(input.id, input.status)),

  // Called by Stripe webhook to mark order as paid
  markPaid: publicProcedure
    .input(
      z.object({
        orderNumber: z.string(),
        stripeSessionId: z.string(),
        stripePaymentIntentId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const order = await getOrderByNumber(input.orderNumber);
      if (!order) throw new TRPCError({ code: "NOT_FOUND" });
      await updateOrderStatus(order.id, "paid", {
        sessionId: input.stripeSessionId,
        paymentIntentId: input.stripePaymentIntentId,
      });
      return { success: true };
    }),
});

// ─── Contact router ───────────────────────────────────────────────────────────
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
      await notifyOwner({
        title: `Nowa wiadomość kontaktowa od ${input.name}`,
        content: `Od: ${input.email}\nFirma: ${input.companyName ?? "-"}\nTemat: ${input.subject ?? "-"}\n\n${input.message}`,
      });
      return { success: true };
    }),

  list: adminProcedure.query(() => getContactMessages()),

  markRead: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => markContactMessageRead(input.id)),
});

// ─── Stripe router ──────────────────────────────────────────────────────────
const stripeRouter = router({
  createCheckoutSession: publicProcedure
    .input(
      z.object({
        orderNumber: z.string(),
        customerEmail: z.string().email(),
        customerName: z.string().optional(),
        items: z.array(
          z.object({
            name: z.string(),
            referenceNumber: z.string().optional(),
            quantity: z.number().min(1),
            unitPrice: z.number().min(1), // in grosze
          })
        ),
        origin: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: input.customerEmail,
        client_reference_id: input.orderNumber,
        metadata: {
          orderNumber: input.orderNumber,
          customerName: input.customerName ?? "",
          customerEmail: input.customerEmail,
        },
        line_items: input.items.map((item) => ({
          price_data: {
            currency: "pln",
            product_data: {
              name: item.name,
              description: item.referenceNumber ? `Ref: ${item.referenceNumber}` : undefined,
            },
            unit_amount: item.unitPrice,
          },
          quantity: item.quantity,
        })),
        allow_promotion_codes: true,
        success_url: `${input.origin}/zamowienie-potwierdzenie?nr=${input.orderNumber}&paid=true`,
        cancel_url: `${input.origin}/zamowienie?cancelled=true`,
      });
      return { url: session.url! };
    }),
});

// ─── App router ───────────────────────────────────────────────────────────────
export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  categories: categoriesRouter,
  products: productsRouter,
  orders: ordersRouter,
  contact: contactRouter,
  stripe: stripeRouter,
});

export type AppRouter = typeof appRouter;

