// External dependencies
import { create } from "zustand";
import { SortingState } from "@tanstack/react-table";

// Internal dependencies
import { TaskFilters } from "@/features/tasks/types";
import { TaskFilterStates } from "@/features/tasks/types/filters";
import { DEFAULT_PAGE_SIZE } from "@/constants";

/**
 * Interface defining the state and actions for the task filters store
 */
interface TaskFiltersStoreState {
  filter: TaskFilterStates;
  appliedFilters?: TaskFilters;
  limit?: number;
  offset?: number;
  sorting?: SortingState;
  setFilter: (filter: TaskFilterStates) => void;
  setSearch: (search?: string) => void;
  setLimit: (limit?: number) => void;
  setOffset: (offset?: number) => void;
  clearFilter: () => void;
}

/**
 * Custom hook for managing task filters state
 * Utilizes Zustand for state management
 */
export const useTaskFiltersStore = create<TaskFiltersStoreState>(
  (set, get) => ({
    // Initial state values
    limit: DEFAULT_PAGE_SIZE,
    offset: 0,
    appliedFilters: {
      search: "",
      sort: undefined,
      order: undefined,
    },
    filter: {
      search: "",
      selectedType: [],
      selectedStatus: [],
      selectedAssignee: [],
      selectedPriority: [],
      createdDateRangeFrom: undefined,
      createdDateRangeTo: undefined,
      dueDateRangeFrom: undefined,
      dueDateRangeTo: undefined,
    },

    /**
     * Sets the filter state and updates applied filters
     * @param filter - The new filter state to apply
     */
    setFilter: (filter: TaskFilterStates) => {
      // Retrieve current state
      const currentFilter = get().filter;
      const currentAppliedFilters = get().appliedFilters;

      // Merge new filter with current filter
      const newFilter = { ...currentFilter, ...filter };

      // Construct applied filters based on the new filter
      const appliedFilters = {
        search: currentAppliedFilters?.search,
        sort: currentAppliedFilters?.sort,
        order: currentAppliedFilters?.order,
        status: filter.selectedStatus?.join(","),
        type: filter.selectedType?.join(","),
        priority: filter.selectedPriority?.join(","),
        assignee: filter.selectedAssignee?.join(","),
        createdAtFrom: filter.createdDateRangeFrom?.toISOString(),
        createdAtTo: filter.createdDateRangeTo?.toISOString(),
        dueDateFrom: filter.dueDateRangeFrom?.toISOString(),
        dueDateTo: filter.dueDateRangeTo?.toISOString(),
      };

      // Update state with new filter and applied filters
      set({ filter: newFilter, appliedFilters });
    },

    /**
     * Sets the search term in the filter and applied filters
     * @param search - The search term to apply
     */
    setSearch: (search?: string) => {
      // Retrieve current state
      const currentFilter = get().filter;
      const currentAppliedFilters = get().appliedFilters;

      // Update state with new search term
      set({
        filter: { ...currentFilter, search },
        appliedFilters: { ...currentAppliedFilters, search },
      });
    },

    /**
     * Sets the limit for pagination
     * @param limit - The limit to set
     */
    setLimit: (limit?: number) => set({ limit }),

    /**
     * Sets the offset for pagination
     * @param offset - The offset to set
     */
    setOffset: (offset?: number) => set({ offset }),

    /**
     * Clears all filters and resets to initial state
     */
    clearFilter: () =>
      set({
        filter: {
          search: "",
          selectedType: [],
          selectedStatus: [],
          selectedAssignee: [],
          selectedPriority: [],
          createdDateRangeFrom: undefined,
          createdDateRangeTo: undefined,
          dueDateRangeFrom: undefined,
          dueDateRangeTo: undefined,
        },
        appliedFilters: {
          search: "",
        },
      }),
  }),
);
