export interface TaskFilterStates {
  search?: string;
  selectedType: string[];
  selectedStatus: string[];
  selectedAssignee: string[];
  selectedPriority: string[];
  createdDateRangeFrom: Date | undefined;
  createdDateRangeTo: Date | undefined;
  dueDateRangeFrom: Date | undefined;
  dueDateRangeTo: Date | undefined;
}

type FilterOption = {
  label: string;
  value: string;
};

export const taskTypes: FilterOption[] = [
  { label: "Bug", value: "bug" },
  { label: "Story", value: "story" },
  { label: "Task", value: "task" },
  { label: "Subtask", value: "subtask" },
  { label: "Epic", value: "epic" },
];

export const taskStatuses: FilterOption[] = [
  { label: "To Do", value: "todo" },
  { label: "In Progress", value: "in_progress" },
  { label: "Done", value: "done" },
  { label: "To Verify", value: "to_verify" },
  { label: "Closed", value: "closed" },
];

export const taskPriorities: FilterOption[] = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];
