// External dependencies
import React from "react";
import { UseFormReturn } from "react-hook-form";

// Internal UI components
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DatePicker } from "@/components/date-picker";

// Types and schemas
import { TaskFormData } from "../../../schema/add-task.schema";

/**
 * Props interface for the DateField component
 * @interface DateFieldProps
 * @property {UseFormReturn<TaskFormData>} form - Form instance from react-hook-form
 * @property {keyof TaskFormData} name - Field name that matches TaskFormData keys
 * @property {string} label - Label text for the date picker
 */
interface DateFieldProps {
  form: UseFormReturn<TaskFormData>;
  name: keyof TaskFormData;
  label: string;
}

/**
 * DateField Component
 * A form field component for date selection with validation and accessibility features.
 * Uses a custom DatePicker component and integrates with react-hook-form.
 *
 * @component
 * @param {DateFieldProps} props - Component props
 * @returns {JSX.Element} Rendered form field component
 */
export const DateField: React.FC<DateFieldProps> = ({ form, name, label }) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        {/* Label with proper htmlFor connection to date picker */}
        <FormLabel htmlFor={name}>{label}</FormLabel>
        <FormControl>
          <DatePicker
            // Date value handling
            date={field.value ? new Date(field.value) : undefined}
            setDate={(date) => field.onChange(date?.toISOString())}
            fromDate={new Date()} // Ensures dates from today onwards
            // Accessibility attributes
            aria-label={`Select ${label.toLowerCase()}`}
            aria-invalid={!!form.formState.errors[name]}
            aria-describedby={`${name}-error`}
            aria-expanded="false"
          />
        </FormControl>
        {/* Error message with proper ID for aria-describedby */}
        <FormMessage id={`${name}-error`} />
      </FormItem>
    )}
  />
);

// Default export for cleaner imports
export default DateField;
