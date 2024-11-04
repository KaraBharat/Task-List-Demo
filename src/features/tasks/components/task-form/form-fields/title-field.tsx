// External dependencies
import React from 'react';
import { UseFormReturn } from 'react-hook-form';

// Internal dependencies - UI Components
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// Internal dependencies - Types
import { TaskFormData } from '../../../schema/add-task.schema';

/**
 * Props interface for TitleField component
 * @interface TitleFieldProps
 * @property {UseFormReturn<TaskFormData>} form - Form instance from react-hook-form
 */
interface TitleFieldProps {
  form: UseFormReturn<TaskFormData>;
}

/**
 * TitleField Component
 * Renders a form field for task title input with validation and accessibility features
 *
 * @component
 * @param {TitleFieldProps} props - Component props
 * @returns {JSX.Element} Rendered form field
 *
 * @example
 * ```tsx
 * <TitleField form={form} />
 * ```
 */
export const TitleField: React.FC<TitleFieldProps> = ({ form }) => {
  // Get error state for accessibility
  const hasError = !!form.formState.errors.title;
  const errorId = hasError ? 'title-error' : undefined;

  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel 
            htmlFor="title"
            className="text-sm font-medium"
          >
            Title
            <span className="text-destructive ml-1" aria-hidden="true">*</span>
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              id="title"
              type="text"
              placeholder="Enter task title"
              // Accessibility attributes
              aria-required="true"
              aria-invalid={hasError}
              aria-describedby={errorId}
              // Additional attributes for better UX
              autoComplete="off"
              autoCapitalize="none"
              spellCheck="true"
              // CSS classes for validation states
              className={`w-full ${hasError ? 'border-destructive' : ''}`}
              // Optional attributes for better mobile experience
              enterKeyHint="next"
            />
          </FormControl>
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
 * Default export
 * Allows for both named and default imports
 */
export default TitleField;