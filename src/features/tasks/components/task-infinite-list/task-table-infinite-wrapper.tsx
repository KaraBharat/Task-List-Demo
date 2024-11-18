"use client";

import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  type Table,
} from "@tanstack/react-table";

// Internal dependencies
import { taskInfiniteColumns } from "./task-table-infinite-columns";
import { Task, useTasksInfinite } from "../../queries/task.queries";
import { useTaskFiltersStore } from "@/stores/task-filters-store";
import { DEFAULT_PAGE_SIZE } from "@/constants";

interface TableInstanceProps {
  children: (
    table: Table<Task>,
    totalCount: number,
    isLoading: boolean,
    error: Error | null,
    fetchNextPage: () => void,
    hasNextPage: boolean | undefined,
    isFetchingNextPage: boolean,
  ) => React.ReactNode;
  visibleColumns: string[];
  selectedTask: Task | null;
}

export const TaskTableInfiniteWrapper: React.FC<TableInstanceProps> = ({
  children,
  visibleColumns,
  selectedTask,
}) => {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);

  const { appliedFilters } = useTaskFiltersStore();

  // Use infinite query hook
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useTasksInfinite(DEFAULT_PAGE_SIZE, {
    ...appliedFilters,
    order: sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined,
    sort: sorting.length > 0 ? sorting[0].id : undefined,
  });

  // Flatten and transform all pages of tasks
  const tasks = React.useMemo(() => {
    const allTasks = data?.pages.flatMap((page) => page?.tasks ?? []) || [];
    return allTasks.map((task) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: task.updatedAt ? new Date(task.updatedAt) : null,
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      isDeleted: false,
      deletedAt: null,
    }));
  }, [data]);

  const totalCount = data?.pages[0]?.pagination.total || 0;

  const table = useReactTable<Task>({
    data: tasks,
    columns: taskInfiniteColumns(selectedTask).filter(
      (column) =>
        "accessorKey" in column &&
        visibleColumns.includes(column.accessorKey as string),
    ),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      rowSelection,
      columnVisibility,
      sorting,
    },
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    manualFiltering: true,
    manualSorting: true,
    enableRowSelection: true,
  });

  return (
    <div role="region" aria-label="Task table container">
      {children(
        table,
        totalCount,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
      )}
    </div>
  );
};

export default TaskTableInfiniteWrapper;
