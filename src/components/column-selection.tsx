"use client";

// External dependencies
import React from "react";
import { Table } from "@tanstack/react-table";
import { ColumnsIcon } from "lucide-react";

// Internal UI components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Props interface for ColumnSelection component
 * @interface ColumnSelectionProps
 * @template T - Type of data in the table
 * @property {Table<T>} table - TanStack table instance
 */
interface ColumnSelectionProps<T> {
  table: Table<T>;
}

/**
 * ColumnSelection Component
 * Provides a dropdown menu for toggling table column visibility
 *
 * @component
 * @template T - Type of data in the table
 * @param {ColumnSelectionProps<T>} props - Component props
 *
 * @example
 * ```tsx
 * <ColumnSelection table={table} />
 * ```
 */
export function ColumnSelection<T>({ table }: ColumnSelectionProps<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          aria-label="Toggle column visibility"
        >
          <ColumnsIcon className="h-4 w-4" aria-hidden="true" />
          <span className="hidden md:block">Columns</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="min-w-[150px]"
        aria-label="Column visibility options"
      >
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            const columnName =
              typeof column.columnDef.header === "string"
                ? column.columnDef.header
                : column.id;

            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                aria-label={`Toggle ${columnName} column visibility`}
              >
                {columnName}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Default export for cleaner imports
export default ColumnSelection;
