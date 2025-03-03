import { eq, desc } from "drizzle-orm";
import { db } from "@/database/drizzle";
import {
  orders,
  customers,
  orderDetails,
  products,
} from "@/database/schemas/order.schema";

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
      customerName: customers.customerName,
      customerEmail: customers.email,
      customerPhone: customers.phone,
      totalAmount: orders.totalAmount,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
    })
    .from(orders)
    .innerJoin(paginatedOrders, eq(orders.id, paginatedOrders.id))
    .innerJoin(customers, eq(orders.customerId, customers.id))
    .orderBy(desc(orders.orderNo)); // Ensuring consistent ordering

  return orderList;
};

export const getOrder = async (orderId: string) => {
  const order = await db
    .select({
      id: orders.id,
      orderNo: orders.orderNo,
      orderDate: orders.orderDate,
      totalAmount: orders.totalAmount,
      customer: {
        id: customers.id,
        customerName: customers.customerName,
        email: customers.email,
        phone: customers.phone,
      },
      lineItems: {
        id: orderDetails.id,
        productId: orderDetails.productId,
        productName: products.productName,
        productCode: products.productCode,
        quantity: orderDetails.quantity,
        price: orderDetails.price,
        amount: orderDetails.amount,
      },
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
    })
    .from(orders)
    .innerJoin(orderDetails, eq(orders.id, orderDetails.id))
    .innerJoin(products, eq(orderDetails.productId, products.id))
    .innerJoin(customers, eq(orders.customerId, customers.id))
    .where(eq(orders.id, orderId));

  return order;
};
