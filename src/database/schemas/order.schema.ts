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

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
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
  id: uuid("id").primaryKey().defaultRandom(),
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
  id: uuid("id").primaryKey().defaultRandom(),
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
  id: uuid("id").primaryKey().defaultRandom(),
  customerName: text("customer_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  isDeleted: boolean("is_deleted").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  deletedAt: timestamp("deleted_at"),
});

// Relations for Orders table
export const ordersRelations = relations(orders, ({ one, many }) => ({
  orderDetails: many(orderDetails),
  customer: one(customers),
}));

// Relations for Order Details table
export const orderDetailsRelations = relations(orderDetails, ({ one }) => ({
  order: one(orders),
  product: one(products),
}));

// Relations for Products table
export const productsRelations = relations(products, ({ many }) => ({
  orderDetails: many(orderDetails),
}));

// Relations for Customers table
export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
}));
