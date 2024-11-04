"use client";

// External dependencies
import React from "react";
import { useIsClient } from "@uidotdev/usehooks";

// Task sheet components
import { NewTaskSheet } from "@/features/tasks/components/add-task/new-task-sheet";
import { UpdateTaskSheet } from "@/features/tasks/components/update-task/update-task-sheet";

/**
 * SheetProvider Component
 * Provides task-related sheet components (new task and update task)
 * with client-side rendering protection.
 *
 * @component
 * @example
 * ```tsx
 * <SheetProvider />
 * ```
 *
 * @description
 * This component ensures sheets are only rendered on the client side
 * to prevent hydration mismatches. It uses useIsClient hook to
 * determine if the code is running on client side.
 */
export const SheetProvider: React.FC = () => {
  // Check if code is running on client side
  const isClient = useIsClient();

  // Return null during SSR to prevent hydration issues
  if (!isClient) {
    return null;
  }

  return (
    <div role="region" aria-label="Task management sheets">
      <NewTaskSheet />
      <UpdateTaskSheet />
    </div>
  );
};

// Default export for cleaner imports
export default SheetProvider;
