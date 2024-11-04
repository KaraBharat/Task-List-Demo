// Internal UI components
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import TaskForm from "../task-form/task-form";
import { TaskFormSkeleton } from "../task-form-skeleton";

// Hooks and queries
import { useEditTask } from "../../hooks/use-edit-task";
import { useTask } from "../../queries/task.queries";

/**
 * UpdateTaskSheet Component
 * A slide-out sheet component for updating task details.
 * Provides a form interface with loading states and accessibility features.
 *
 * @component
 * @returns {JSX.Element} The update task sheet component
 */
export const UpdateTaskSheet = () => {
  // Get edit task state and handlers
  const { isOpen, onClose, taskId } = useEditTask();

  // Fetch task data with loading state
  const { data: task, isLoading } = useTask(taskId);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        className="min-w-[100%] lg:min-w-[50%]"
        role="dialog"
        aria-labelledby="update-task-title"
        aria-describedby="update-task-description"
      >
        {/* Sheet Header */}
        <SheetHeader>
          <SheetTitle id="update-task-title">Update Item</SheetTitle>
          <SheetDescription id="update-task-description">
            Fill in the details below to update the item.
          </SheetDescription>
        </SheetHeader>

        {/* Form Container */}
        <div
          className="h-[calc(100vh-6rem)] overflow-y-auto p-2"
          role="region"
          aria-label="Task update form"
        >
          {isLoading ? (
            <TaskFormSkeleton />
          ) : (
            <TaskForm task={task} aria-label="Update task form" />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

// Default export for cleaner imports
export default UpdateTaskSheet;
