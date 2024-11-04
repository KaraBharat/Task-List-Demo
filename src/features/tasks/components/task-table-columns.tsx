// External dependencies
import { format } from 'date-fns';
import { ColumnDef } from '@tanstack/react-table';
import { Hash, Loader2, User } from 'lucide-react';

// Internal dependencies - UI Components
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Internal dependencies - Features
import { TaskStatus } from './task-status';
import { TaskPriority } from './task-priority';
import { TaskType } from './task-type';
import TaskActions from './task-actions';
import { Task } from '../queries/task.queries';

/**
 * Task Table Column Definitions
 * Defines the structure and behavior of each column in the task table
 */
export const taskColumns: ColumnDef<Task>[] = [
  // Selection Column
  {
    id: 'select',
    accessorKey: 'select',
    header: ({ table }) => (
      <div className="flex min-w-[20px] items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all tasks"
          name="select-all"
        />
      </div>
    ),
    cell: ({ row }) => renderSelectionCell(row),
    enableSorting: false,
    enableHiding: false,
    minSize: 40,
  },

  // Title Column
  {
    header: 'Title',
    accessorKey: 'title',
    cell: (rowData) => renderTitleCell(rowData.row.original),
    minSize: 250,
  },

  // Type Column
  {
    header: 'Type',
    accessorKey: 'type',
    cell: ({ row }) => (
      <div className="min-w-[100px]" role="cell">
        <TaskType type={row.original.type || ''} />
      </div>
    ),
    minSize: 100,
  },

  // Status Column
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => (
      <div className="min-w-[130px]" role="cell">
        <TaskStatus status={row.original.status} />
      </div>
    ),
    minSize: 130,
  },

  // Assignee Column
  {
    header: 'Assignee',
    accessorKey: 'assigneeName',
    cell: ({ row }) => renderAssigneeCell(row.original),
    minSize: 150,
  },

  // Priority Column
  {
    header: 'Priority',
    accessorKey: 'priority',
    cell: ({ row }) => (
      <div className="min-w-[100px]" role="cell">
        <TaskPriority priority={row.original.priority || ''} />
      </div>
    ),
    minSize: 100,
  },

  // Created Date Column
  {
    header: 'Created Date',
    accessorKey: 'createdAt',
    cell: ({ row }) => renderDateCell(row.original.createdAt),
    minSize: 100,
  },

  // Due Date Column
  {
    header: 'Due Date',
    accessorKey: 'dueDate',
    cell: ({ row }) => renderDateCell(row.original.dueDate, true),
    minSize: 100,
  },

  // Actions Column
  {
    header: '',
    accessorKey: 'actions',
    cell: ({ row }) => (
      <span className="flex min-w-[20px] items-center justify-center" role="cell">
        <TaskActions taskId={row.original.id} />
      </span>
    ),
    enableSorting: false,
    enableHiding: false,
    minSize: 40,
  },
];

/**
 * Render Functions for Complex Cells
 */

const renderSelectionCell = (row: any) => {
  if (row.original.optimisticStatus === 'creating') return null;

  return (
    <div className="flex items-center justify-center pr-4">
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={`Select task ${row.original.title}`}
        disabled={row.original.optimisticStatus === 'deleting'}
        name={`select-${row.original.id}`}
      />
    </div>
  );
};

const renderTitleCell = (task: Task) => (
  <div className="flex min-w-[250px] flex-col justify-center" role="cell">
    {renderTaskKey(task)}
    <span className="text-base font-semibold">
      {task.title}
    </span>
  </div>
);

const renderTaskKey = (task: Task) => {
  if (task.key) {
    return (
      <span className="flex items-center text-xs font-medium text-muted-foreground">
        <Hash className="size-3" aria-hidden="true" />
        {task.key}
      </span>
    );
  }
  if (task.optimisticStatus === 'creating') {
    return (
      <span className="flex items-center text-xs">
        <Loader2 className="size-3 animate-spin" aria-label="Creating task..." />
      </span>
    );
  }
  return '';
};

const renderAssigneeCell = (task: Task) => {
  if (!task.assigneeId) {
    return (
      <div className="flex min-w-[150px] items-center space-x-2" role="cell">
        <span className="text-xs text-gray-500">Unassigned</span>
      </div>
    );
  }

  if (task.optimisticStatus === 'creating' && task.assigneeId && !task.assigneeName) {
    return <Loader2 className="size-3 animate-spin" aria-label="Loading assignee..." />;
  }

  return (
    <div className="flex min-w-[150px] items-center space-x-2" role="cell">
      <Avatar className="size-6">
        <AvatarImage
          className="size-6 object-cover"
          src={task.assigneeAvatarUrl || ''}
          alt={`${task.assigneeName}'s avatar`}
        />
        <AvatarFallback>
          <User className="size-6 rounded-full bg-gray-100 p-1 text-gray-400" aria-hidden="true" />
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium">{task.assigneeName}</span>
    </div>
  );
};

const renderDateCell = (date: Date | string | null, allowEmpty = false) => (
  <span className="min-w-[100px] text-sm font-medium" role="cell">
    {date
      ? format(new Date(date), 'MMM d, yyyy')
      : allowEmpty ? 'N/A' : ''}
  </span>
);

export default taskColumns;