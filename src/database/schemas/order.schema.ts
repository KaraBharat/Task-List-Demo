import {
  pgTable,
  text,
  timestamp,
  integer,
  uuid,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  orderNo: text("order_no").notNull(),
  orderDate: timestamp("order_date").defaultNow().notNull(),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id),
  totalAmount: decimal("total_amount").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  isDeleted: boolean("is_deleted").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  deletedAt: timestamp("deleted_at"),
});

export const orderDetails = pgTable("order_details", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: decimal("price").notNull(),
  amount: decimal("amount").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  isDeleted: boolean("is_deleted").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  deletedAt: timestamp("deleted_at"),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  productName: text("product_name").notNull(),
  productCode: text("product_code").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  isDeleted: boolean("is_deleted").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  deletedAt: timestamp("deleted_at"),
});

export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  customerName: text("customer_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  isDeleted: boolean("is_deleted").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  deletedAt: timestamp("deleted_at"),
});

export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders, {
    relationName: "customerOrders",
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  orderDetails: many(orderDetails, {
    relationName: "orderToDetails",
  }),
  customer: one(customers, {
    relationName: "customerOrders",
    fields: [orders.customerId],
    references: [customers.id],
  }),
}));

export const productsRelations = relations(products, ({ many }) => ({
  orderDetails: many(orderDetails, {
    relationName: "productOrderDetails",
  }),
}));

export const orderDetailsRelations = relations(orderDetails, ({ one }) => ({
  order: one(orders, {
    relationName: "orderToDetails",
    fields: [orderDetails.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    relationName: "productOrderDetails",
    fields: [orderDetails.productId],
    references: [products.id],
  }),
}));

// Schema types
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderDetail = typeof orderDetails.$inferSelect;
export type NewOrderDetail = typeof orderDetails.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;

// Zod schemas for validation
export const insertOrderSchema = createInsertSchema(orders, {
  orderNo: z.string().min(1),
  customerId: z.string().uuid(),
  totalAmount: z.number().positive(),
});

export const updateOrderSchema = createSelectSchema(orders, {
  orderNo: z.string().min(1).optional(),
  customerId: z.string().uuid().optional(),
  totalAmount: z.number().positive().optional(),
});

export const insertOrderDetailSchema = createInsertSchema(orderDetails, {
  orderId: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().positive(),
  price: z.number().positive(),
  amount: z.number().positive(),
});

export const updateOrderDetailSchema = createSelectSchema(orderDetails, {
  quantity: z.number().positive().optional(),
  price: z.number().positive().optional(),
  amount: z.number().positive().optional(),
});

export const insertProductSchema = createInsertSchema(products, {
  productName: z.string().min(1),
  productCode: z.string().min(1),
});

export const updateProductSchema = createSelectSchema(products, {
  productName: z.string().min(1).optional(),
  productCode: z.string().min(1).optional(),
  description: z.string().optional(),
});

export const insertCustomerSchema = createInsertSchema(customers, {
  customerName: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export const updateCustomerSchema = createSelectSchema(customers, {
  customerName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});
