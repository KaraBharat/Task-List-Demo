import { create } from "zustand";
import { UserProfile } from "@/features/tasks/queries/user-profiles.queries";

// Key for local storage
const USER_PROFILE_STORAGE_KEY = "userProfile";

/**
 * Interface defining the state and actions for the auth store
 */
interface AuthStoreState {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
  clearUserProfile: () => void;
}

/**
 * Custom hook for managing authentication state
 * Utilizes Zustand for state management
 */
export const useAuthStore = create<AuthStoreState>((set) => {
  // Load user profile from local storage if available
  const storedUserProfile =
    typeof window !== "undefined" &&
    localStorage.getItem(USER_PROFILE_STORAGE_KEY);
  const initialUserProfile = storedUserProfile
    ? JSON.parse(storedUserProfile)
    : null;

  return {
    // Initial state
    userProfile: initialUserProfile,

    // Actions
    setUserProfile: (profile: UserProfile | null) => {
      // Update state
      set({ userProfile: profile });

      // Persist to local storage
      if (profile) {
        localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(profile));
      } else {
        localStorage.removeItem(USER_PROFILE_STORAGE_KEY);
      }
    },

    clearUserProfile: () => {
      // Clear state
      set({ userProfile: null });

      // Remove from local storage
      localStorage.removeItem(USER_PROFILE_STORAGE_KEY);
    },
  };
});
