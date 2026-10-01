"use client"

import * as React from "react"
import { toast } from "sonner"
import {
  AsyncCombobox,
  AsyncComboboxOption,
} from "@/components/ui/async-combobox"
import { normalizeProjects, useProjectCreate, useProjectList } from "@/apis/projectApi"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { getErrorMap } from "@/lib/helpers"
import { keepPreviousData } from "@tanstack/react-query"

const SEARCH_PAGE_SIZE = 20
const SEARCH_DEBOUNCE_MS = 300

interface ProjectComboboxProps {
  value?: string | null
  onChange: (value: string, option?: AsyncComboboxOption) => void
  /** Label for a preselected project (e.g. `defaultData.project.name` when editing). */
  selectedLabel?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  className?: string
}

/**
 * Searchable project picker with inline creation.
 *
 * - Existing projects are searched server-side as the user types.
 * - If the typed name doesn't match an existing project, a `Create "<name>"`
 *   row appears in the same dropdown. Picking it POSTs the project, then
 *   selects it automatically - no navigation, no separate screen.
 */
export function ProjectCombobox({
  value,
  onChange,
  selectedLabel,
  placeholder = "Select or create a project",
  disabled,
  required,
  className,
}: ProjectComboboxProps) {
  const [search, setSearch] = React.useState("")
  const [createdLabel, setCreatedLabel] = React.useState<string>()
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS)

  const { data, isFetching } = useProjectList(
    {
      queryParams: {
        query: debouncedSearch || undefined,
        page: 1,
        page_size: SEARCH_PAGE_SIZE,
      },
    },
    { placeholderData: keepPreviousData },
  )

  const options = React.useMemo<AsyncComboboxOption[]>(
    () =>
      normalizeProjects(data).map((project) => ({
        value: String(project.id),
        label: project.name,
        raw: project,
      })),
    [data],
  )

  const { mutateAsync: createProject } = useProjectCreate()

  // Treat the short debounce window as "loading" too, so the "Create" row
  // never appears (or matches against stale options) before results for the
  // current term have actually arrived - this prevents duplicate projects.
  const isLoading = isFetching || debouncedSearch !== search

  return (
    <AsyncCombobox
      value={value ?? undefined}
      onChange={onChange}
      options={options}
      isLoading={isLoading}
      searchTerm={search}
      onSearchTermChange={setSearch}
      selectedLabel={createdLabel ?? selectedLabel}
      placeholder={placeholder}
      searchPlaceholder="Search or type a new project..."
      emptyText="No project found."
      disabled={disabled}
      required={required}
      className={className}
      createOption={{
        label: (term) => `Create project "${term}"`,
        onCreate: async (name) => {
          try {
            const project = await createProject({ body: { name } })
            setCreatedLabel(project.name)
            onChange(String(project.id), {
              value: String(project.id),
              label: project.name,
              raw: project,
            })
            toast.success(`Project "${project.name}" created`)
          } catch (errors: any) {
            toast.error(getErrorMap(errors))
            throw errors
          }
        },
      }}
    />
  )
}
