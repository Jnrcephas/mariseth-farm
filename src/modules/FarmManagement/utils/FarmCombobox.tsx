"use client"

import * as React from "react"
import {
  AsyncCombobox,
  AsyncComboboxOption,
} from "@/components/ui/async-combobox"
import { useFarmSearch } from "./hooks"

interface FarmComboboxProps {
  value?: string | null
  onChange: (value: string, option?: AsyncComboboxOption) => void
  /** Label to show for the currently selected farm before it appears in a
   * search result page - e.g. `defaultData.farm.name` from an edit form. */
  selectedLabel?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  className?: string
}

/**
 * Server-side, search-as-you-type farm picker. Drop-in replacement for the
 * old pattern of mapping `useAllFarms()` results into a `<Select>` list.
 */
export function FarmCombobox({
  value,
  onChange,
  selectedLabel,
  placeholder = "Select Farm",
  disabled,
  required,
  className,
}: FarmComboboxProps) {
  const [search, setSearch] = React.useState("")
  const { options, isLoading } = useFarmSearch(search)

  return (
    <AsyncCombobox
      value={value ?? undefined}
      onChange={onChange}
      options={options}
      isLoading={isLoading}
      searchTerm={search}
      onSearchTermChange={setSearch}
      selectedLabel={selectedLabel}
      placeholder={placeholder}
      searchPlaceholder="Search Farm..."
      emptyText="No Farm found."
      disabled={disabled}
      required={required}
      className={className}
    />
  )
}
