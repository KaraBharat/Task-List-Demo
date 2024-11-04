"use client";

// External dependencies
import React from "react";
import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

// Internal dependencies
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Constants
const PAGE_SIZE_OPTIONS = [15, 25, 50, 100] as const;

// Types
interface TablePaginationProps {
  table: Table<any>;
  totalResults: number;
}

/**
 * TablePagination Component
 * Provides pagination controls for the table including page size selection
 * and navigation buttons
 *
 * @param {TablePaginationProps} props - Component properties
 * @returns {JSX.Element} Rendered pagination controls
 */
export const TablePagination: React.FC<TablePaginationProps> = ({
  table,
  totalResults,
}) => {
  const { pageIndex, pageSize } = table.getState().pagination;
  const start = pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, totalResults);

  return (
    <nav
      className="flex flex-col items-start justify-between gap-2 px-2 pt-4 md:flex-row md:items-center"
      aria-label="Table navigation"
    >
      {/* Results Summary */}
      <div
        className="flex-1 text-sm text-stone-700"
        role="status"
        aria-live="polite"
      >
        Showing {start} to {end} of {totalResults} results
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center space-x-2">
        {/* Page Size Selector */}
        <PageSizeSelector
          pageSize={pageSize}
          onPageSizeChange={(value) => table.setPageSize(Number(value))}
        />

        {/* Navigation Buttons */}
        <NavigationButtons table={table} />
      </div>
    </nav>
  );
};

/**
 * PageSizeSelector Component
 * Allows users to select the number of items per page
 */
const PageSizeSelector: React.FC<{
  pageSize: number;
  onPageSizeChange: (value: string) => void;
}> = ({ pageSize, onPageSizeChange }) => (
  <Select
    value={String(pageSize)}
    onValueChange={onPageSizeChange}
    aria-label="Select number of items per page"
  >
    <SelectTrigger className="h-9 w-32">
      <span>Show {pageSize}</span>
    </SelectTrigger>
    <SelectContent>
      {PAGE_SIZE_OPTIONS.map((size) => (
        <SelectItem key={size} value={String(size)}>
          Show {size}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

/**
 * NavigationButtons Component
 * Provides buttons for navigating between pages
 */
const NavigationButtons: React.FC<{
  table: Table<any>;
}> = ({ table }) => {
  const navigationButtons = [
    {
      label: "First",
      icon: ChevronsLeft,
      onClick: () => table.setPageIndex(0),
      disabled: !table.getCanPreviousPage(),
      ariaLabel: "Go to first page",
    },
    {
      label: "Previous",
      icon: ChevronLeft,
      onClick: () => table.previousPage(),
      disabled: !table.getCanPreviousPage(),
      ariaLabel: "Go to previous page",
    },
    {
      label: "Next",
      icon: ChevronRight,
      onClick: () => table.nextPage(),
      disabled: !table.getCanNextPage(),
      ariaLabel: "Go to next page",
    },
    {
      label: "Last",
      icon: ChevronsRight,
      onClick: () => table.setPageIndex(table.getPageCount() - 1),
      disabled: !table.getCanNextPage(),
      ariaLabel: "Go to last page",
    },
  ];

  return (
    <>
      {navigationButtons.map(
        ({ label, icon: Icon, onClick, disabled, ariaLabel }) => (
          <Button
            key={label}
            variant="outline"
            size="sm"
            onClick={onClick}
            disabled={disabled}
            className="flex items-center gap-2"
            aria-label={ariaLabel}
          >
            <Icon className="size-4" aria-hidden="true" />
            <span className="hidden md:block">{label}</span>
          </Button>
        ),
      )}
    </>
  );
};

export default TablePagination;
