import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import {
  eq,
  and,
  desc,
  asc,
  SQL,
  sql,
  inArray,
  between,
  AnyColumn,
} from "drizzle-orm";
import {
  tasks,
  insertTaskSchema,
  updateTaskSchema,
} from "../../../database/schema";
import { z } from "zod";
import { db } from "@/database/drizzle";

/**
 * Tasks API
 * Handles CRUD operations for tasks
 */
const app = new Hono()
  /**
   * GET /tasks
   * Fetch list of tasks with optional filtering and pagination
   */
  .get(
    "/list",
    zValidator(
      "query",
      z.object({
        // Define and validate query parameters
        limit: z.coerce.number().optional().default(10),
        offset: z.coerce.number().optional().default(0),
        search: z.string().optional(),
        sort: z
          .enum([
            "title",
            "createdAt",
            "dueDate",
            "type",
            "priority",
            "status",
            "assigneeName",
          ])
          .optional()
          .default("createdAt"),
        order: z.enum(["asc", "desc"]).optional().default("desc"),
        status: z.string().optional(),
        type: z.string().optional(),
        priority: z.string().optional(),
        assignee: z.string().optional(),
        reporter: z.string().optional(),
        createdAtFrom: z.string().optional(),
        createdAtTo: z.string().optional(),
        dueDateFrom: z.string().optional(),
        dueDateTo: z.string().optional(),
      }),
    ),
    async (c) => {
      try {
        // Extract validated query parameters
        const {
          limit,
          offset,
          search,
          sort,
          order,
          status,
          type,
          priority,
          assignee,
          reporter,
          createdAtFrom,
          createdAtTo,
          dueDateFrom,
          dueDateTo,
        } = c.req.valid("query");

        // Initialize array to hold SQL conditions
        const whereClause: SQL[] = [];

        // Filter out deleted tasks
        whereClause.push(eq(tasks.isDeleted, false));

        // Add search condition if provided
        if (search) {
          whereClause.push(
            sql`(lower(${tasks.title}) like ${`%${search.toLowerCase()}%`} OR lower(${tasks.key}) like ${`%${search.toLowerCase()}%`})`,
          );
        }

        // Process comma-separated filters
        if (status) {
          const statusValues = status.split(",").map((s) => s.trim()) as (
            | "todo"
            | "in_progress"
            | "done"
            | "to_verify"
            | "closed"
          )[];
          whereClause.push(inArray(tasks.status, statusValues));
        }
        if (type) {
          const typeValues = type.split(",").map((t) => t.trim()) as (
            | "bug"
            | "story"
            | "task"
            | "subtask"
            | "epic"
          )[];
          whereClause.push(inArray(tasks.type, typeValues));
        }
        if (priority) {
          const priorityValues = priority.split(",").map((p) => p.trim()) as (
            | "low"
            | "medium"
            | "high"
          )[];
          whereClause.push(inArray(tasks.priority, priorityValues));
        }

        if (assignee) {
          const assigneeIds = assignee.split(",").map((a) => a.trim());
          whereClause.push(inArray(tasks.assigneeId, assigneeIds));
        }

        if (reporter) {
          const reporterIds = reporter.split(",").map((r) => r.trim());
          whereClause.push(inArray(tasks.reporterId, reporterIds));
        }

        if (createdAtFrom && createdAtTo) {
          const createdAtFromDate = new Date(createdAtFrom);
          const createdAtToDate = new Date(createdAtTo);

          if (
            !isNaN(createdAtFromDate.getTime()) &&
            !isNaN(createdAtToDate.getTime())
          ) {
            whereClause.push(
              between(tasks.createdAt, createdAtFromDate, createdAtToDate),
            );
          } else {
            console.error("Invalid date format for createdAt range");
          }
        }

        if (dueDateFrom && dueDateTo) {
          const dueDateFromDate = new Date(dueDateFrom);
          const dueDateToDate = new Date(dueDateTo);

          if (
            !isNaN(dueDateFromDate.getTime()) &&
            !isNaN(dueDateToDate.getTime())
          ) {
            whereClause.push(
              between(tasks.dueDate, dueDateFromDate, dueDateToDate),
            );
          } else {
            console.error("Invalid date format for dueDate range");
          }
        }

        // Start building the main query
        // Let query = db.select().from(tasks);
        let query = db
          .select({
            id: tasks.id,
            key: tasks.key,
            title: tasks.title,
            createdAt: tasks.createdAt,
            updatedAt: tasks.updatedAt,
            dueDate: tasks.dueDate,
            description: sql`${""}`,
            storyPoints: tasks.storyPoints,
            reporterId: tasks.reporterId,
            timeEstimate: tasks.timeEstimate,
            timeSpent: tasks.timeSpent,
            status: tasks.status,
            type: tasks.type,
            priority: tasks.priority,
            assigneeId: tasks.assigneeId,
            assigneeName: sql`assigneeUser.name`,
            assigneeAvatarUrl: sql`assigneeUser.avatar_url`,
            reporterName: sql`reporterUser.name`,
            reporterAvatarUrl: sql`reporterUser.avatar_url`,
          })
          .from(tasks)
          .leftJoin(
            sql`user_profiles as assigneeUser`,
            sql`tasks.assignee_id = assigneeUser.id`,
          )
          .leftJoin(
            sql`user_profiles as reporterUser`,
            sql`tasks.reporter_id = reporterUser.id`,
          );

        // Apply filters if any
        if (whereClause.length > 0) {
          query = query.where(and(...whereClause)) as typeof query;
        }

        // Apply sorting
        if (sort) {
          if (sort === "assigneeName") {
            query = query.orderBy(
              order === "desc"
                ? sql`assigneeUser.name desc`
                : sql`assigneeUser.name asc`,
            ) as typeof query;
          } else {
            const sortColumn = tasks[sort as keyof typeof tasks] as AnyColumn;
            query = query.orderBy(
              order === "desc" ? desc(sortColumn) : asc(sortColumn),
            ) as typeof query;
          }
        } else {
          // Default sorting if not specified
          query = query.orderBy(desc(tasks.createdAt)) as typeof query;
        }

        // Apply pagination
        query = query.limit(limit).offset(offset) as typeof query;

        // Execute the main query
        const taskList = await query;

        // Construct and execute query for total count
        let totalCountQuery = db
          .select({ count: sql`count(${tasks.id})` })
          .from(tasks);

        if (whereClause.length > 0) {
          totalCountQuery = totalCountQuery.where(
            and(...whereClause),
          ) as typeof totalCountQuery;
        }

        const [{ count }] = await totalCountQuery;

        // Return JSON response with tasks and pagination info
        return c.json(
          {
            tasks: taskList,
            pagination: {
              total: Number(count),
              limit,
              offset,
            },
          },
          200,
        );
      } catch (error) {
        // Error handling
        console.error("Error fetching tasks:", error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    },
  )

  /**
   * GET /tasks/:id
   * Fetch a single task by ID
   */
  .get("/:id", async (c) => {
    try {
      const id = c.req.param("id");
      const [task] = await db
        .select({
          id: tasks.id,
          key: tasks.key,
          title: tasks.title,
          createdAt: tasks.createdAt,
          updatedAt: tasks.updatedAt,
          dueDate: tasks.dueDate,
          description: tasks.description,
          storyPoints: tasks.storyPoints,
          reporterId: tasks.reporterId,
          timeEstimate: tasks.timeEstimate,
          timeSpent: tasks.timeSpent,
          status: tasks.status,
          type: tasks.type,
          priority: tasks.priority,
          assigneeId: tasks.assigneeId,
          assigneeName: sql`assigneeUser.name`,
          assigneeAvatarUrl: sql`assigneeUser.avatar_url`,
          reporterName: sql`reporterUser.name`,
          reporterAvatarUrl: sql`reporterUser.avatar_url`,
          isDeleted: tasks.isDeleted,
        })
        .from(tasks)
        .leftJoin(
          sql`user_profiles as assigneeUser`,
          sql`tasks.assignee_id = assigneeUser.id`,
        )
        .leftJoin(
          sql`user_profiles as reporterUser`,
          sql`tasks.reporter_id = reporterUser.id`,
        )
        .where(and(eq(tasks.id, id), eq(tasks.isDeleted, false)))
        .limit(1);

      if (!task) {
        return c.json({ error: "Task not found" }, 404);
      }

      return c.json(task, 200);
    } catch (error) {
      console.error("Error fetching task:", error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  })

  /**
   * POST /tasks
   * Create a new task
   */
  .post("/", zValidator("json", insertTaskSchema), async (c) => {
    try {
      const taskData = c.req.valid("json");

      // Convert dueDate from string to Date object

      const dueDate = taskData.dueDate
        ? new Date(taskData.dueDate as string)
        : null;

      if (dueDate && isNaN(dueDate.getTime())) {
        return c.json({ error: "Invalid dueDate format" }, 400);
      }

      // Remove unnecessary fields and add converted dueDate

      const key = await generateSequentialKey();

      const [newTask] = await db
        .insert(tasks)
        .values({
          id: taskData.id,
          title: taskData.title,
          description: taskData.description,
          type: taskData.type,
          priority: taskData.priority,
          status: taskData.status,
          assigneeId: taskData.assigneeId,
          reporterId: taskData.reporterId,
          key,
          dueDate,
          storyPoints: taskData.storyPoints,
          timeEstimate: taskData.timeEstimate,
          timeSpent: taskData.timeSpent,
        })
        .returning();

      return c.json(newTask, 201);
    } catch (error) {
      console.error("Error creating task:", error);

      return c.json({ error: "Internal Server Error" }, 500);
    }
  })

  /**
   * PATCH /tasks/:id
   * Update an existing task
   */
  .patch("/:id", zValidator("json", updateTaskSchema), async (c) => {
    try {
      const id = c.req.param("id");
      const taskData = c.req.valid("json");
      // Convert dueDate from string to Date object

      const dueDate = taskData.dueDate
        ? new Date(taskData.dueDate as string)
        : null;

      if (dueDate && isNaN(dueDate.getTime())) {
        return c.json({ error: "Invalid dueDate format" }, 400);
      }

      const [updatedTask] = await db
        .update(tasks)
        .set({
          title: taskData.title,
          description: taskData.description,
          type: taskData.type,
          priority: taskData.priority,
          status: taskData.status,
          assigneeId: taskData.assigneeId,
          dueDate,
          storyPoints: taskData.storyPoints,
          timeEstimate: taskData.timeEstimate,
          timeSpent: taskData.timeSpent,
        })
        .where(eq(tasks.id, id))
        .returning();

      if (!updatedTask) {
        return c.json({ error: "Task not found" }, 404);
      }

      return c.json(updatedTask, 200);
    } catch (error) {
      console.error("Error updating task:", error);
      return c.json({ error: "Internal Server Error" }, 500);
    }
  })

  /**
   * DELETE /tasks/:id
   * Delete a task
   */
  .delete(
    "/:id",
    zValidator("param", z.object({ id: z.string().uuid() })),
    async (c) => {
      try {
        const { id } = c.req.valid("param");
        const [deletedTask] = await db
          .update(tasks)
          .set({
            isDeleted: true,
            deletedAt: new Date(),
          })
          .where(eq(tasks.id, id))
          .returning();

        if (!deletedTask) {
          return c.json({ error: "Task not found" }, 404);
        }

        return c.json({ message: "Task deleted successfully" }, 200);
      } catch (error) {
        console.error("Error deleting task:", error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    },
  )
  .post(
    "/bulk-delete",
    zValidator("json", z.object({ ids: z.array(z.string().uuid()) })),
    async (c) => {
      try {
        const { ids } = c.req.valid("json");

        const deletedTasks = await db
          .update(tasks)
          .set({
            isDeleted: true,
            deletedAt: new Date(),
          })
          .where(inArray(tasks.id, ids))
          .returning();

        if (deletedTasks.length === 0) {
          return c.json({ error: "Tasks not found" }, 404);
        }

        return c.json({ message: "Tasks deleted successfully" }, 200);
      } catch (error) {
        console.error("Error deleting tasks:", error);
        return c.json({ error: "Internal Server Error" }, 500);
      }
    },
  );

const PREFIX = "TLM"; // Configurable prefix

async function generateSequentialKey() {
  // Fetch the last highest key number from the database
  const lastTask = await db
    .select({ key: tasks.key })
    .from(tasks)
    .orderBy(desc(tasks.key))
    .limit(1);

  let lastNumber = 0;
  if (lastTask.length > 0) {
    const lastKey = lastTask[0].key;
    const match = lastKey.match(/-(\d+)$/);
    if (match) {
      lastNumber = parseInt(match[1], 10);
    }
  }

  // Increment the number by 1
  const newNumber = lastNumber + 1;

  // Format the new key
  const newKey = `${PREFIX}-${newNumber.toString().padStart(4, "0")}`;

  return newKey;
}

export default app;
