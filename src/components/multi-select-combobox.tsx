"use client";

import React, { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, ListFilter, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = {
  label: string;
  value: string;
};

type Props = {
  label: string;
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
};

export const MultiSelectCombobox = ({
  label,
  options,
  value,
  onChange,
  placeholder,
}: Props) => {
  const [open, setOpen] = useState(false);

  const handleChange = (currentValue: string) => {
    onChange(
      value.includes(currentValue)
        ? value.filter((val) => val !== currentValue)
        : [...value, currentValue],
    );
  };

  const selectedValue = () => {
    if (value.length === 0) return "";

    if (value.length === 1)
      return options.find((option) => option.value === value[0])?.label;

    return `${value.length} selected`;
  };

  const handleClear = () => {
    onChange([]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="button"
          aria-expanded={open}
          className="flex h-10 min-w-[200px] cursor-pointer items-center justify-start gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          onClick={() => setOpen(!open)}
        >
          <ListFilter className="size-4 shrink-0 text-muted-foreground" />
          {value.length > 0 && (
            <span className="text-muted-foreground">{label}</span>
          )}
          {selectedValue() ? selectedValue() : `Select ${label}...`}
          <span className="z-10 ml-auto flex items-center gap-2">
            {value.length > 0 && (
              <X
                className="z-10 size-4 shrink-0 cursor-pointer opacity-50 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation(); // Prevents the click from triggering other events
                  handleClear();
                }}
              />
            )}
            <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
          </span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder={placeholder || `Search ${label}...`} />
          <CommandList>
            <CommandEmpty>No {label} found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleChange}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(option.value)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
