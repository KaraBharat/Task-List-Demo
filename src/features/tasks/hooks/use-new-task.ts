// External dependencies
import { create } from "zustand";

/**
 * Interface for the New Task State
 * @interface NewTaskState
 * @property {boolean} isOpen - Flag indicating if the new task modal is open
 * @property {function} onOpen - Function to open the new task modal
 * @property {function} onClose - Function to close the new task modal
 */
interface NewTaskState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

/**
 * Initial state for the new task store
 */
const initialState: Omit<NewTaskState, "onOpen" | "onClose"> = {
  isOpen: false,
};

/**
 * Custom hook for managing new task modal state
 * Uses Zustand for state management
 *
 * @example
 * ```typescript
 * const { isOpen, onOpen, onClose } = useNewTask();
 *
 * // Open new task modal
 * onOpen();
 *
 * // Close new task modal
 * onClose();
 * ```
 */
export const useNewTask = create<NewTaskState>((set) => ({
  ...initialState,

  /**
   * Opens the new task modal
   */
  onOpen: () =>
    set({
      isOpen: true,
    }),

  /**
   * Closes the new task modal
   */
  onClose: () =>
    set({
      ...initialState,
    }),
}));

// Default export for cleaner imports
export default useNewTask;
