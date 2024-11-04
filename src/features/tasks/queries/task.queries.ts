// External dependencies
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

// Internal dependencies
import { client } from "@/lib/hono";
import {
  insertTaskSchema,
  updateTaskSchema,
  taskSchema,
} from "@/database/schema";
import { TaskFilters } from "../types";
import { useTaskFiltersStore } from "@/stores/task-filters-store";
import { toast } from "@/hooks/use-toast";

// Types
export type Task = z.infer<typeof taskSchema> & {
  assigneeName: string | null;
  assigneeAvatarUrl: string | null;
  reporterName: string | null;
  reporterAvatarUrl: string | null;
  optimisticStatus?: "creating" | "updating" | "deleting";
};
export type NewTask = z.infer<typeof insertTaskSchema>;
export type UpdateTask = z.infer<typeof updateTaskSchema>;

/**
 * Query key factory for task-related queries
 * Centralizes all query keys for better maintainability
 */
const taskKeys = {
  all: ["tasks"] as const,
  lists: (limit?: number, offset?: number, filters?: TaskFilters) =>
    [...taskKeys.all, "list", limit, offset, filters] as const,
  details: () => [...taskKeys.all, "detail"] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
};

/**
 * Enhanced error handling with type checking and custom error messages
 */
const handleApiError = (error: unknown): never => {
  if (error instanceof Error) {
    throw new Error(`API Error: ${error.message}`);
  }
  throw new Error("An unknown error occurred while processing the request");
};

/**
 * Hook to fetch all tasks
 * Utilizes react-query for data fetching and caching
 * @param limit - Optional limit for the number of tasks to fetch
 * @param offset - Optional offset for pagination
 * @param filters - Optional filters for task querying
 */
export const useTasks = (
  limit?: number,
  offset?: number,
  filters?: TaskFilters,
) => {
  return useQuery({
    queryKey: taskKeys.lists(limit, offset, filters),
    queryFn: async () => {
      try {
        // Prepare query parameters
        const queryParams: Record<string, string | undefined> = {
          limit: limit?.toString(),
          offset: offset?.toString(),
        };

        // Add filters to query parameters if provided
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value) {
              queryParams[key] = value;
            }
          });
        }

        // Fetch tasks from the API
        const response = await client.api.tasks.list.$get({
          query: queryParams,
        });

        // Check if the response is successful
        if (!response.ok) {
          throw new Error("Error in fetching tasks");
        }

        // Parse and return the response data
        const data = await response.json();
        return data;
      } catch (error) {
        // Handle any errors that occur during the fetch
        handleApiError(error);
      }
    },
  });
};

/**
 * Hook to fetch a single task
 * @param id - The ID of the task to fetch
 * @returns {UseQueryResult} - The query result containing task data
 */
export const useTask = (id: string): UseQueryResult<Task> => {
  return useQuery({
    queryKey: taskKeys.detail(id),
    enabled: !!id, // Enable query only if id is provided
    queryFn: async () => {
      try {
        // Fetch task details from the API
        const response = await client.api.tasks[":id"].$get({
          param: { id },
        });

        // Check if the response is successful
        if (!response.ok) {
          throw new Error("Error in fetching task");
        }

        // Parse and return the response data
        const data = await response.json();
        return data;
      } catch (error) {
        // Handle any errors that occur during the fetch
        handleApiError(error);
      }
    },
  });
};

