// External dependencies
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
  useInfiniteQuery,
  InfiniteData,
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
import { TaskFilters, TaskResponse } from "../types";
import { useTaskFiltersStore } from "@/stores/task-filters-store";
import { toast } from "@/hooks/use-toast";
import { DEFAULT_PAGE_SIZE } from "@/constants";

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
 * Hook to fetch tasks with infinite scrolling
 * @param limit - Number of items per page
 * @param filters - Optional filters for task querying
 */
export const useTasksInfinite = (
  limit = DEFAULT_PAGE_SIZE,
  filters?: TaskFilters,
) => {
  return useInfiniteQuery({
    queryKey: taskKeys.lists(limit, undefined, filters),
    queryFn: async ({ pageParam = 0 }) => {
      try {
        // Prepare query parameters
        const queryParams: Record<string, string | undefined> = {
          limit: limit.toString(),
          offset: (pageParam * limit).toString(),
        };

        // Add filters to query parameters if provided
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value) {
              queryParams[key] = value;
            }
          });
        }

        const response = await client.api.tasks.list.$get({
          query: queryParams,
        });

        if (!response.ok) {
          throw new Error("Error in fetching tasks");
        }

        const data = await response.json();
        return data;
      } catch (error) {
        handleApiError(error);
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      // If the last page has fewer items than the limit, we've reached the end
      if (!lastPage?.tasks || lastPage.tasks.length < limit) {
        return undefined;
      }
      // Return the next page number
      return allPages.length;
    },
    initialPageParam: 0,
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
 * Hook to create a new task with infinite scrolling
 */
