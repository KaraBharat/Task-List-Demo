'use client';

// External dependencies
import React, { useEffect, useState } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import { SearchIcon, X } from 'lucide-react';

// Internal dependencies
import { Input } from '@/components/ui/input';
import { useTaskFiltersStore } from '@/stores/task-filters-store';

// Constants
const DEBOUNCE_DELAY = 500; // milliseconds

/**
 * TableSearch Component
 * Provides a search input field for filtering tasks with debounced search functionality
 * to prevent excessive API calls while typing.
 *
 * @returns {JSX.Element} Rendered search input with clear functionality
 */
export const TaskSearch: React.FC = () => {
  // Local state for search input
  const [search, setSearch] = useState<string>('');
  
  // Global store for search state
  const { setSearch: setSearchStore } = useTaskFiltersStore();

  // Debounce search input to prevent excessive API calls
  const debouncedSearch = useDebounce(search, DEBOUNCE_DELAY);

  // Update global store when debounced search changes
  useEffect(() => {
    setSearchStore(debouncedSearch);
  }, [debouncedSearch, setSearchStore]);

  /**
   * Handles clearing the search input
   */
  const handleClearSearch = () => {
    setSearch('');
    // Focus the input after clearing
    const searchInput = document.querySelector<HTMLInputElement>('[name="task-search"]');
    searchInput?.focus();
  };

  return (
    <div 
      className="relative flex w-full items-center gap-2 md:max-w-md"
      role="search"
      aria-label="Search tasks"
    >
      {/* Search Icon */}
      <SearchIcon 
        className="absolute left-4 h-4 w-4 text-gray-500" 
        aria-hidden="true"
      />

      {/* Search Input */}
      <Input
        name="task-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-10 pr-10"
        placeholder="Search tasks"
        aria-label="Search tasks"
        autoComplete="off"
      />

      {/* Clear Search Button */}
      {search && (
        <button
          type="button"
          onClick={handleClearSearch}
          className="absolute right-4 flex h-4 w-4 items-center justify-center"
          aria-label="Clear search"
        >
          <X 
            className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700" 
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
};

// Default export
export default TaskSearch;