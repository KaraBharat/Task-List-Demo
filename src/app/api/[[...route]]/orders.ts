import { Hono } from "hono";
import { getOrders, getOrder } from "@/database/services/order.service";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

/**
 * Tasks API
 * Handles CRUD operations for tasks
 */
const app = new Hono()

  /**
   * GET /orders
   * Fetch all orders
   */
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        page: z.coerce.number().optional().default(1),
        pageSize: z.coerce.number().optional().default(10),
      }),
    ),
    async (c) => {
      try {
        const { page, pageSize } = c.req.valid("query");

        const orders = await getOrders(page, pageSize);

        if (!orders) {
          return c.json({ error: "Orders not found" }, 404);
        }

        return c.json(orders, 200);
      } catch (error) {
        console.error("Error fetching orders:", error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    },
  )
  .get("/:id", async (c) => {
    try {
      const id = c.req.param("id");

      const order = await getOrder(id);

      console.log("order", order);

      if (!order) {
        return c.json({ error: "Order not found" }, 404);
      }

      return c.json(order, 200);
    } catch (error) {
      console.error("Error fetching order:", error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  });

export default app;