export const useCreateTaskWithInfinite = () => {
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
        queryKey: taskKeys.lists(limit, undefined, appliedFilters),
      });

      // Snapshot the previous tasks data
      const previousData = queryClient.getQueryData<InfiniteData<TaskResponse>>(
        taskKeys.lists(limit, undefined, appliedFilters),
      );

      // Optimistically update the tasks list with the new task
      queryClient.setQueryData(
        taskKeys.lists(limit, undefined, appliedFilters),
        (old: InfiniteData<TaskResponse> | undefined) => {
          if (!old) return old;

          const optimisticTask = {
            ...newTask,
            id: uuidv4(),
            createdAt: new Date(),
            updatedAt: new Date(),
            optimisticStatus: "creating",
            assigneeName: null,
            assigneeAvatarUrl: null,
            reporterName: null,
            reporterAvatarUrl: null,
          };

          return {
            ...old,
            pages: [
              // Update first page with new task
              {
                ...old.pages[0],
                tasks: [optimisticTask, ...old.pages[0].tasks],
                pagination: {
                  ...old.pages[0].pagination,
                  total: old.pages[0].pagination.total + 1,
                },
              },
              // Keep other pages unchanged
              ...old.pages.slice(1),
            ],
          };
        },
      );

      // Return the snapshot for potential rollback
      return { previousData };
    },
    onError: (err, newTask, context) => {
      // Rollback to the previous tasks data on error
      queryClient.setQueryData(
        taskKeys.lists(limit, undefined, appliedFilters),
        context?.previousData,
      );
    },
    onSettled: () => {
      // Invalidate queries to refetch the updated tasks list
      queryClient.invalidateQueries({
        queryKey: taskKeys.lists(limit, undefined, appliedFilters),
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
 * Hook to update a task with infinite scrolling
 */
export const useUpdateTaskWithInfinite = () => {
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
        queryKey: taskKeys.lists(limit, undefined, appliedFilters),
      });
      await queryClient.cancelQueries({
        queryKey: taskKeys.detail(id),
      });

      // Snapshot the previous tasks data
      const previousData = queryClient.getQueryData<InfiniteData<TaskResponse>>(
        taskKeys.lists(limit, undefined, appliedFilters),
      );

      // Snapshot the previous task detail data
      const previousTask = queryClient.getQueryData<Task>(taskKeys.detail(id));

      // Optimistically update the tasks list with the updated task
      queryClient.setQueryData(
        taskKeys.lists(limit, undefined, appliedFilters),
        (old: InfiniteData<TaskResponse> | undefined) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              tasks: page.tasks.map((task: Task) =>
                task.id === id
                  ? { ...task, ...data, optimisticStatus: "updating" }
                  : task,
              ),
            })),
          };
        },
      );

      // Optimistically update the task detail
      if (previousTask) {
        queryClient.setQueryData(taskKeys.detail(id), (old: any) => ({
          ...old,
          ...data,
          optimisticStatus: "updating",
        }));
      }

      // Return the snapshots for potential rollback
      return { previousData, previousTask };
    },
    onError: (err, { id }, context) => {
      // Rollback to the previous tasks data on error
      queryClient.setQueryData(
        taskKeys.lists(limit, undefined, appliedFilters),
        context?.previousData,
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
        queryKey: taskKeys.lists(limit, undefined, appliedFilters),
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
 * Hook to delete a task with infinite scrolling
 * Provides optimistic updates and error handling
 * @returns {UseMutationResult} - The mutation result for deleting a task
 */
export const useDeleteTaskWithInfinite = (): UseMutationResult<
  void,
  unknown,
  string
> => {
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
        queryKey: taskKeys.lists(limit, undefined, appliedFilters),
      });
      await queryClient.cancelQueries({
        queryKey: taskKeys.detail(id),
      });

      // Snapshot the previous tasks data
      const previousData = queryClient.getQueryData<InfiniteData<any>>(
        taskKeys.lists(limit, undefined, appliedFilters),
      );

      // Snapshot the previous task detail data
      const previousTask = queryClient.getQueryData<Task>(taskKeys.detail(id));

      // Optimistically update the tasks list to reflect the deletion
      queryClient.setQueryData(
        taskKeys.lists(limit, undefined, appliedFilters),
        (old: InfiniteData<any> | undefined) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              tasks: page.tasks.map((task: Task) =>
                task.id === id
                  ? { ...task, optimisticStatus: "deleting" }
                  : task,
              ),
              pagination: {
                ...page.pagination,
                total: page.pagination.total - 1,
              },
            })),
          };
        },
      );

      // Optimistically update the task detail
      if (previousTask) {
        queryClient.setQueryData(taskKeys.detail(id), (old: any) => ({
          ...old,
          isDeleted: true,
          deletedAt: new Date(),
          optimisticStatus: "deleting",
        }));
      }

      // Return the snapshots for potential rollback
      return { previousData, previousTask };
    },
    onError: (err, id, context) => {
      // Rollback to the previous tasks data on error
      queryClient.setQueryData(
        taskKeys.lists(limit, undefined, appliedFilters),
        context?.previousData,
      );
      // Rollback to the previous task detail on error
      queryClient.setQueryData(taskKeys.detail(id), context?.previousTask);
    },
    onSettled: (_, __, id) => {
      // Invalidate queries to refetch the updated tasks list
      queryClient.invalidateQueries({
        queryKey: taskKeys.lists(limit, undefined, appliedFilters),
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

/**
 * Hook to delete multiple tasks with infinite scrolling
 * Provides optimistic updates and error handling
 * @returns {UseMutationResult} - The mutation result for deleting multiple tasks
 */
export const useBulkDeleteTaskWithInfinite = (): UseMutationResult<
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
        queryKey: taskKeys.lists(limit, undefined, appliedFilters),
      });

      // Cancel any outgoing detail queries for the tasks being deleted
      for (const id of ids) {
        await queryClient.cancelQueries({
          queryKey: taskKeys.detail(id),
        });
      }

      // Snapshot the previous tasks data
      const previousData = queryClient.getQueryData<InfiniteData<any>>(
        taskKeys.lists(limit, undefined, appliedFilters),
      );

      // Snapshot the previous task details data
      const previousTasks = Object.fromEntries(
        ids.map((id) => [
          id,
          queryClient.getQueryData<Task>(taskKeys.detail(id)),
        ]),
      );

      // Optimistically update the tasks list to reflect the deletions
      queryClient.setQueryData(
        taskKeys.lists(limit, undefined, appliedFilters),
        (old: InfiniteData<any> | undefined) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => {
              const deletedCount = page.tasks.filter((task: Task) =>
                ids.includes(task.id),
              ).length;

              return {
                ...page,
                tasks: page.tasks.map((task: Task) =>
                  ids.includes(task.id)
                    ? { ...task, optimisticStatus: "deleting" }
                    : task,
                ),
                pagination: {
                  ...page.pagination,
                  total: page.pagination.total - deletedCount,
                },
              };
            }),
          };
        },
      );

      // Optimistically update each task's detail view
      ids.forEach((id) => {
        const previousTask = queryClient.getQueryData<Task>(
          taskKeys.detail(id),
        );
        if (previousTask) {
          queryClient.setQueryData(taskKeys.detail(id), (old: any) => ({
            ...old,
            isDeleted: true,
            deletedAt: new Date(),
            optimisticStatus: "deleting",
          }));
        }
      });

      // Return the snapshots for potential rollback
      return { previousData, previousTasks };
    },
    onError: (err, ids, context) => {
      // Rollback to the previous tasks data on error
      queryClient.setQueryData(
        taskKeys.lists(limit, undefined, appliedFilters),
        context?.previousData,
      );

      // Rollback each task's detail view
      if (context?.previousTasks) {
        Object.entries(context.previousTasks).forEach(([id, task]) => {
          if (task) {
            queryClient.setQueryData(taskKeys.detail(id), task);
          }
        });
      }
    },
    onSettled: (_, __, ids) => {
      // Invalidate queries to refetch the updated tasks list
      queryClient.invalidateQueries({
        queryKey: taskKeys.lists(limit, undefined, appliedFilters),
      });

      // Invalidate each task's detail query
      ids.forEach((id) => {
        queryClient.invalidateQueries({
          queryKey: taskKeys.detail(id),
        });
      });
    },
  });
};
