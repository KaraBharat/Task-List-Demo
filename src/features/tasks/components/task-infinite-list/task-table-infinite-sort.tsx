// React and third-party imports
import React from "react";
import { Table } from "@tanstack/react-table";

// Local type imports
import { Task } from "../../queries/task.queries";

// UI component imports
import { ComboBox } from "@/components/combo-box";
import { CommandItem } from "@/components/ui/command";

// Icon imports
import {
  XIcon,
  ArrowUpWideNarrowIcon,
  ArrowDownWideNarrowIcon,
  ArrowDownUp,
} from "lucide-react";

interface TaskTableInfiniteSortProps {
  table: Table<Task>;
}

/**
 * TaskTableInfiniteSort Component
 * Provides sorting functionality for a table with infinite loading capabilities
 *
 * @component
 * @param {TaskTableInfiniteSortProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export default function TaskTableInfiniteSort({
  table,
}: TaskTableInfiniteSortProps): JSX.Element {
  // Get current sort state from the table
  const currentSort = table.getState().sorting[0];

  /**
   * Handles changes in sort selection
   * @param {string} value - Sort value in format "columnId:direction"
   */
  const handleSortChange = (value: string): void => {
    if (!value || value === "none") {
      table.resetSorting();
      return;
    }

    const [columnId, direction] = value.split(":");
    table.setSorting([
      {
        id: columnId,
        desc: direction === "desc",
      },
    ]);
  };

  // Get all sortable columns from the table
  const sortableColumns = table
    .getHeaderGroups()
    .flatMap((headerGroup) =>
      headerGroup.headers.filter((header) => header.column.getCanSort()),
    );

  /**
   * Renders the selected sort label
   * @returns {JSX.Element} Label element with sort information
   */
  const selectedLabel = (): JSX.Element => {
    if (!currentSort) {
      return (
        <span className="flex items-center gap-2" role="status">
          <ArrowDownUp className="size-4 text-gray-500" aria-hidden="true" />
          <span>Sort by...</span>
        </span>
      );
    }

    const columnHeader = sortableColumns.find(
      (column) => column.id === currentSort.id,
    )?.column.columnDef.header as string;

    return (
      <div className="flex items-center gap-2" role="status">
        <span>Sorted by {columnHeader}</span>
        {currentSort.desc ? (
          <ArrowUpWideNarrowIcon className="size-4" aria-hidden="true" />
        ) : (
          <ArrowDownWideNarrowIcon className="size-4" aria-hidden="true" />
        )}
      </div>
    );
  };

  return (
    <ComboBox
      selectedItem={selectedLabel()}
      disabledSearch={true}
      placeholder="Search..."
      aria-label="Sort table columns"
    >
      {/* Render sortable column options */}
      {sortableColumns.map(({ id, column }) => (
        <CommandItem
          key={id}
          value={column.columnDef.header as string}
          onSelect={() =>
            handleSortChange(
              `${id}:${currentSort?.id === id && !currentSort.desc ? "desc" : "asc"}`,
            )
          }
        >
          <span className="flex items-center gap-2">
            {currentSort?.id === id &&
              (currentSort.desc ? (
                <ArrowUpWideNarrowIcon className="size-4" aria-hidden="true" />
              ) : (
                <ArrowDownWideNarrowIcon
                  className="size-4"
                  aria-hidden="true"
                />
              ))}
            {column.columnDef.header as string}
          </span>
        </CommandItem>
      ))}

      {/* Reset sorting option */}
      {currentSort && (
        <CommandItem
          value="none"
          onSelect={() => handleSortChange("none")}
          aria-label="Reset table sorting"
        >
          <span className="flex items-center gap-2">
            <XIcon className="size-4" aria-hidden="true" />
            <span>Reset sorting</span>
          </span>
        </CommandItem>
      )}
    </ComboBox>
  );
}
