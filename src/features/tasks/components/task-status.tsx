"use client"; 

// External dependencies
import React from "react";
import { CheckIcon, Loader2Icon, InfoIcon, CheckCircle2 } from "lucide-react";
import { InfoCircledIcon } from "@radix-ui/react-icons";

// Internal dependencies
import { cn } from "@/lib/utils";
import { taskStatuses } from "../types/filters";
import { TaskStatusEnum } from "../types";

// Types
interface TaskStatusProps {
  /** The current status of the task */
  status: string;
}

// Constants
const STATUS_STYLES = {
  [TaskStatusEnum.DONE]: "bg-green-100 text-green-800",
  [TaskStatusEnum.IN_PROGRESS]: "bg-yellow-100 text-yellow-800",
  [TaskStatusEnum.TODO]: "bg-blue-100 text-blue-800",
  [TaskStatusEnum.TO_VERIFY]: "bg-purple-100 text-purple-800",
  [TaskStatusEnum.CLOSED]: "bg-gray-100 text-gray-800",
} as const;

const STATUS_ICONS = {
  [TaskStatusEnum.DONE]: CheckIcon,
  [TaskStatusEnum.IN_PROGRESS]: Loader2Icon,
  [TaskStatusEnum.TODO]: InfoIcon,
  [TaskStatusEnum.TO_VERIFY]: InfoCircledIcon,
  [TaskStatusEnum.CLOSED]: CheckCircle2,
} as const;

/**
 * TaskStatus Component
 * Displays the current status of a task with appropriate styling and icon
 *
 * @param {TaskStatusProps} props - Component properties
 * @returns {JSX.Element} Rendered task status indicator
 */
export const TaskStatus: React.FC<TaskStatusProps> = ({ status }) => {
  // Find the human-readable label for the status
  const statusLabel = taskStatuses.find((t) => t.value === status)?.label;

  // Get the appropriate styles for the status
  const statusStyles =
    STATUS_STYLES[status as keyof typeof STATUS_STYLES] ||
    STATUS_STYLES[TaskStatusEnum.TODO];

  // Get the icon component for the status
  const StatusIcon = STATUS_ICONS[status as keyof typeof STATUS_ICONS];

  return (
    <span
      role="status"
      aria-label={`Task status: ${statusLabel}`}
      className={cn(
        "flex w-fit items-center gap-2 rounded-md border px-2 py-1 text-sm font-medium shadow-sm",
        statusStyles,
      )}
    >
      {StatusIcon && (
        <StatusIcon
          className="size-4"
          aria-hidden="true"
          data-testid={`status-icon-${status}`}
        />
      )}
      <span>{statusLabel}</span>
    </span>
  );
};

// Default export
export default TaskStatus;
