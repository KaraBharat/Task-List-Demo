"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, ListFilter } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/**
 * Props for the DateRangePicker component
 */
type DateRangePickerProps = {
  onChange: (range: DateRange | undefined) => void;
  label: string;
  value: DateRange | undefined;
};

/**
 * DateRangePicker component for selecting a date range
 */
export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onChange,
  label,
  value,
}) => {
  // Internal state for date range
  const [date, setDate] = useState<DateRange | undefined>(value);

  // Update internal state when value prop changes (e.g., when filters are cleared)
  useEffect(() => {
    setDate(value);
  }, [value]);

  /**
   * Handle date range selection
   */
  const handleSelect = (selectedRange: DateRange | undefined) => {
    setDate(selectedRange);
    onChange(selectedRange);
  };

  /**
   * Format the date range for display
   */
  const formatDateRange = () => {
    if (date?.from && date?.to) {
      return `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`;
    }
    return `Select ${label} range`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex min-w-[250px] items-center justify-start gap-2"
          aria-label={`Select ${label} date range`}
        >
          <ListFilter
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <CalendarIcon className="size-4 shrink-0" aria-hidden="true" />
          {formatDateRange()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={handleSelect}
          numberOfMonths={2}
          aria-label={`${label} date range calendar`}
        />
      </PopoverContent>
    </Popover>
  );
};
