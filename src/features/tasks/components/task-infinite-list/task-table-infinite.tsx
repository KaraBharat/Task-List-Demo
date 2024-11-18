"use client";

// External dependencies
import React from "react";
import { ColumnDef, Table as TableType } from "@tanstack/react-table";

// Internal dependencies - UI Components
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

// Internal dependencies - Utils & Constants
import { cn } from "@/lib/utils";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import { Task } from "../../queries/task.queries";

// Types
interface TaskTableInfiniteProps {
  table: TableType<Task>;
  isLoading: boolean;
  onSelectTask: (task: Task) => void;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
}

/**
 * TaskTable Component
 * Renders a data table for tasks with sorting, loading states, and row selection capabilities
 *
 * @param {TableType<Task>} table - TanStack table instance
 * @param {boolean} isLoading - Loading state of the table
 * @param {Function} onSelectTask - Callback for task selection
 */
export const TaskTableInfinite: React.FC<TaskTableInfiniteProps> = ({
  table,
  isLoading,
  onSelectTask,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}) => {
  const loadMoreRef = React.useCallback(
    (node: any) => {
      if (!node) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        { threshold: 0.5 },
      );

      observer.observe(node);

      return () => observer.disconnect();
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  return (
    <div className="relative" role="region" aria-label="Tasks table">
      <Table className="min-w-full">
        {/* Table Body Section */}
        <TableBody>
          {renderTableContent(table, isLoading, onSelectTask)}
          {isFetchingNextPage && (
            <TaskTableSkeleton
              rows={2}
              columns={table.getAllColumns().length}
            />
          )}
        </TableBody>
      </Table>
      <div ref={loadMoreRef} />
    </div>
  );
};

/**
 * Renders the table content based on loading state and data availability
 */
const renderTableContent = (
  table: TableType<Task>,
  isLoading: boolean,
  onSelectTask: (task: Task) => void,
) => {
  if (isLoading) {
    return (
      <TaskTableSkeleton
        rows={DEFAULT_PAGE_SIZE}
        columns={table.getAllColumns().length}
      />
    );
  }

  if (table.getRowModel().rows.length === 0) {
    return <EmptyTableMessage colSpan={table.getAllColumns().length} />;
  }

  return table.getRowModel().rows.map((row, index) => (
    <TableRow
      key={row.original.id}
      className={getRowClassName(row, index)}
      role="row"
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          className={getCellClassName(cell)}
          onClick={() => handleCellClick(cell, row, onSelectTask)}
          role="cell"
        >
          {renderCellContent(cell)}
        </TableCell>
      ))}
    </TableRow>
  ));
};

// Utility Components
const EmptyTableMessage: React.FC<{ colSpan: number }> = ({ colSpan }) => (
  <TableRow>
    <TableCell
      colSpan={colSpan}
      className="text-center text-sm text-gray-500"
      role="cell"
    >
      <p className="text-sm font-medium text-gray-500">No tasks found</p>
    </TableCell>
  </TableRow>
);

// Types and Implementation for TaskTableSkeleton
interface TaskTableSkeletonProps {
  rows: number;
  columns: number;
}

/**
 * TaskTableSkeleton Component
 * Renders a loading skeleton for the table while data is being fetched
 */
const TaskTableSkeleton: React.FC<TaskTableSkeletonProps> = ({
  rows,
  columns,
}) => (
  <>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <TableRow key={rowIndex} role="row">
        <TableCell colSpan={columns}>
          <div className="flex w-full items-center justify-start gap-2">
            <Skeleton className="h-4 w-[50%] rounded-md" />
            <Skeleton className="h-4 w-[10%] rounded-md" />
            <Skeleton className="h-4 w-[10%] rounded-md" />
            <Skeleton className="h-4 w-[10%] rounded-md" />
            <Skeleton className="h-4 w-[5%] rounded-md" />
            <Skeleton className="h-4 w-[5%] rounded-md" />
          </div>
        </TableCell>
      </TableRow>
    ))}
  </>
);

// Utility functions
const getRowClassName = (row: any, index: number) =>
  cn(
    "hover:bg-stone-100",
    row.getIsSelected() && "bg-blue-100 hover:bg-blue-200",
    row.original.optimisticStatus === "creating" ||
      row.original.optimisticStatus === "updating"
      ? "animate-pulse bg-green-100 hover:bg-green-100"
      : "",
    row.original.optimisticStatus === "deleting"
      ? "animate-pulse bg-red-100 hover:bg-red-100"
      : "",
  );

const getCellClassName = (cell: any) =>
  cn(
    "px-4 py-[4px] text-sm text-gray-700",
    cell.column.id !== "title" ? "cursor-default" : "cursor-pointer",
  );

const renderCellContent = (cell: any) =>
  typeof cell.column.columnDef.cell === "function"
    ? cell.column.columnDef.cell(cell.getContext())
    : cell.renderValue();

const handleCellClick = (
  cell: any,
  row: any,
  onSelectTask: (task: Task) => void,
) => {
  if (
    row.original.optimisticStatus === "creating" ||
    row.original.optimisticStatus === "deleting" ||
    cell.column.id !== "title"
  ) {
    return;
  }
  onSelectTask(row.original);
};

export default TaskTableInfinite;
