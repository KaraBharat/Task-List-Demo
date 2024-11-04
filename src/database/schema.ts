import {
  pgTable,
  text,
  timestamp,
  integer,
  uuid,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// User table
export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  authId: text("auth_id"), // Auth0 ID, example clerk auth_id -- TODO: change to auth0 id, make it unique and not null
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  isDeleted: boolean("is_deleted").notNull().default(false),
  deletedAt: timestamp("deleted_at"),
});

export const userProfilesRelations = relations(userProfiles, ({ many }) => ({
  assignedTasks: many(tasks, { relationName: "assignee" }),
  reportedTasks: many(tasks, { relationName: "reporter" }),
  comments: many(taskComments),
}));

export const taskTypes = pgEnum("task_types", [
  "bug",
  "story",
  "task",
  "subtask",
  "epic",
]);

export const taskPriorities = pgEnum("task_priorities", [
  "low",
  "medium",
  "high",
]);

export const taskStatuses = pgEnum("task_statuses", [
  "todo",
  "in_progress",
  "done",
  "to_verify",
  "closed",
]);

// Task table
export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(),
  title: text("title").notNull(),
  status: taskStatuses("status").notNull().default("todo"),
  description: text("description"),
  dueDate: timestamp("due_date"),
  assigneeId: uuid("assignee_id").references(() => userProfiles.id, {
    onDelete: "set null",
  }),
  reporterId: uuid("reporter_id").references(() => userProfiles.id, {
    onDelete: "set null",
  }),
  storyPoints: integer("story_points"),
  timeEstimate: integer("time_estimate"),
  timeSpent: integer("time_spent"),
  priority: taskPriorities("priority"),
  type: taskTypes("type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  isDeleted: boolean("is_deleted").notNull().default(false),
  deletedAt: timestamp("deleted_at"),
});

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  assignee: one(userProfiles, {
    fields: [tasks.assigneeId],
    references: [userProfiles.id],
    relationName: "assignee",
  }),
  reporter: one(userProfiles, {
    fields: [tasks.reporterId],
    references: [userProfiles.id],
    relationName: "reporter",
  }),
  subtasks: many(tasks, { relationName: "subtasks" }),
  comments: many(taskComments),
}));

// Task Comments table
export const taskComments = pgTable("task_comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  taskId: uuid("task_id")
    .references(() => tasks.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id").references(() => userProfiles.id, {
    onDelete: "set null",
  }),
  content: text("content").notNull(),
  deleted: boolean("deleted").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  isDeleted: boolean("is_deleted").notNull().default(false),
  deletedAt: timestamp("deleted_at"),
});

export const taskCommentsRelations = relations(taskComments, ({ one }) => ({
  task: one(tasks, { fields: [taskComments.taskId], references: [tasks.id] }),
  user: one(userProfiles, {
    fields: [taskComments.userId],
    references: [userProfiles.id],
  }),
}));

// User Zod schemas
export const userProfileSchema = createSelectSchema(userProfiles);

// Task Zod schemas
export const taskSchema = createSelectSchema(tasks);

// Task Comment Zod schemas
export const taskCommentSchema = createSelectSchema(taskComments);

// Zod schemas for insert, update, and delete
export const insertUserProfileSchema = createInsertSchema(userProfiles);
export const updateUserProfileSchema = createSelectSchema(userProfiles)
  .partial()
  .omit({ id: true });
export const deleteUserSchema = z.object({ id: z.string().uuid() });

export const insertTaskSchema = createInsertSchema(tasks)
  .omit({
    key: true,
    createdAt: true,
    updatedAt: true,
    isDeleted: true,
    deletedAt: true,
  })
  .extend({
    dueDate: z.string().optional(), // Ensure dueDate is a string
  });

export const updateTaskSchema = createSelectSchema(tasks).partial().extend({
  dueDate: z.string().optional(), // Ensure dueDate is a string
});

export const deleteTaskSchema = z.object({ id: z.string().uuid() });

export const insertTaskCommentSchema = createInsertSchema(taskComments).omit({
  updatedAt: true,
  deleted: true,
  isDeleted: true,
  deletedAt: true,
});

export const updateTaskCommentSchema =
  createSelectSchema(taskComments).partial();
export const deleteTaskCommentSchema = z.object({ id: z.string().uuid() });
