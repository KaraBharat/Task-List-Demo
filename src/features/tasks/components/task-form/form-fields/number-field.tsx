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
import { Input } from "@/components/ui/input";

// Types and schemas
import { TaskFormData } from "../../../schema/add-task.schema";

/**
 * Props interface for the NumberField component
 * @interface NumberFieldProps
 * @property {UseFormReturn<TaskFormData>} form - Form instance from react-hook-form
 * @property {keyof TaskFormData} name - Field name that matches TaskFormData keys
 * @property {string} label - Label text for the input field
 * @property {string} placeholder - Placeholder text for the input field
 */
interface NumberFieldProps {
  form: UseFormReturn<TaskFormData>;
  name: keyof TaskFormData;
  label: string;
  placeholder: string;
}

/**
 * NumberField Component
 * A reusable form field component for numerical inputs with validation and accessibility features.
 * Supports different step values for story points (1) and other numerical fields (0.5).
 *
 * @component
 * @param {NumberFieldProps} props - Component props
 * @returns {JSX.Element} Rendered form field component
 */
export const NumberField: React.FC<NumberFieldProps> = ({
  form,
  name,
  label,
  placeholder,
}) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        {/* Label with proper htmlFor connection to input */}
        <FormLabel htmlFor={name}>{label}</FormLabel>
        <FormControl>
          <Input
            {...field}
            id={name}
            type="number"
            placeholder={placeholder}
            onChange={(e) => {
              const value = e.target.valueAsNumber;
              field.onChange(isNaN(value) ? 0 : value);
            }}
            // Accessibility attributes
            aria-label={label}
            aria-invalid={!!form.formState.errors[name]}
            aria-describedby={`${name}-error`}
            role="spinbutton"
            // Input constraints
            min={0}
            step={1}
          />
        </FormControl>
        {/* Error message with proper ID for aria-describedby */}
        <FormMessage id={`${name}-error`} />
      </FormItem>
    )}
  />
);

// Default export for cleaner imports
export default NumberField;
