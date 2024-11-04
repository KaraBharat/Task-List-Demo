import { Hono } from "hono";
import { db } from "@/database/drizzle";
import { userProfiles } from "../../../database/schema";
import { eq } from "drizzle-orm";

/**
 * Fetch user list
 * GET /users
 */
const app = new Hono()
  .get("/", async (c) => {
    try {
      const userList = await db
        .select({
          id: userProfiles.id,
          name: userProfiles.name,
          avatarUrl: userProfiles.avatarUrl,
          email: userProfiles.email,
          authId: userProfiles.authId,
        })
        .from(userProfiles);
      return c.json(userList, 200);
    } catch (error) {
      console.error("Error fetching users:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  })
  .get("/:id", async (c) => {
    try {
      const id = c.req.param("id");
      const user = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.id, id))
        .limit(1);

      if (user.length === 0) {
        return c.json({ error: "User not found" }, 404);
      }

      return c.json(user[0], 200);
    } catch (error) {
      console.error("Error fetching user:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  });

export default app;
