"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export interface AsyncComboboxOption {
  value: string
  label: string
  raw?: any
}

export interface AsyncComboboxProps {
  /** Currently selected value (string id), matches the shape used by react-hook-form fields. */
  value?: string | null
  onChange: (value: string, option?: AsyncComboboxOption) => void
  /** Options for the *current* search term, coming from a server-side search hook. */
  options: AsyncComboboxOption[]
  /** Whether the current search request is in flight. */
  isLoading?: boolean
  /** Controlled search term (what the user has typed into the combobox). */
  searchTerm: string
  /** Called on every keystroke; the parent typically feeds this straight
   * into a debounced search hook (e.g. `useFarmerSearch`). */
  onSearchTermChange: (term: string) => void
  /** Fallback label to show for the selected value before it has appeared in any
   * search result page - critical for edit forms where a value is preselected. */
  selectedLabel?: string
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
  className?: string
  triggerClassName?: string
  contentClassName?: string
  required?: boolean
}

/**
 * A searchable, server-driven combobox. The parent is expected to own the
 * search-term state and pass in `options`/`isLoading` from a debounced React
 * Query hook (see `useFarmerSearch/useFarmSearch` for examples), so this
 * component stays UI-only and reusable for any "type ahead to search"
 * dropdown fed by an API.
 */
export function AsyncCombobox({
  value,
  onChange,
  options,
  isLoading,
  searchTerm,
  onSearchTermChange,
  selectedLabel,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  disabled,
  className,
  triggerClassName,
  contentClassName,
  required,
}: AsyncComboboxProps) {
  const [open, setOpen] = React.useState(false)

  // Cache the label of whatever option we've most recently resolved for the
  // current value, so the trigger keeps showing the right text even after
  // the options list changes (new search term) and no longer contains it.
  const [cachedLabel, setCachedLabel] = React.useState<string | undefined>(
    selectedLabel,
  )

  const matchedOption = React.useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  )

  React.useEffect(() => {
    if (matchedOption) {
      setCachedLabel(matchedOption.label)
    }
  }, [matchedOption])

  React.useEffect(() => {
    // If the underlying value changes to something we already know the
    // label for (e.g. form reset from freshly loaded defaultData), prefer
    // that over a stale cached label from a previous selection.
    if (selectedLabel) {
      setCachedLabel(selectedLabel)
    }
  }, [selectedLabel])

  const displayLabel = value
    ? matchedOption?.label ?? cachedLabel ?? placeholder
    : placeholder

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) onSearchTermChange("")
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-required={required}
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground",
            triggerClassName,
          )}
        >
          <span className="truncate">{displayLabel}</span>
          {isLoading && !open ? (
            <Loader2 className="ms-2 size-4 shrink-0 animate-spin opacity-50" />
          ) : (
            <ChevronsUpDown className="ms-2 size-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("w-full min-w-[280px] p-0", contentClassName, className)}
      >
        <Command shouldFilter={false}>
          <CommandInput
            value={searchTerm}
            onValueChange={onSearchTermChange}
            placeholder={searchPlaceholder}
            className="h-9"
          />
          <CommandList>
            {isLoading ? (
              <div className="text-muted-foreground flex items-center justify-center gap-2 py-6 text-sm">
                <Loader2 className="size-4 animate-spin" />
                Searching...
              </div>
            ) : (
              <>
                <CommandEmpty>{emptyText}</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => {
                        onChange(option.value, option)
                        setCachedLabel(option.label)
                        setOpen(false)
                      }}
                    >
                      <span className="truncate">{option.label}</span>
                      <Check
                        className={cn(
                          "ms-auto",
                          option.value === value ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
