// External dependencies
import React from 'react';

// Internal dependencies
import { cn } from '@/lib/utils';
import { taskTypes } from '../types/filters';
import { TaskTypeEnum } from '../types';

// Interface definitions
interface TaskTypeProps {
  /** The type of task (bug, story, or task) */
  type: string;
}

/**
 * TaskType Component
 * 
 * Renders a visual indicator for different task types with appropriate styling and accessibility features.
 * Each task type is represented by a different border color:
 * - Bug: Red
 * - Story: Blue
 * - Task: Green
 *
 * @param {TaskTypeProps} props - Component props
 * @returns {JSX.Element} Rendered task type indicator
 */
export const TaskType: React.FC<TaskTypeProps> = ({ type }) => {
  // Find the corresponding label for the task type
  const typeLabel = taskTypes.find((t) => t.value === type)?.label;

  // Define color mappings for different task types
  const typeColorClasses = {
    [TaskTypeEnum.BUG]: 'border-red-500',
    [TaskTypeEnum.STORY]: 'border-blue-500',
    [TaskTypeEnum.TASK]: 'border-green-500',
  };

  return (
    <span
      role="status"
      aria-label={`Task type: ${typeLabel}`}
      className={cn(
        'border-l-[3px] pl-1 text-sm font-medium',
        typeColorClasses[type as keyof typeof typeColorClasses]
      )}
    >
      {typeLabel}
    </span>
  );
};

// Default export
export default TaskType;