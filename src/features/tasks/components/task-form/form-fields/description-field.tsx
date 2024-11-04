// External dependencies
import React from "react";
import dynamic from "next/dynamic";
import { UseFormReturn } from "react-hook-form";

// Internal UI components
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Types and schemas
import { TaskFormData } from "../../../schema/add-task.schema";

/**
 * Dynamically imported TipTap editor component to avoid SSR issues
 * SSR is disabled as TipTap requires browser APIs
 */
const MinimalTiptapEditor = dynamic(
  () =>
    import("@/components/minimal-tiptap").then(
      (mod) => mod.MinimalTiptapEditor,
    ),
  { ssr: false },
);

/**
 * Props interface for the DescriptionField component
 * @interface DescriptionFieldProps
 * @property {UseFormReturn<TaskFormData>} form - Form instance from react-hook-form
 */
interface DescriptionFieldProps {
  form: UseFormReturn<TaskFormData>;
}

/**
 * DescriptionField Component
 * A rich text editor field component using TipTap for task descriptions.
 * Integrates with react-hook-form and provides accessibility features.
 *
 * @component
 * @param {DescriptionFieldProps} props - Component props
 * @returns {JSX.Element} Rendered form field component
 */
export const DescriptionField: React.FC<DescriptionFieldProps> = ({ form }) => (
  <FormField
    control={form.control}
    name="description"
    render={({ field }) => (
      <FormItem>
        {/* Label with proper htmlFor connection to editor */}
        <FormLabel htmlFor="description">Description</FormLabel>
        <FormControl>
          <MinimalTiptapEditor
            {...field}
            value={field.value}
            onChange={field.onChange}
            // Styling classes
            className="w-full"
            editorContentClassName="p-4"
            editorClassName="focus:outline-none"
            // Editor configuration
            output="html"
            placeholder="Enter task description"
            editable={true}
            // Accessibility attributes
            aria-label="Task description editor"
            aria-invalid={!!form.formState.errors.description}
            aria-describedby="description-error"
            aria-multiline="true"
          />
        </FormControl>
        {/* Error message with proper ID for aria-describedby */}
        <FormMessage id="description-error" />
      </FormItem>
    )}
  />
);

// Default export for cleaner imports
export default DescriptionField;
