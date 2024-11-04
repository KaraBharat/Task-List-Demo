"use client";

// External dependencies
import React from "react";
import { DateRange } from "react-day-picker";
import { X } from "lucide-react";

// Internal UI components
import { DateRangePicker } from "@/components/date-range-picker";
import { MultiSelectCombobox } from "@/components/multi-select-combobox";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// Types, queries and stores
import { taskPriorities, taskStatuses, taskTypes } from "../types/filters";
import { useUserProfiles } from "../queries/user-profiles.queries";
import { Task } from "../queries/task.queries";
import { useTaskFiltersStore } from "@/stores/task-filters-store";

/**
 * Props interface for TaskFilter component
 * @interface TaskFilterProps
 */
type TaskFilterProps = {
  isFilterOpen: boolean;
  setIsFilterOpen: (value: boolean) => void;
  selectedTask: Task | null;
};

/**
 * Helper function to handle date range with default end date
 * @param range - Optional DateRange object
 * @returns Modified DateRange with default end date if needed
 */
const getDateRangeWithDefault = (range?: DateRange): DateRange | undefined => {
  if (range?.from && !range.to) {
    const defaultEndDate = new Date(range.from);
    defaultEndDate.setMonth(defaultEndDate.getMonth() + 1);
    return { ...range, to: defaultEndDate };
  }
  return range;
};

/**
 * TaskFilter Component
 * Provides filtering functionality for tasks with both mobile and desktop views
 *
 * @component
 */
const TaskFilter: React.FC<TaskFilterProps> = ({
  isFilterOpen,
  setIsFilterOpen,
  selectedTask,
}) => {
  // Fetch user profiles for assignee filter
  const { data: userProfiles } = useUserProfiles();
  const { filter, setFilter, clearFilter } = useTaskFiltersStore();

  // Date range handlers
  const handleCreatedDateRangeChange = (range?: DateRange) => {
    const updatedRange = getDateRangeWithDefault(range);
    setFilter({
      ...filter,
      createdDateRangeFrom: updatedRange?.from,
      createdDateRangeTo: updatedRange?.to,
    });
  };

  const handleDueDateRangeChange = (range?: DateRange) => {
    const updatedRange = getDateRangeWithDefault(range);
    setFilter({
      ...filter,
      dueDateRangeFrom: updatedRange?.from,
      dueDateRangeTo: updatedRange?.to,
    });
  };

  // Check if any filters are active
  const hasActiveFilters =
    (filter.selectedType?.length ?? 0) > 0 ||
    (filter.selectedStatus?.length ?? 0) > 0 ||
    (filter.selectedAssignee?.length ?? 0) > 0 ||
    (filter.selectedPriority?.length ?? 0) > 0 ||
    filter.createdDateRangeFrom ||
    filter.createdDateRangeTo ||
    filter.dueDateRangeFrom ||
    filter.dueDateRangeTo;

  /**
   * Filter controls component
   * Reused in both mobile and desktop views
   */
  const FiltersList = (
    <>
      {/* Task type filter */}
      <MultiSelectCombobox
        label="Type"
        options={taskTypes}
        value={filter.selectedType}
        onChange={(value) => setFilter({ ...filter, selectedType: value })}
        aria-label="Filter by task type"
      />
      {/* Status filter */}
      <MultiSelectCombobox
        label="Status"
        options={taskStatuses}
        value={filter.selectedStatus}
        onChange={(value) => setFilter({ ...filter, selectedStatus: value })}
        aria-label="Filter by task status"
      />
      {/* Priority filter */}
      <MultiSelectCombobox
        label="Priority"
        options={taskPriorities}
        value={filter.selectedPriority}
        onChange={(value) => setFilter({ ...filter, selectedPriority: value })}
        aria-label="Filter by task priority"
      />
      {/* Assignee filter */}
      <MultiSelectCombobox
        label="Assignee"
        options={
          userProfiles?.map((userProfile) => ({
            label: userProfile.name,
            value: userProfile.id,
          })) || []
        }
        value={filter.selectedAssignee}
        onChange={(value) => setFilter({ ...filter, selectedAssignee: value })}
        aria-label="Filter by assignee"
      />
      {/* Date range filters */}
      <DateRangePicker
        key="createdDateRange"
        label="created date"
        value={{
          from: filter.createdDateRangeFrom,
          to: filter.createdDateRangeTo,
        }}
        onChange={handleCreatedDateRangeChange}
        aria-label="Filter by creation date range"
      />
      <DateRangePicker
        key="dueDateRange"
        label="due date"
        value={{
          from: filter.dueDateRangeFrom,
          to: filter.dueDateRangeTo,
        }}
        onChange={handleDueDateRangeChange}
        aria-label="Filter by due date range"
      />
      {/* Clear filters button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={clearFilter}
          className="flex items-center gap-2"
          aria-label="Clear all filters"
        >
          <X className="size-4" aria-hidden="true" />
          Clear All
        </Button>
      )}
    </>
  );

  return (
    <>
      {/* Mobile view - Sheet/drawer */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent side="left" role="dialog" aria-label="Task filters">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>
              <div className="flex w-full flex-col justify-between gap-4 text-primary">
                {FiltersList}
                <Button
                  className="w-full"
                  onClick={() => setIsFilterOpen(false)}
                  aria-label="Apply filters"
                >
                  Apply
                </Button>
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      {/* Desktop view */}
      {!selectedTask && (
        <div 
          className="hidden flex-wrap items-center gap-4 text-primary lg:flex"
          role="region"
          aria-label="Task filters"
        >
          {FiltersList}
        </div>
      )}
    </>
  );
};

export default TaskFilter;