/**
 * Hook to create a new task
 * Provides optimistic updates and error handling
 * @returns {UseMutationResult} - The mutation result for creating a task
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { appliedFilters, limit, offset } = useTaskFiltersStore();

  return useMutation({
    mutationFn: async (newTask: NewTask) => {
      try {
        // Send a POST request to create a new task
        const response = await client.api.tasks.$post({ json: newTask });

        // Check if the response is successful
        if (!response.ok) {
          throw new Error("Error in creating task");
        }

        toast({
          title: "Task has been created.",
        });

        // Parse and return the response data
        const data = await response.json();
        return data;
      } catch (error) {
        // Handle any errors that occur during the mutation
        handleApiError(error);
      }
    },
    onMutate: async (newTask: NewTask) => {
      // Cancel any outgoing refetches to prevent race conditions
      await queryClient.cancelQueries({
        queryKey: taskKeys.lists(limit, offset, appliedFilters),
      });

      // Snapshot the previous tasks data
      const previousTasks = queryClient.getQueryData<Task[]>(
        taskKeys.lists(limit, offset, appliedFilters),
      );

      // Optimistically update the tasks list with the new task
      queryClient.setQueryData(
        taskKeys.lists(limit, offset, appliedFilters),
        (old: any) => ({
          ...old,
          tasks: [
            {
              ...newTask,
              id: uuidv4(),
              createdAt: new Date(),
              updatedAt: new Date(),
              optimisticStatus: "creating",
            },
            ...(old?.tasks || []),
          ],
        }),
      );

      // Return the snapshot for potential rollback
      return { previousTasks };
    },
    onError: (err, newTask, context) => {
      // Rollback to the previous tasks data on error
      queryClient.setQueryData(
        taskKeys.lists(limit, offset, appliedFilters),
        context?.previousTasks,
      );
    },
    onSettled: () => {
      // Invalidate queries to refetch the updated tasks list
      queryClient.invalidateQueries({
        queryKey: taskKeys.lists(limit, offset, appliedFilters),
      });
    },
  });
};

/**
 * Hook to update a task
 * Provides optimistic updates and error handling
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const { appliedFilters, limit, offset } = useTaskFiltersStore();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTask }) => {
      try {
        // Send a PATCH request to update the task

        console.log("data", data);

        const response = await client.api.tasks[":id"].$patch({
          param: { id },
          json: data,
        });

        // Check if the response is successful
        if (!response.ok) {
          throw new Error("Error in updating task");
        }

        toast({
          title: "Task has been updated.",
        });

        // Parse and return the response data
        const responseData = await response.json();
        return responseData;
      } catch (error) {
        // Handle any errors that occur during the mutation
        handleApiError(error);
      }
    },
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches to prevent race conditions
      await queryClient.cancelQueries({
        queryKey: taskKeys.lists(limit, offset, appliedFilters),
      });
      await queryClient.cancelQueries({
        queryKey: taskKeys.detail(id),
      });

      // Snapshot the previous tasks data
      const previousTasks = queryClient.getQueryData<Task[]>(
        taskKeys.lists(limit, offset, appliedFilters),
      );

      // Snapshot the previous task detail data
      const previousTask = queryClient.getQueryData<Task>(taskKeys.detail(id));

      if (previousTasks) {
        // Optimistically update the tasks list with the updated task
        queryClient.setQueryData(
          taskKeys.lists(limit, offset, appliedFilters),
          (old: any) => ({
            ...old,
            tasks: old.tasks.map((task: Task) =>
              task.id === id
                ? { ...task, ...data, optimisticStatus: "updating" }
                : task,
            ),
          }),
        );
      }

      // Optimistically update the task detail
      if (previousTask) {
        queryClient.setQueryData(taskKeys.detail(id), (old: any) => ({
          ...old,
          ...data,
          optimisticStatus: "updating",
        }));
      }

      // Return the snapshots for potential rollback
      return { previousTasks, previousTask };
    },
    onError: (err, { id }, context) => {
      // Rollback to the previous tasks data on error
      queryClient.setQueryData(
        taskKeys.lists(limit, offset, appliedFilters),
        context?.previousTasks,
      );
      // Rollback to the previous task detail on error
      queryClient.setQueryData(taskKeys.detail(id), context?.previousTask);
    },
    onSettled: (_, __, { id }) => {
      // Invalidate queries to refetch the updated task and tasks list
      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: taskKeys.lists(limit, offset, appliedFilters),
      });
    },
  });
};

/**
 * Hook to delete a task
 * Provides optimistic updates and error handling
 * @returns {UseMutationResult} - The mutation result for deleting a task
 */
