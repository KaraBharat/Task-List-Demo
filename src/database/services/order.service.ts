import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/database/drizzle";
import {
  orders,
  customers,
  // orderDetails,
  // products,
  // OrderDetail,
} from "@/database/schemas/order.schema";

// ✅ Fetch an order with customer details & nested line items using Drizzle ORM
export const getOrder = async (orderId: string) => {
  // const [order] = await db
  //   .select({
  //     id: orders.id,
  //     orderNo: orders.orderNo,
  //     orderDate: orders.orderDate,
  //     totalAmount: orders.totalAmount,

  //     // 👤 Fetching customer details as a nested object
  //     customer: {
  //       id: customers.id,
  //       customerName: customers.customerName,
  //       email: customers.email,
  //       phone: customers.phone,
  //     },

  //     // 📦 Aggregating line items as an array of JSON objects
  //     lineItems: sql<OrderDetail[]>`json_agg(json_build_object(
  //       'id', ${orderDetails.id},
  //       'productId', ${orderDetails.productId},
  //       'productName', ${products.productName},
  //       'productCode', ${products.productCode},
  //       'quantity', ${orderDetails.quantity},
  //       'price', ${orderDetails.price},
  //       'amount', ${orderDetails.amount}
  //     ))::jsonb`, // 🔥 Converts JSON array into PostgreSQL `jsonb` type for structured data
  //   })
  //   .from(orders)
  //   .innerJoin(customers, eq(customers.id, orders.customerId))
  //   .innerJoin(orderDetails, eq(orders.id, orderDetails.orderId))
  //   .innerJoin(products, eq(products.id, orderDetails.productId))
  //   .where(eq(orders.id, orderId))
  //   .groupBy(orders.id, customers.id);

  // return order; // ✅ Returns a structured order with nested customer & line items

  const order = await db.query.orders.findFirst({
    where: (table, { eq }) => eq(table.id, orderId),
    columns: {
      id: true,
      orderNo: true,
      orderDate: true,
      totalAmount: true,
    },
    with: {
      customer: {
        columns: {
          id: true,
          customerName: true,
          email: true,
          phone: true,
        },
      },
      orderDetails: {
        columns: {
          id: true,
          quantity: true,
          price: true,
          amount: true,
        },
        with: {
          product: {
            columns: {
              id: true,
              productName: true,
              productCode: true,
            },
          },
        },
      },
    },
  });

  return order;
};

export const getOrders = async (page: number = 1, pageSize: number = 10) => {
  // Fetch paginated order IDs first for performance optimization
  const paginatedOrders = db
    .select({ id: orders.id })
    .from(orders)
    .where(eq(orders.isActive, true))
    .orderBy(desc(orders.orderNo)) // Ensuring consistent ordering
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .as("subquery");

  // Fetch full order details with customer info
  const orderList = await db
    .select({
      id: orders.id,
      orderNo: orders.orderNo,
      orderDate: orders.orderDate,
      customer: {
        id: customers.id,
        customerName: customers.customerName,
        email: customers.email,
        phone: customers.phone,
      },
      totalAmount: orders.totalAmount,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
    })
    .from(orders)
    .innerJoin(paginatedOrders, eq(orders.id, paginatedOrders.id))
    .innerJoin(customers, eq(customers.id, orders.customerId))
    .orderBy(desc(orders.orderNo));

  return orderList;
};
