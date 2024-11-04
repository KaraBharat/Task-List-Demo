// External dependencies
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

// Internal UI components
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Utilities
import { cn } from "@/lib/utils";

/**
 * Props interface for DatePicker component
 * @interface DatePickerProps
 * @property {Date} [date] - Currently selected date
 * @property {(date?: Date) => void} setDate - Callback function to update selected date
 * @property {Date} [fromDate] - Optional minimum selectable date
 */
interface DatePickerProps {
  date?: Date;
  setDate: (date?: Date) => void;
  fromDate?: Date;
  id?: string;
  name?: string;
}

/**
 * DatePicker Component
 * A customizable date picker component with popover calendar
 *
 * @component
 * @example
 * ```tsx
 * <DatePicker
 *   date={selectedDate}
 *   setDate={handleDateChange}
 *   fromDate={new Date()}
 * />
 * ```
 */
export function DatePicker({
  date,
  setDate,
  fromDate,
  id,
  name,
}: DatePickerProps) {
  // Format the selected date for display
  const formattedDate = date ? format(date, "PPP") : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          name={name}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
          aria-label="Choose date"
          aria-expanded="false"
          aria-haspopup="dialog"
        >
          <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
          {formattedDate ? (
            <span aria-live="polite">{formattedDate}</span>
          ) : (
            <span className="text-muted-foreground">Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto p-0"
        role="dialog"
        aria-label="Calendar date picker"
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          fromDate={fromDate}
          // Accessibility props
          aria-label="Select date"
          className="rounded-md border"
        />
      </PopoverContent>
    </Popover>
  );
}

// Default export for cleaner imports
export default DatePicker;