export const useDeleteTask = (): UseMutationResult<void, unknown, string> => {
  const queryClient = useQueryClient();
  const { appliedFilters, limit, offset } = useTaskFiltersStore();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        // Send a DELETE request to remove the task
        const response = await client.api.tasks[":id"].$delete({
          param: { id },
        });

        // Check if the response is successful
        if (!response.ok) {
          throw new Error("Error in deleting task");
        }

        toast({
          title: "Task has been deleted.",
        });
      } catch (error) {
        // Handle any errors that occur during the mutation
        handleApiError(error);
      }
    },
    onMutate: async (id: string) => {
      // Cancel any outgoing refetches to prevent race conditions
      await queryClient.cancelQueries({
        queryKey: taskKeys.lists(limit, offset, appliedFilters),
      });

      // Snapshot the previous tasks data
      const previousTasks = queryClient.getQueryData<Task[]>(
        taskKeys.lists(limit, offset, appliedFilters),
      );

      // Optimistically update the tasks list to reflect the deletion
      if (previousTasks) {
        queryClient.setQueryData(
          taskKeys.lists(limit, offset, appliedFilters),
          (old: any) => ({
            ...old,
            tasks: old.tasks.map((task: Task) =>
              task.id === id ? { ...task, optimisticStatus: "deleting" } : task,
            ),
          }),
        );
      }
      // Snapshot the previous task detail data
      const previousTask = queryClient.getQueryData<Task>(taskKeys.detail(id));

      // Optimistically update the task detail
      if (previousTask) {
        queryClient.setQueryData(taskKeys.detail(id), (old: any) => ({
          ...old,
          isDeleted: true,
          deletedAt: new Date(),
          optimisticStatus: "deleting",
        }));
      }

      // Return the snapshot for potential rollback
      return { previousTasks };
    },
    onError: (err, id, context) => {
      // Rollback to the previous tasks data on error
      queryClient.setQueryData(
        taskKeys.lists(limit, offset, appliedFilters),
        context?.previousTasks,
      );
    },
    onSettled: (_, __, id) => {
      // Invalidate queries to refetch the updated tasks list
      queryClient.invalidateQueries({
        queryKey: taskKeys.lists(limit, offset, appliedFilters),
      });
      queryClient.invalidateQueries({
        queryKey: taskKeys.detail(id),
      });
    },
  });
};

/**
 * Hook to delete multiple tasks
 * Provides optimistic updates and error handling
 * @returns {UseMutationResult} - The mutation result for deleting multiple tasks
 */
export const useBulkDeleteTask = (): UseMutationResult<
  void,
  unknown,
  string[]
> => {
  const queryClient = useQueryClient();
  const { appliedFilters, limit, offset } = useTaskFiltersStore();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      try {
        // Send a POST request to delete multiple tasks
        const response = await client.api.tasks["bulk-delete"].$post({
          json: { ids },
        });

        // Check if the response is successful
        if (!response.ok) {
          throw new Error("Error in deleting tasks");
        }

        toast({
          title: "Tasks have been deleted.",
        });
      } catch (error) {
        // Handle any errors that occur during the mutation
        handleApiError(error);
      }
    },
    onMutate: async (ids: string[]) => {
      // Cancel any outgoing refetches to prevent race conditions
      await queryClient.cancelQueries({
        queryKey: taskKeys.lists(limit, offset, appliedFilters),
      });

      // Snapshot the previous tasks data
      const previousTasks = queryClient.getQueryData<Task[]>(
        taskKeys.lists(limit, offset, appliedFilters),
      );

      // Optimistically update the tasks list to reflect the deletions
      queryClient.setQueryData(
        taskKeys.lists(limit, offset, appliedFilters),
        (old: any) => ({
          ...old,
          tasks: old.tasks.map((task: Task) =>
            ids.includes(task.id)
              ? { ...task, optimisticStatus: "deleting" }
              : task,
          ),
        }),
      );

      // Return the snapshot for potential rollback
      return { previousTasks };
    },
    onError: (err, ids, context) => {
      // Rollback to the previous tasks data on error
      queryClient.setQueryData(
        taskKeys.lists(limit, offset, appliedFilters),
        context?.previousTasks,
      );
    },
    onSettled: () => {
      // Invalidate queries to refetch the updated tasks list
      queryClient.invalidateQueries({
        queryKey: taskKeys.lists(limit, offset, appliedFilters),
      });
    },
  });
};
