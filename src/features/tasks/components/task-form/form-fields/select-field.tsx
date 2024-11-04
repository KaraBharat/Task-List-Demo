// External dependencies
import React from "react";
import { UseFormReturn } from "react-hook-form";

// Internal dependencies - UI Components
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Internal dependencies - Types
import { TaskFormData } from "../../../schema/add-task.schema";

/**
 * Props interface for SelectField component
 * @interface SelectFieldProps
 * @property {UseFormReturn<TaskFormData>} form - Form instance from react-hook-form
 * @property {keyof TaskFormData} name - Field name from TaskFormData
 * @property {string} label - Label text for the select field
 * @property {Array<Option>} options - Array of options for the select field
 * @property {string} placeholder - Placeholder text when no option is selected
 */
interface SelectFieldProps {
  form: UseFormReturn<TaskFormData>;
  name: keyof TaskFormData;
  label: string;
  options: Array<{ value: string; label: string }>;
  placeholder: string;
}

/**
 * SelectField Component
 * Renders a form field for selecting options with validation and accessibility features
 *
 * @component
 * @param {SelectFieldProps} props - Component props
 * @returns {JSX.Element} Rendered select field
 *
 * @example
 * ```tsx
 * <SelectField
 *   form={form}
 *   name="priority"
 *   label="Priority"
 *   options={priorityOptions}
 *   placeholder="Select priority"
 * />
 * ```
 */
export const SelectField: React.FC<SelectFieldProps> = ({
  form,
  name,
  label,
  options,
  placeholder,
}) => {
  // Get error state for accessibility
  const hasError = !!form.formState.errors[name];
  const errorId = hasError ? `${name}-error` : undefined;
  const fieldId = `field-${name}`;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={fieldId} className="text-sm font-medium">
            {label}
            <span className="ml-1 text-destructive" aria-hidden="true">
              *
            </span>
          </FormLabel>
          <Select onValueChange={field.onChange} value={field.value as string}>
            <FormControl>
              <SelectTrigger
                id={fieldId}
                aria-label={`Select ${label.toLowerCase()}`}
                aria-invalid={hasError}
                aria-describedby={errorId}
                className={hasError ? "border-destructive" : ""}
              >
                <SelectValue
                  placeholder={placeholder}
                  aria-label={field.value ? undefined : placeholder}
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent
              position="popper"
              sideOffset={4}
              className="max-h-[300px]"
              role="listbox"
              aria-label={`${label} options`}
            >
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  role="option"
                  aria-selected={field.value === option.value}
                  className="cursor-pointer"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage
            id={errorId}
            className="text-sm text-destructive"
            role="alert"
          />
        </FormItem>
      )}
    />
  );
};

/**
 * Memoized version of SelectField for performance optimization
 * Only re-renders when props change
 */
export const MemoizedSelectField = React.memo(SelectField);

/**
 * Default export
 * Allows for both named and default imports
 */
export default SelectField;
