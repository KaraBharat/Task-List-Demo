// Internal UI components
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import TaskForm from "../task-form/task-form";

// Hooks
import { useNewTask } from "../../hooks/use-new-task";

/**
 * NewTaskSheet Component
 * A slide-out sheet component for creating new tasks.
 * Provides a form interface with accessibility features.
 *
 * @component
 * @returns {JSX.Element} The new task sheet component
 */
export const NewTaskSheet = () => {
  // Get new task state and handlers
  const { isOpen, onClose } = useNewTask();

  return (
    <Sheet 
      open={isOpen} 
      onOpenChange={onClose}
    >
      <SheetContent 
        className="min-w-[100%] lg:min-w-[50%]"
        role="dialog"
        aria-labelledby="new-task-title"
        aria-describedby="new-task-description"
      >
        {/* Sheet Header */}
        <SheetHeader>
          <SheetTitle id="new-task-title">
            Add New Item
          </SheetTitle>
          <SheetDescription id="new-task-description">
            Fill in the details below to create a new item.
          </SheetDescription>
        </SheetHeader>

        {/* Form Container */}
        <div 
          className="h-[calc(100vh-6rem)] overflow-y-auto p-2"
          role="region"
          aria-label="New task form container"
        >
          <TaskForm 
            aria-label="Create new task form"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

// Default export for cleaner imports
export default NewTaskSheet;