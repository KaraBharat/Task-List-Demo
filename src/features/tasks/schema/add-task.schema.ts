import * as z from "zod";
import { taskPriorities, taskStatuses, taskTypes } from "@/database/schema";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(taskStatuses.enumValues),
  dueDate: z.string().optional(),
  assigneeId: z.string().min(1, "Assignee is required"),
  priority: z.enum(taskPriorities.enumValues).optional(),
  type: z.enum(taskTypes.enumValues).optional(),
  storyPoints: z.number().min(0).optional(),
  timeEstimate: z.number().min(0).optional(),
  timeSpent: z.number().min(0).optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;
