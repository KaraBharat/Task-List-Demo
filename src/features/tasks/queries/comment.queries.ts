import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { client } from "@/lib/hono";
import {
  insertTaskCommentSchema,
  updateTaskCommentSchema,
  taskCommentSchema,
} from "@/database/schema";
import { useAuthStore } from "@/stores/auth-store";
import { v4 as uuidv4 } from "uuid";

/**
 * Query key factory for task comment-related queries
 */
const taskCommentKeys = {
  all: ["taskComments"] as const,
  lists: (taskId: string) => [...taskCommentKeys.all, "list", taskId] as const,
  details: () => [...taskCommentKeys.all, "detail"] as const,
  detail: (id: string) => [...taskCommentKeys.details(), id] as const,
};

/**
 * Helper function to handle API errors
 * @param error - The error object caught in the try-catch block
 * @throws {Error} - Throws an error with a descriptive message
 */
const handleApiError = (error: unknown): never => {
  if (error instanceof Error) {
    throw new Error(`API Error: ${error.message}`);
  }
  throw new Error("An unknown error occurred");
};

/**
 * Hook to fetch all task comments
 * @param limit - Optional limit for the number of comments to fetch
 * @param offset - Optional offset for pagination
 * @param taskId - Optional task ID to filter comments
 * @returns {UseQueryResult} - The query result containing task comment data
 */
export const useTaskComments = (taskId: string) => {
  return useQuery({
    queryKey: taskCommentKeys.lists(taskId),
    queryFn: async () => {
      try {
        const response = await client.api["task-comments"][":taskId"].$get({
          param: { taskId },
        });

        if (!response.ok) {
          throw new Error("Error in fetching task comments");
        }

        const data = (await response.json()) as TaskComment[];
        return data;
      } catch (error) {
        handleApiError(error);
      }
    },
  });
};

/**
 * Hook to create a new task comment
 * @returns {UseMutationResult} - The mutation result for creating a task comment
 */
export const useCreateTaskComment = () => {
  const queryClient = useQueryClient();

  const { userProfile } = useAuthStore();

  return useMutation({
    mutationFn: async (newComment: z.infer<typeof insertTaskCommentSchema>) => {
      try {
        const response = await client.api["task-comments"][":taskId"].$post({
          param: { taskId: newComment.taskId },
          json: newComment,
        });

        if (!response.ok) {
          throw new Error("Error in creating task comment");
        }

        const data = await response.json();
        return data;
      } catch (error) {
        handleApiError(error);
      }
    },
    onMutate: async (newComment) => {
      if (!userProfile?.id) {
        return;
      }

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: taskCommentKeys.lists(newComment.taskId),
      });

      // Snapshot the previous value
      const previousComments = queryClient.getQueryData<TaskComment[]>(
        taskCommentKeys.lists(newComment.taskId),
      );

      // Optimistically update the comments list
      const optimisticComment: TaskComment = {
        ...newComment,
        id: uuidv4(),
        taskId: newComment.taskId,
        createdAt: new Date(),
        updatedAt: new Date(),
        deleted: false,
        userId: userProfile?.id,
        authorName: userProfile?.name ?? null,
        authorAvatarUrl: userProfile?.avatarUrl ?? null,
        isDeleted: false,
        deletedAt: null,
      };

      queryClient.setQueryData<TaskComment[]>(
        taskCommentKeys.lists(newComment.taskId),
        (old = []) => [optimisticComment, ...old],
      );

      // Return context with the previous comments
      return { previousComments };
    },
    onError: (err, newComment, context) => {
      // If the mutation fails, roll back to the previous value
      if (context?.previousComments) {
        queryClient.setQueryData(
          taskCommentKeys.lists(newComment.taskId),
          context.previousComments,
        );
      }
    },
    onSettled: (_, __, variables) => {
      // Always refetch after error or success to ensure data consistency
      queryClient.invalidateQueries({
        queryKey: taskCommentKeys.lists(variables.taskId),
      });
    },
  });
};

/**
 * Hook to delete a task comment
 * @returns {UseMutationResult} - The mutation result for deleting a task comment
 */
export const useDeleteTaskComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, taskId }: { id: string; taskId: string }) => {
      try {
        const response = await client.api["task-comments"][":id"].$delete({
          param: { id },
        });

        if (!response.ok) {
          throw new Error("Error in deleting task comment");
        }
      } catch (error) {
        handleApiError(error);
      }
    },
    onMutate: async ({ id, taskId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: taskCommentKeys.lists(taskId),
      });

      // Snapshot the previous value
      const previousComments = queryClient.getQueryData<TaskComment[]>(
        taskCommentKeys.lists(taskId),
      );

      // Optimistically update to mark the comment as deleted
      if (previousComments) {
        queryClient.setQueryData<TaskComment[]>(
          taskCommentKeys.lists(taskId),
          (old = []) =>
            old.map((comment) =>
              comment.id === id
                ? { ...comment, isDeleted: true, deletedAt: new Date() }
                : comment,
            ),
        );
      }

      // Return context with the previous comments
      return { previousComments };
    },
    onError: (_, { taskId }, context) => {
      // If the mutation fails, roll back to the previous value
      if (context?.previousComments) {
        queryClient.setQueryData(
          taskCommentKeys.lists(taskId),
          context.previousComments,
        );
      }
    },
    onSuccess: (_, { id, taskId }) => {
      queryClient.invalidateQueries({
        queryKey: taskCommentKeys.lists(taskId),
      });
      queryClient.removeQueries({ queryKey: taskCommentKeys.detail(id) });
    },
  });
};

// Export types for use in components
export type TaskComment = z.infer<typeof taskCommentSchema> & {
  authorName: string | null;
  authorAvatarUrl: string | null;
};
export type NewTaskComment = z.infer<typeof insertTaskCommentSchema>;
export type UpdateTaskComment = z.infer<typeof updateTaskCommentSchema>;
