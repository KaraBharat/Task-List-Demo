"use client";

// Types
import type { Task } from "./queries/task.queries";

// External imports
import { useEffect, useState } from "react";
import { useIsClient } from "@uidotdev/usehooks";

// Internal imports
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { TaskDetails } from "./components/task-details";
import { TaskTableContainer } from "./components/task-table-container";

/**
 * Column configurations for the task table
 */
const COLUMN_CONFIGS = {
  all: [
    "select",
    "title",
    "type",
    "status",
    "assigneeName",
    "priority",
    "createdAt",
    "dueDate",
    "actions",
  ],
  sideView: [
    "select",
    "title",
    "status",
    "assigneeName",
    "priority",
    "actions",
  ],
} as const;

/**
 * TaskList Component
 * Manages the main task list view with responsive layout and task details sidebar
 *
 * @returns {JSX.Element | null} The rendered TaskList component or null during SSR
 */
export default function TaskList(): JSX.Element | null {
  // State management
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    ...COLUMN_CONFIGS.all,
  ]);

  // Hooks
  const isMobile = useIsMobile();
  const isClient = useIsClient();

  /**
   * Handles closing the task details panel
   */
  const handleCloseTaskDetails = (): void => {
    setSelectedTask(null);
  };

  /**
   * Updates visible columns based on selected task state
   */
  useEffect(() => {
    setVisibleColumns(
      selectedTask ? [...COLUMN_CONFIGS.sideView] : [...COLUMN_CONFIGS.all],
    );
  }, [selectedTask]);

  // Prevent SSR rendering
  if (!isClient) return null;

  return (
    <main
      role="main"
      aria-label="Task management interface"
      className="flex h-full w-full flex-col gap-4 px-4 py-2 md:flex-row"
    >
      {/* Task table container */}
      <section
        className={cn("h-full w-full", selectedTask && "md:w-1/2")}
        role="region"
        aria-label="Task list"
      >
        {((isMobile && !selectedTask) || !isMobile) && (
          <TaskTableContainer
            onSelectTask={setSelectedTask}
            selectedTask={selectedTask}
            visibleColumns={visibleColumns}
          />
        )}
      </section>

      {/* Task details panel */}
      {selectedTask && (
        <aside
          className="h-full w-full py-2 md:w-1/2"
          role="complementary"
          aria-label="Task details panel"
        >
          <TaskDetails
            taskId={selectedTask.id}
            onClose={handleCloseTaskDetails}
          />
        </aside>
      )}
    </main>
  );
}
