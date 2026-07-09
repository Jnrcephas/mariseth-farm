import {
  useFarmManagementFarmerList,
  useFarmManagementFarmList,
} from "@/apis/adminApiComponents"
import { Region } from "@/apis/adminApiSchemas"
import { AsyncComboboxOption } from "@/components/ui/async-combobox"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { keepPreviousData } from "@tanstack/react-query"
import { useMemo } from "react"

// NOTE ON WHY THIS FILE LOOKS THE WAY IT DOES:
// These hooks back searchable dropdowns (farm/farmer pickers in the Inbound
// Order, Outbound Order, Credit, and Training forms). They used to fetch the
// *entire* farms/farmers table client-side (first sequentially, then in
// parallel) just so a <select> could filter it in the browser - for a
// dataset with thousands of records that meant downloading everything up
// front before the form was even usable.
//
// These are now proper server-side, search-as-you-type hooks: they only
// request a small page (`SEARCH_PAGE_SIZE`) that matches whatever the user
// has typed so far, using the backend's `query` param (confirmed against
// the OpenAPI spec for /farm-management/farm and /farm-management/farmer -
// both endpoints document `query` as "Search by name/..." rather than
// `search`, `name`, or `q`).
//
// The search term is debounced ~300ms before it's used in the queryKey, so
// we don't fire a request on every keystroke, and `placeholderData:
// keepPreviousData` keeps the previously fetched options on screen (instead
// of flashing to a loading state) while the next debounced request is in
// flight.

const SEARCH_PAGE_SIZE = 20
const SEARCH_DEBOUNCE_MS = 300

function getFarmerLabel(item: any) {
  return item.entity_type === "individual"
    ? `${item.first_name} ${item.last_name}`
    : `${item.organization_name} - ${item.first_name} ${item.last_name}`
}

/**
 * Search-as-you-type hook for the farmer picker. `search` is expected to be
 * whatever the user has typed into the combobox so far (already owned by the
 * calling component/combobox); this hook takes care of debouncing it and
 * mapping results into `{ value, label, raw }` options.
 */
export function useFarmerSearch(
  farmer_type: "lead" | "smallholder" | "",
  search: string,
) {
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS)

  const { data, isFetching } = useFarmManagementFarmerList(
    {
      queryParams: {
        query: debouncedSearch || undefined,
        farmer_type,
        page: 1,
        page_size: SEARCH_PAGE_SIZE,
      } as any,
    },
    { placeholderData: keepPreviousData },
  )

  const options = useMemo<AsyncComboboxOption[]>(
    () =>
      (data?.results ?? []).map((item: any) => ({
        value: String(item.id),
        label: getFarmerLabel(item),
        raw: item,
      })),
    [data],
  )

  return { options, isLoading: isFetching }
}

/**
 * Search-as-you-type hook for the farm picker, mirroring `useFarmerSearch`.
 */
export function useFarmSearch(search: string) {
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS)

  const { data, isFetching } = useFarmManagementFarmList(
    {
      queryParams: {
        query: debouncedSearch || undefined,
        page: 1,
        page_size: SEARCH_PAGE_SIZE,
      } as any,
    },
    { placeholderData: keepPreviousData },
  )

  const options = useMemo<AsyncComboboxOption[]>(
    () =>
      (data?.results ?? []).map((item: any) => ({
        value: String(item.id),
        label: item.name,
        raw: item,
      })),
    [data],
  )

  return { options, isLoading: isFetching }
}

export default function useGetRegionDistricts(regions: Region[], selectedRegionId: number){
    const districts = regions?.find((region) => region?.id === selectedRegionId)?.districts || []
    return {districts}
}

