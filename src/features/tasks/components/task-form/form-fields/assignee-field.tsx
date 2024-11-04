// External dependencies
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Check, UserIcon } from "lucide-react";

// Internal UI components
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ComboBox } from "@/components/combo-box";
import { CommandItem } from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Utilities and types
import { cn } from "@/lib/utils";
import { TaskFormData } from "../../../schema/add-task.schema";
import { UserProfile } from "../../../queries/user-profiles.queries";

/**
 * Props interface for the AssigneeField component
 * @interface AssigneeFieldProps
 */
interface AssigneeFieldProps {
  form: UseFormReturn<TaskFormData>;
  userProfiles?: UserProfile[];
  isLoading: boolean;
}

/**
 * UserItem Component
 * Renders a user profile with avatar and name in a consistent format
 *
 * @component
 * @param {Object} props - Component props
 * @param {UserProfile} props.userProfile - User profile data
 */
const UserItem: React.FC<{ userProfile: UserProfile }> = ({ userProfile }) => (
  <div
    className="flex items-center gap-2"
    role="option"
    aria-label={`${userProfile.name}`}
  >
    <Avatar className="size-6">
      <AvatarImage
        className="size-6 object-cover"
        src={userProfile.avatarUrl || ""}
        alt={`${userProfile.name}'s avatar`}
        loading="lazy"
      />
      <AvatarFallback aria-label={`${userProfile.name}'s default avatar`}>
        <UserIcon
          className="size-6 rounded-full bg-gray-100 p-1 text-gray-400"
          aria-hidden="true"
        />
      </AvatarFallback>
    </Avatar>
    <span className="truncate">{userProfile.name}</span>
  </div>
);

/**
 * AssigneeField Component
 * A form field component for selecting task assignees with autocomplete functionality
 *
 * @component
 * @param {AssigneeFieldProps} props - Component props
 */
export const AssigneeField: React.FC<AssigneeFieldProps> = ({
  form,
  userProfiles = [],
  isLoading,
}) => (
  <FormField
    control={form.control}
    name="assigneeId"
    render={({ field }) => (
      <FormItem>
        <FormLabel htmlFor="assignee-select">Assignee</FormLabel>
        <FormControl>
          <ComboBox
            isLoading={isLoading}
            placeholder="Select assignee..."
            selectedItem={(() => {
              const userProfile = userProfiles.find(
                (profile) => profile.id === field.value,
              );
              return userProfile ? (
                <UserItem userProfile={userProfile} />
              ) : (
                "Select assignee..."
              );
            })()}
            // Accessibility attributes
            aria-label="Select task assignee"
            aria-invalid={!!form.formState.errors.assigneeId}
            aria-describedby="assignee-error"
          >
            {userProfiles.map((profile) => (
              <CommandItem
                key={profile.id}
                value={profile.name}
                onSelect={() => field.onChange(profile.id)}
                role="option"
                aria-selected={field.value === profile.id}
                className="cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    field.value === profile.id ? "opacity-100" : "opacity-0",
                  )}
                  aria-hidden="true"
                />
                <UserItem userProfile={profile} />
              </CommandItem>
            ))}
          </ComboBox>
        </FormControl>
        <FormMessage id="assignee-error" />
      </FormItem>
    )}
  />
);

// Default export for cleaner imports
export default AssigneeField;
