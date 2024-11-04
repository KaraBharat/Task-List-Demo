"use client";

// External imports
import { useEffect } from "react";
import { useIsClient } from "@uidotdev/usehooks";

// Internal imports
import TaskList from "@/features/tasks";
import { useAuthStore } from "@/stores/auth-store";

// Types
interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  authId: string;
}

/**
 * Tasks Page Component
 * Handles user authentication state and renders the task list
 *
 * @returns {JSX.Element} The rendered Tasks page
 */
export default function TasksPage(): JSX.Element {
  // Hooks
  const { setUserProfile } = useAuthStore();
  const isClient = useIsClient();

  /**
   * Mock user profile data
   * TODO: Replace with actual authentication implementation
   */
  const mockUserProfile: UserProfile = {
    id: "1d298a3d-9602-449b-8cc7-b68658172337",
    email: "frank.miller@example.com",
    name: "Frank Miller",
    avatarUrl:
      "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=2952&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    authId: "", // Will be set after implementing authentication
  };

  /**
   * Set up user profile on client-side initialization
   */
  useEffect(() => {
    if (isClient) {
      setUserProfile(mockUserProfile);
    }
  }, [isClient, setUserProfile]);

  return (
    <main
      role="main"
      aria-label="Tasks management page"
      className="min-h-screen"
    >
      <TaskList />
    </main>
  );
}
