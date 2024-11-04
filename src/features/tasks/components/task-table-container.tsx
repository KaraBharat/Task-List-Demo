"use client";

// External dependencies
import React, { useState } from "react";
import {
  DownloadIcon,
  FilterIcon,
  PlusIcon,
  TrashIcon,
  TriangleAlert,
} from "lucide-react";

// Internal dependencies - UI Components
import { Button } from "@/components/ui/button";
import { ColumnSelection } from "@/components/column-selection";

// Internal dependencies - Features
import { TableInstance } from "./task-table-wrapper";
import { TablePagination } from "./task-pagination";
import { TaskSearch } from "./task-search";
import { TaskTable } from "./task-table";
import TaskFilter from "./task-filter";

// Internal dependencies - Hooks & Utils
import { useNewTask } from "../hooks/use-new-task";
import { Task, useBulkDeleteTask } from "../queries/task.queries";
import { useConfirm } from "@/hooks/use-confirm";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Types
interface TaskTableContainerProps {
  onSelectTask: (task: Task) => void;
  selectedTask: Task | null;
  visibleColumns: string[];
}

/**
 * TaskTableContainer Component
 * Main container component for the task management interface.
 * Handles task operations, filtering, and display management.
 */
export const TaskTableContainer: React.FC<TaskTableContainerProps> = ({
  onSelectTask,
  selectedTask,
  visibleColumns,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { onOpen } = useNewTask();
  const { mutate: deleteTasks } = useBulkDeleteTask();
  const [ConfirmationDialog, confirm] = useConfirm({
    title: "Are you sure?",
    message: "The selected tasks will get deleted permanently.",
  });

  return (
    <div className="py-2" role="region" aria-label="Task management interface">
      <TableInstance visibleColumns={visibleColumns}>
        {(table, totalCount, isLoading, error) => {
          const selectedTasks = table
            .getRowModel()
            .rows.filter((row) => row.getIsSelected());

          return (
            <>
              <TableToolbar
                onOpen={onOpen}
                selectedTask={selectedTask}
                selectedTasks={selectedTasks}
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
                onDeleteTasks={createDeleteTasksHandler(
                  table,
                  selectedTasks,
                  confirm,
                  deleteTasks,
                )}
                table={table}
              />

              <FilterSection
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
                selectedTask={selectedTask}
              />

              {error ? (
                <ErrorMessage />
              ) : (
                <TableContent
                  table={table}
                  totalCount={totalCount}
                  isLoading={isLoading}
                  onSelectTask={onSelectTask}
                />
              )}
            </>
          );
        }}
      </TableInstance>
      <ConfirmationDialog />
    </div>
  );
};

// Subcomponents
interface TableToolbarProps {
  onOpen: () => void;
  selectedTask: Task | null;
  selectedTasks: any[];
  isFilterOpen: boolean;
  setIsFilterOpen: (value: boolean) => void;
  onDeleteTasks: () => Promise<void>;
  table: any;
}

/**
 * TableToolbar Component
 * Contains action buttons and controls for the table
 */
const TableToolbar: React.FC<TableToolbarProps> = ({
  onOpen,
  selectedTask,
  selectedTasks,
  isFilterOpen,
  setIsFilterOpen,
  onDeleteTasks,
  table,
}) => (
  <div className="mb-4 flex flex-col items-start justify-between gap-4 md:flex-row">
    <div className="flex w-full items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={onOpen}
            aria-label="Add new task"
          >
            <PlusIcon className="h-4 w-4" aria-hidden="true" />
            <span className="hidden md:block">Add Item</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Add new task</TooltipContent>
      </Tooltip>
      <TaskSearch />
    </div>
    <div className="flex w-full items-center justify-end gap-2">
      <div>
        <DeleteButton selectedTasks={selectedTasks} onDelete={onDeleteTasks} />
      </div>
      <div>
        <Tooltip>
          <TooltipTrigger asChild>
            <FilterButton
              isFilterOpen={isFilterOpen}
              setIsFilterOpen={setIsFilterOpen}
              selectedTask={selectedTask}
            />
          </TooltipTrigger>
          <TooltipContent>Filter tasks</TooltipContent>
        </Tooltip>
      </div>
      <div>
        <Tooltip>
          <TooltipTrigger asChild>
            <ColumnSelection table={table} />
          </TooltipTrigger>
          <TooltipContent>Show/hide columns</TooltipContent>
        </Tooltip>
      </div>
      <div>
        <Tooltip>
          <TooltipTrigger asChild>
            <ExportButton selectedTask={selectedTask} />
          </TooltipTrigger>
          <TooltipContent>Coming soon</TooltipContent>
        </Tooltip>
      </div>
    </div>
  </div>
);

/**
 * FilterSection Component
 * Contains the task filter interface
 */
const FilterSection: React.FC<{
  isFilterOpen: boolean;
  setIsFilterOpen: (value: boolean) => void;
  selectedTask: Task | null;
}> = ({ isFilterOpen, setIsFilterOpen, selectedTask }) => (
  <div className="mb-4 flex w-full items-center">
    <TaskFilter
      isFilterOpen={isFilterOpen}
      setIsFilterOpen={setIsFilterOpen}
      selectedTask={selectedTask}
    />
  </div>
);

/**
 * TableContent Component
 * Renders the main table content and pagination
 */
const TableContent: React.FC<{
  table: any;
  totalCount: number;
  isLoading: boolean;
  onSelectTask: (task: Task) => void;
}> = ({ table, totalCount, isLoading, onSelectTask }) => (
  <>
    <TaskTable
      table={table}
      isLoading={isLoading}
      onSelectTask={onSelectTask}
    />
    <TablePagination table={table} totalResults={totalCount} />
  </>
);

// Utility Components
const DeleteButton: React.FC<{
  selectedTasks: any[];
  onDelete: () => Promise<void>;
}> = ({ selectedTasks, onDelete }) =>
  selectedTasks.length > 0 ? (
    <Button
      variant="destructive"
      className="flex items-center gap-2"
      onClick={onDelete}
      aria-label={`Delete ${selectedTasks.length} selected tasks`}
    >
      <TrashIcon className="h-4 w-4" aria-hidden="true" />
      <span className="hidden md:block">
        {`Delete (${selectedTasks.length})`}
      </span>
    </Button>
  ) : null;

const FilterButton: React.FC<{
  isFilterOpen: boolean;
  setIsFilterOpen: (value: boolean) => void;
  selectedTask: Task | null;
}> = ({ isFilterOpen, setIsFilterOpen, selectedTask }) => (
  <Button
    variant="outline"
    className={cn(
      "flex items-center gap-2 lg:hidden",
      selectedTask ? "lg:flex" : "",
    )}
    onClick={() => setIsFilterOpen(!isFilterOpen)}
    aria-label="Toggle filter panel"
    aria-expanded={isFilterOpen}
  >
    <FilterIcon className="size-4" aria-hidden="true" />
    <span className="hidden md:block">Filter</span>
  </Button>
);

const ExportButton: React.FC<{ selectedTask: Task | null }> = ({
  selectedTask,
}) =>
  !selectedTask ? (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      aria-label="Export tasks"
    >
      <DownloadIcon className="h-4 w-4" aria-hidden="true" />
      <span className="hidden md:block">Export</span>
    </Button>
  ) : null;

const ErrorMessage: React.FC = () => (
  <div
    className="mt-4 flex items-center justify-center gap-2 text-center text-sm text-red-500"
    role="alert"
  >
    <TriangleAlert className="size-4" aria-hidden="true" />
    <p className="font-medium">Error while fetching tasks</p>
  </div>
);

// Utility Functions
const createDeleteTasksHandler =
  (
    table: any,
    selectedTasks: any[],
    confirm: () => Promise<unknown>,
    deleteTasks: (ids: string[]) => void,
  ) =>
  async () => {
    if (selectedTasks.length === 0) return;

    const confirmed = await confirm();
    if (confirmed) {
      table.setRowSelection({});
      deleteTasks(selectedTasks.map((row) => row.original.id));
    }
  };

export default TaskTableContainer;
