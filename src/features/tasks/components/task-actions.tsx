"use client";

// External dependencies
import React from "react";
import Link from "next/link";
import { Edit, Ellipsis, ExternalLink, Trash } from "lucide-react";

// Internal UI components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Hooks and queries
import { useDeleteTask } from "../queries/task.queries";
import { useConfirm } from "@/hooks/use-confirm";
import { useEditTask } from "../hooks/use-edit-task";

/**
 * Props interface for TaskActions component
 * @interface Props
 * @property {string} taskId - The ID of the task
 * @property {() => void} [onDelete] - Optional callback function after successful deletion
 */
interface Props {
  taskId: string;
  onDelete?: () => void;
}

/**
 * TaskActions Component
 * Provides a dropdown menu with actions for viewing, editing, and deleting a task
 *
 * @component
 * @param {Props} props - Component props
 */
const TaskActions: React.FC<Props> = ({ taskId, onDelete }) => {
  // Hooks initialization
  const { onOpen } = useEditTask();
  const { mutate: deleteTask } = useDeleteTask();
  const [ConfirmationDialog, confirm] = useConfirm({
    title: "Are you sure?",
    message: "The task will get deleted permanently.",
  });

  /**
   * Handles the delete action with confirmation
   * @async
   */
  const handleDelete = async () => {
    const confirmed = await confirm();
    if (confirmed) {
      deleteTask(taskId);
      onDelete?.();
    }
  };

  /**
   * Handles the edit action
   */
  const handleEdit = () => {
    onOpen(taskId);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Task actions menu">
            <Ellipsis className="h-4 w-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[200px]"
          aria-label="Task actions"
        >
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link
                href={`/tasks/${taskId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center gap-2"
                aria-label="View task in new tab"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                <span>View</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEdit} aria-label="Edit task">
              <Edit className="h-4 w-4" aria-hidden="true" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={handleDelete}
              aria-label="Delete task"
            >
              <Trash className="h-4 w-4" aria-hidden="true" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirmation Dialog for delete action */}
      <ConfirmationDialog />
    </>
  );
};

export default TaskActions;
