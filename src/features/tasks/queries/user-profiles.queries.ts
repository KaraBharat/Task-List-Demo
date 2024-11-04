import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { client } from "@/lib/hono";
import { userProfileSchema } from "@/database/schema";

/**
 * Query key factory for user-related queries
 */
const userProfilesKeys = {
  all: ["user-profiles"] as const,
  lists: () => [...userProfilesKeys.all, "list"] as const,
  details: () => [...userProfilesKeys.all, "detail"] as const,
  detail: (id: string) => [...userProfilesKeys.details(), id] as const,
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
  throw new Error("An unknown error occurred", { cause: error });
};

/**
 * Hook to fetch all users
 * @returns {UseQueryResult} - The query result containing user data
 */
export const useUserProfiles = () => {
  return useQuery({
    queryKey: userProfilesKeys.lists(),
    queryFn: async () => {
      try {
        const response = await client.api["user-profiles"].$get();

        if (!response.ok) {
          throw new Error("Error in fetching users");
        }

        const data = await response.json();
        return data;
      } catch (error) {
        handleApiError(error);
      }
    },
  });
};

/**
 * Hook to fetch a single user
 * @param id - The ID of the user to fetch
 * @returns {UseQueryResult} - The query result containing user data
 */
export const useUserProfile = (id: string) => {
  return useQuery({
    queryKey: userProfilesKeys.detail(id),
    queryFn: async () => {
      try {
        const response = await client.api["user-profiles"][":id"].$get({
          param: { id },
        });

        if (!response.ok) {
          throw new Error("Error in fetching user");
        }

        const data = await response.json();
        return data;
      } catch (error) {
        handleApiError(error);
      }
    },
  });
};

// Export types for use in components
export type UserProfile = Omit<
  z.infer<typeof userProfileSchema>,
  "createdAt" | "updatedAt" | "deletedAt" | "isDeleted"
>;
