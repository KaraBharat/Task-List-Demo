import { Task } from "../queries/task.queries";

export enum TaskStatusEnum {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  DONE = "done",
  TO_VERIFY = "to_verify",
  CLOSED = "closed",
}

export enum TaskPriorityEnum   {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum TaskTypeEnum {
  TASK = "task",
  SUBTASK = "subtask",
  EPIC = "epic",
  BUG = "bug",
  STORY = "story",
}


export interface TaskFilters {
  search?: string;
  sort?: string;
  order?: string;
  status?: string;
  type?: string;
  priority?: string;
  assignee?: string;
  reporter?: string;
  label?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
}

export interface TaskResponse {
  tasks: Task[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}
