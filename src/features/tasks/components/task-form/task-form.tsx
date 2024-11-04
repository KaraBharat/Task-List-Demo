"use client";

// External dependencies
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Internal dependencies - UI Components
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

// Internal dependencies - Form Fields
import { TitleField } from "./form-fields/title-field";
import { AssigneeField } from "./form-fields/assignee-field";
import { DescriptionField } from "./form-fields/description-field";
import { SelectField } from "./form-fields/select-field";
import { NumberField } from "./form-fields/number-field";
import { DateField } from "./form-fields/date-field";

// Internal dependencies - Types & Schema
import { TaskFormData, taskSchema } from "../../schema/add-task.schema";
import { taskPriorities, taskStatuses, taskTypes } from "../../types/filters";
import type { Task } from "../../queries/task.queries";

// Internal dependencies - Hooks & Store
import { useAuthStore } from "@/stores/auth-store";
import { useCreateTask, useUpdateTask } from "../../queries/task.queries";
import { useNewTask } from "../../hooks/use-new-task";
import { useEditTask } from "../../hooks/use-edit-task";
import {
  UserProfile,
  useUserProfiles,
} from "../../queries/user-profiles.queries";

// Types
interface TaskFormProps {
  task?: Task;
}

/**
 * TaskForm Component
 * Handles the creation and editing of tasks with form validation and submission
 *
 * @param {TaskFormProps} props - Component properties
import { Task } from '../../queries/task.queries';
 * @returns {JSX.Element} Rendered form component
 */
function TaskForm({ task }: TaskFormProps) {
  // Hooks for managing task state and operations
  const { onClose } = useNewTask();
  const { onClose: onCloseUpdate } = useEditTask();
  const { data: userProfiles, isLoading: userProfilesLoading } =
    useUserProfiles();
  const { userProfile } = useAuthStore();
  const { mutate: createTask } = useCreateTask();
  const { mutate: updateTask } = useUpdateTask();

  // Initialize form with default values
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      assigneeId: task?.assigneeId || "",
      status: task?.status || "todo",
      priority: task?.priority || "medium",
      type: task?.type || "task",
      storyPoints: task?.storyPoints || 1,
      dueDate: task?.dueDate ? new Date(task.dueDate).toISOString() : undefined,
      timeEstimate: task?.timeEstimate || 0,
      timeSpent: task?.timeSpent || 0,
    },
  });

  /**
   * Handles form submission
   * @param {TaskFormData} data - Form data to be submitted
   */
  const onSubmit = async (data: TaskFormData) => {
    try {
      const formTask = {
        ...data,
        labels: data.type?.toString() || "",
      };
      if (task) {
        updateTask({ id: task.id, data: formTask });
      } else {
        createTask({
          ...formTask,
          type: formTask.type || "task",
          reporterId: userProfile?.id,
        });
      }

      onCloseSheet();
    } catch (error) {
      console.error("Error in task submission:", error);
      // Add proper error handling here
    }
  };

  /**
   * Handles form closure and reset
   */
  const onCloseSheet = () => {
    form.reset();
    task ? onCloseUpdate() : onClose();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        aria-label={`${task ? "Edit" : "Create"} task form`}
      >
        <TitleField form={form} />
        <DescriptionField form={form} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <AssigneeField
            form={form}
            userProfiles={userProfiles as UserProfile[]}
            isLoading={userProfilesLoading}
          />

          <SelectField
            form={form}
            name="priority"
            label="Priority"
            options={taskPriorities}
            placeholder="Select priority"
          />

          <SelectField
            form={form}
            name="type"
            label="Type"
            options={taskTypes}
            placeholder="Select type"
          />

          <SelectField
            form={form}
            name="status"
            label="Status"
            options={taskStatuses}
            placeholder="Select status"
          />

          <NumberField
            form={form}
            name="storyPoints"
            label="Story Points"
            placeholder="Enter story points"
          />

          <DateField form={form} name="dueDate" label="Due Date" />

          <NumberField
            form={form}
            name="timeEstimate"
            label="Time Estimate (hrs)"
            placeholder="Enter time estimate"
          />

          {task && (
            <NumberField
              form={form}
              name="timeSpent"
              label="Time Spent (hrs)"
              placeholder="Enter time spent"
            />
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            type="button"
            onClick={onCloseSheet}
            aria-label="Cancel form"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            disabled={form.formState.isSubmitting}
            isLoading={form.formState.isSubmitting}
            aria-label={`${task ? "Update" : "Create"} task`}
          >
            {task ? "Update" : "Create"} Item
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default TaskForm;
