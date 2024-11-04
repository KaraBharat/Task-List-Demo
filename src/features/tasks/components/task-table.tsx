"use client";

// External dependencies
import React from "react";
import {
  ColumnDef,
  flexRender,
  Table as TableType,
} from "@tanstack/react-table";
import { ArrowDownNarrowWideIcon, ArrowUpWideNarrowIcon } from "lucide-react";

// Internal dependencies - UI Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

// Internal dependencies - Utils & Constants
import { cn } from "@/lib/utils";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import { Task } from "../queries/task.queries";

// Types
interface TaskTableProps {
  table: TableType<Task>;
  isLoading: boolean;
  onSelectTask: (task: Task) => void;
}

/**
 * TaskTable Component
 * Renders a data table for tasks with sorting, loading states, and row selection capabilities
 *
 * @param {TableType<Task>} table - TanStack table instance
 * @param {boolean} isLoading - Loading state of the table
 * @param {Function} onSelectTask - Callback for task selection
 */
export const TaskTable: React.FC<TaskTableProps> = ({
  table,
  isLoading,
  onSelectTask,
}) => {
  return (
    <div
      className="relative h-[calc(100vh-16rem)] overflow-y-auto border border-stone-300 md:h-[calc(100vh-12rem)]"
      role="region"
      aria-label="Tasks table"
    >
      <Table className="min-w-full">
        {/* Table Header Section */}
        <TableHeader className="bg-gray-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} role="row">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="sticky top-0 z-10 border-x border-stone-300 px-4 py-2 text-left text-sm font-medium text-gray-600 hover:bg-gray-200"
                  role="columnheader"
                >
                  {!header.isPlaceholder && (
                    <div className="flex items-center">
                      {renderHeaderContent(header)}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        {/* Table Body Section */}
        <TableBody className="overflow-y-auto">
          {renderTableContent(table, isLoading, onSelectTask)}
        </TableBody>
      </Table>
    </div>
  );
};

// Helper Components and Functions
/**
 * Renders the header content with sorting functionality
 */
const renderHeaderContent = (header: any) => {
  if (header.column.getCanSort()) {
    return (
      <button
        className="flex cursor-pointer items-center gap-2"
        onClick={header.column.getToggleSortingHandler()}
        aria-label={`Sort by ${header.column.columnDef.header}`}
      >
        {renderSortIcon(header.column.getIsSorted())}
        {flexRender(header.column.columnDef.header, header.getContext())}
      </button>
    );
  }

  return (
    <div className="flex w-full items-center justify-center pr-4">
      {flexRender(header.column.columnDef.header, header.getContext())}
    </div>
  );
};

/**
 * Renders the appropriate sort icon based on sort direction
 */
const renderSortIcon = (sortDirection: false | "asc" | "desc") => {
  if (sortDirection === "asc")
    return <ArrowDownNarrowWideIcon className="size-4" aria-hidden="true" />;
  if (sortDirection === "desc")
    return <ArrowUpWideNarrowIcon className="size-4" aria-hidden="true" />;
  return null;
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
        columns={table.getAllColumns().map((col) => col.columnDef)}
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
  columns: ColumnDef<Task>[];
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
        {columns.map((column, columnIndex) => (
          <TableCell
            key={columnIndex}
            className="border border-stone-300 px-4 py-2 text-sm text-gray-700"
            style={{
              minWidth: column.minSize ? `${column.minSize}px` : undefined,
              width: column.minSize ? `${column.minSize}px` : undefined,
            }}
            role="cell"
          >
            <Skeleton className="h-8 w-full" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);

// Utility functions
const getRowClassName = (row: any, index: number) =>
  cn(
    "hover:bg-stone-100",
    row.getIsSelected()
      ? "bg-blue-100 hover:bg-blue-200"
      : index % 2 === 0
        ? "bg-gray-50"
        : "bg-white",
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
    "border border-stone-300 px-4 py-2 text-sm text-gray-700",
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

export default TaskTable;
