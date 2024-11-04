// External dependencies
import React from "react";
import { AlertTriangleIcon, CircleIcon } from "lucide-react";

// Internal dependencies
import { cn } from "@/lib/utils";
import { taskPriorities } from "../types/filters";
import { TaskPriorityEnum } from "../types";

// Types
interface TaskPriorityProps {
  /** The priority level of the task (high, medium, low, or null) */
  priority: string | null;
}

// Constants
const PRIORITY_STYLES = {
  [TaskPriorityEnum.HIGH]: "bg-red-100 text-red-800",
  [TaskPriorityEnum.MEDIUM]: "bg-yellow-100 text-yellow-800",
  [TaskPriorityEnum.LOW]: "bg-green-100 text-green-800",
} as const;

const PRIORITY_ICONS = {
  [TaskPriorityEnum.HIGH]: AlertTriangleIcon,
  [TaskPriorityEnum.MEDIUM]: CircleIcon,
  [TaskPriorityEnum.LOW]: CircleIcon,
} as const;

/**
 * TaskPriority Component
 * Displays the priority level of a task with appropriate styling and icon
 *
 * @param {TaskPriorityProps} props - Component properties
 * @returns {JSX.Element} Rendered priority indicator
 */
export const TaskPriority: React.FC<TaskPriorityProps> = ({ priority }) => {
  // Handle unassigned priority
  if (!priority) {
    return (
      <span
        className="text-xs text-gray-500"
        role="status"
        aria-label="Task priority: Unassigned"
      >
        Unassigned
      </span>
    );
  }

  // Get priority label from available priorities
  const priorityLabel = taskPriorities.find((t) => t.value === priority)?.label;

  // Get styles for current priority level
  const priorityStyles =
    PRIORITY_STYLES[priority as keyof typeof PRIORITY_STYLES] ||
    "bg-gray-100 text-gray-800";

  // Get icon component for current priority level
  const PriorityIcon = PRIORITY_ICONS[priority as keyof typeof PRIORITY_ICONS];

  return (
    <span
      role="status"
      aria-label={`Task priority: ${priorityLabel}`}
      className={cn(
        "flex w-fit items-center gap-2 rounded-md border px-2 py-1 text-sm font-medium shadow-sm",
        priorityStyles,
      )}
      data-priority={priority}
    >
      {PriorityIcon && (
        <PriorityIcon
          className="size-4"
          aria-hidden="true"
          data-testid={`priority-icon-${priority}`}
        />
      )}
      <span>{priorityLabel}</span>
    </span>
  );
};

/**
 * Helper function to get the severity level for screen readers
 */
const getPrioritySeverity = (priority: string): string => {
  switch (priority) {
    case TaskPriorityEnum.HIGH:
      return "high severity";
    case TaskPriorityEnum.MEDIUM:
      return "medium severity";
    case TaskPriorityEnum.LOW:
      return "low severity";
    default:
      return "unknown severity";
  }
};

// Default export
export default TaskPriority;
