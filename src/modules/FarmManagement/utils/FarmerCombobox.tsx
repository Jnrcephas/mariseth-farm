"use client"

import * as React from "react"
import {
  AsyncCombobox,
  AsyncComboboxOption,
} from "@/components/ui/async-combobox"
import { useFarmerSearch } from "./hooks"

interface FarmerComboboxProps {
  value?: string | null
  onChange: (value: string, option?: AsyncComboboxOption) => void
  farmerType: "lead" | "smallholder" | ""
  /** Label to show for the currently selected farmer before it appears in a
   * search result page - e.g. `${first_name} ${last_name}` from an edit
   * form's `defaultData`. */
  selectedLabel?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  className?: string
}

/**
 * Server-side, search-as-you-type farmer picker. Drop-in replacement for the
 * old pattern of mapping `useAllFarmers()` results into a `<Select>` /
 * `<Command>` list.
 */
export function FarmerCombobox({
  value,
  onChange,
  farmerType,
  selectedLabel,
  placeholder = "Select Farmer",
  disabled,
  required,
  className,
}: FarmerComboboxProps) {
  const [search, setSearch] = React.useState("")
  const { options, isLoading } = useFarmerSearch(farmerType, search)

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
      searchPlaceholder="Search Farmer..."
      emptyText="No Farmer found."
      disabled={disabled}
      required={required}
      className={className}
    />
  )
}
