// External dependencies
import { create } from "zustand";

/**
 * Interface for the Edit Task State
 * @interface EditTaskState
 * @property {boolean} isOpen - Flag indicating if the edit modal is open
 * @property {string} taskId - ID of the task being edited
 * @property {function} onOpen - Function to open the edit modal with a task ID
 * @property {function} onClose - Function to close the edit modal
 */
interface EditTaskState {
  isOpen: boolean;
  taskId: string;
  onOpen: (taskId: string) => void;
  onClose: () => void;
}

/**
 * Initial state for the edit task store
 */
const initialState: Omit<EditTaskState, "onOpen" | "onClose"> = {
  isOpen: false,
  taskId: "",
};

/**
 * Custom hook for managing task editing state
 * Uses Zustand for state management
 *
 * @example
 * ```typescript
 * const { isOpen, taskId, onOpen, onClose } = useEditTask();
 *
 * // Open edit modal
 * onOpen('task-123');
 *
 * // Close edit modal
 * onClose();
 * ```
 */
export const useEditTask = create<EditTaskState>((set) => ({
  ...initialState,

  /**
   * Opens the edit modal with the specified task ID
   * @param {string} taskId - The ID of the task to edit
   */
  onOpen: (taskId: string) =>
    set({
      isOpen: true,
      taskId,
    }),

  /**
   * Closes the edit modal and resets the task ID
   */
  onClose: () =>
    set({
      ...initialState,
    }),
}));

// Default export for cleaner imports
export default useEditTask;
