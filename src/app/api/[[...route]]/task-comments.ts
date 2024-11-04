import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/database/drizzle";
import {
  taskComments,
  insertTaskCommentSchema,
  updateTaskCommentSchema,
  deleteTaskCommentSchema,
  userProfiles,
} from "../../../database/schema";

/**
 * Task Comments API
 * Handles CRUD operations for task comments
 */
const app = new Hono()
  /**
   * GET /task-comments
   * Fetch list of task comments with optional filtering and pagination
   */
  .get("/:taskId", async (c): Promise<Response> => {
    try {
      const taskId = c.req.param("taskId");

      const commentList = await db
        .select({
          id: taskComments.id,
          taskId: taskComments.taskId,
          content: taskComments.content,
          createdAt: taskComments.createdAt,
          updatedAt: taskComments.updatedAt,
          authorName: userProfiles.name,
          authorAvatarUrl: userProfiles.avatarUrl,
        })
        .from(taskComments)
        .leftJoin(userProfiles, eq(taskComments.userId, userProfiles.id))
        .where(
          and(
            eq(taskComments.taskId, taskId),
            eq(taskComments.isDeleted, false),
          ),
        )
        .orderBy(desc(taskComments.createdAt));

      if (!commentList) {
        return c.json<{ error: string }>(
          { error: "Task comments not found" },
          404,
        );
      }

      return c.json(commentList, 200);
    } catch (error) {
      console.error("Error fetching task comments:", error);
      return c.json<{ error: string }>({ error: "Internal Server Error" }, 500);
    }
  })

  /**
   * POST /task-comments
   * Create a new task comment
   */
  .post("/:taskId", zValidator("json", insertTaskCommentSchema), async (c) => {
    const taskId = c.req.param("taskId");

    try {
      const commentData = c.req.valid("json");
      const [newComment] = await db
        .insert(taskComments)
        .values({ ...commentData, taskId })
        .returning();
      return c.json(newComment, 201);
    } catch (error) {
      console.error("Error creating task comment:", error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  })

  /**
   * PATCH /task-comments/:id
   * Update an existing task comment
   */
  .patch("/:id", zValidator("json", updateTaskCommentSchema), async (c) => {
    try {
      const id = c.req.param("id");
      const commentData = c.req.valid("json");
      const [updatedComment] = await db
        .update(taskComments)
        .set(commentData)
        .where(eq(taskComments.id, id))
        .returning();

      if (!updatedComment) {
        return c.json({ error: "Task comment not found" }, 404);
      }

      return c.json(updatedComment, 200);
    } catch (error) {
      console.error("Error updating task comment:", error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  })

  /**
   * DELETE /task-comments/:id
   * Delete a task comment
   */
  .delete("/:id", zValidator("param", deleteTaskCommentSchema), async (c) => {
    try {
      const { id } = c.req.valid("param");
      const [deletedComment] = await db
        .update(taskComments)
        .set({
          isDeleted: true,
          deletedAt: new Date(),
        })
        .where(eq(taskComments.id, id))
        .returning();

      if (!deletedComment) {
        return c.json({ error: "Task comment not found" }, 404);
      }

      return c.json({ message: "Task comment deleted successfully" }, 200);
    } catch (error) {
      console.error("Error deleting task comment:", error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  });

export default app;
