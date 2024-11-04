"use client";

// External dependencies
import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  PaginationState,
  type Table,
} from "@tanstack/react-table";

// Internal dependencies - Features
import { taskColumns } from "./task-table-columns";
import { Task, useTasks } from "../queries/task.queries";
import { useTaskFiltersStore } from "@/stores/task-filters-store";

// Internal dependencies - Constants
import { DEFAULT_PAGE_SIZE } from "@/constants";

// Types
interface TableInstanceProps {
  children: (
    table: Table<Task>,
    totalCount: number,
    isLoading: boolean,
    error: Error | null,
  ) => React.ReactNode;
  visibleColumns: string[];
}

/**
 * TableInstance Component
 * Manages the table state and data fetching for the task table.
 * Handles pagination, sorting, filtering, and column visibility.
 *
 * @param {TableInstanceProps} props - Component properties
 * @returns {JSX.Element} Rendered table instance wrapper
 */
export const TableInstance: React.FC<TableInstanceProps> = ({
  children,
  visibleColumns,
}) => {
  // Table state management
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const { appliedFilters } = useTaskFiltersStore();

  /**
   * Fetch tasks with current pagination and sorting
   */
  const { data, isLoading, error } = useTasks(
    pagination.pageSize,
    pagination.pageIndex * pagination.pageSize,
    {
      ...appliedFilters,
      order:
        sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : undefined,
      sort: sorting.length > 0 ? sorting[0].id : undefined,
    },
  );

  /**
   * Transform task dates to Date objects
   */
  const tasks =
    data?.tasks.map((task) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: task.updatedAt ? new Date(task.updatedAt) : null,
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      isDeleted: false,
      deletedAt: null,
    })) || [];

  const totalCount = data?.pagination.total || 0;

  /**
   * Configure and initialize the table instance
   */
  const table = useReactTable<Task>({
    data: tasks,
    columns: taskColumns.filter(
      (column) =>
        "accessorKey" in column &&
        visibleColumns.includes(column.accessorKey as string),
    ),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      rowSelection,
      columnVisibility,
      sorting,
      pagination,
    },
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    enableRowSelection: true,
  });

  return (
    <div role="region" aria-label="Task table container">
      {children(table, totalCount, isLoading, error)}
    </div>
  );
};

/**
 * Filter columns based on visibility configuration
 */
const getVisibleColumns = (
  columns: typeof taskColumns,
  visibleColumns: string[],
) =>
  columns.filter(
    (column) =>
      "accessorKey" in column &&
      visibleColumns.includes(column.accessorKey as string),
  );

export default TableInstance;
