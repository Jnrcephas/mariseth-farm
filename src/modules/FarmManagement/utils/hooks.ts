import { fetchFarmManagementFarmerList, fetchFarmManagementFarmList } from "@/apis/adminApiComponents"
import { useAdminApiContext } from "@/apis/adminApiContext"
import { Region } from "@/apis/adminApiSchemas"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"

// NOTE ON WHY THIS FILE LOOKS THE WAY IT DOES:
// These hooks back searchable dropdowns (farm/farmer pickers in the Inbound
// Order, Outbound Order, Credit, and Training forms) that need the *entire*
// list client-side. The previous implementation fetched one page at a time,
// waiting for each response before requesting the next (page 1 -> wait ->
// page 2 -> wait -> ... -> page 52), which for ~5,000+ records meant 50+
// fully sequential round-trips before the form was usable - this is what was
// showing up as 200+ requests in the Network tab and making the page feel
// like it had hung.
//
// This version fetches page 1 to learn the total page count, then fires
// every remaining page in parallel with Promise.all, cutting the wall-clock
// time from "N round-trips in a row" down to roughly "1 round-trip's worth
// of latency" regardless of how many pages there are. It's still not as
// good as a true server-side search-as-you-type select (the ideal long-term
// fix - see the note further down), but it's a safe, drop-in improvement
// that doesn't require touching every form that uses it.

const PAGE_SIZE = 200

export function useAllFarmers(farmer_type: "lead" | "smallholder" | "") {
  const { fetcherOptions } = useAdminApiContext()

  const { data, isLoading } = useQuery({
    queryKey: ["all-farmers", farmer_type],
    queryFn: async () => {
      const first: any = await fetchFarmManagementFarmerList({
        ...fetcherOptions,
        queryParams: { page: 1, page_size: PAGE_SIZE, farmer_type },
      } as any)

      const totalPages = first?.pagination?.pages ?? 1
      const remainingPages = await Promise.all(
        Array.from({ length: Math.max(totalPages - 1, 0) }, (_, i) =>
          fetchFarmManagementFarmerList({
            ...fetcherOptions,
            queryParams: { page: i + 2, page_size: PAGE_SIZE, farmer_type },
          } as any),
        ),
      )

      const allResults = [first, ...remainingPages].flatMap(
        (page: any) => page?.results ?? [],
      )

      return allResults.map((item: any) => ({
        ...item,
        label:
          item.entity_type === "individual"
            ? `${item.first_name} ${item.last_name}`
            : `${item.organization_name} - ${item.first_name} ${item.last_name}`,
        value: item.id,
      }))
    },
    // These lists don't change minute-to-minute; avoid re-fetching the
    // entire dataset every time a form using this hook is opened.
    staleTime: 5 * 60 * 1000,
  })

  const sortedFarmers = useMemo(() => {
    return [...(data ?? [])].sort((a, b) =>
      a.first_name && b.first_name
        ? a.first_name.localeCompare(b.first_name)
        : 0,
    )
  }, [data])

  return { allFarmers: sortedFarmers, isLoading }
}

export function useAllFarms() {
  const { fetcherOptions } = useAdminApiContext()

  const { data, isLoading } = useQuery({
    queryKey: ["all-farms"],
    queryFn: async () => {
      const first: any = await fetchFarmManagementFarmList({
        ...fetcherOptions,
        queryParams: { page: 1, page_size: PAGE_SIZE },
      } as any)

      const totalPages = first?.pagination?.pages ?? 1
      const remainingPages = await Promise.all(
        Array.from({ length: Math.max(totalPages - 1, 0) }, (_, i) =>
          fetchFarmManagementFarmList({
            ...fetcherOptions,
            queryParams: { page: i + 2, page_size: PAGE_SIZE },
          } as any),
        ),
      )

      const allResults = [first, ...remainingPages].flatMap(
        (page: any) => page?.results ?? [],
      )

      return allResults.map((item: any) => ({
        ...item,
        label:
          item.entity_type === "individual"
            ? `${item.first_name} ${item.last_name}`
            : `${item.organization_name} - ${item.first_name} ${item.last_name}`,
        value: item.id,
      }))
    },
    staleTime: 5 * 60 * 1000,
  })

  return { farms: data ?? [], isLoading }
}

// LONG-TERM RECOMMENDATION: if the farms/farmers list keeps growing, even a
// parallelized "fetch everything" approach will eventually get slow and
// wasteful (downloading thousands of records just to populate a dropdown).
// At that point these should become search-as-you-type selects that call
// the API with `?search=<query>&page_size=20` as the user types, so the
// browser only ever fetches the handful of matching records instead of the
// whole table. Flagging this now rather than doing the larger form refactor
// silently, since it touches several forms (Inbound/Outbound orders,
// Credit modals, Training) and is worth a deliberate decision.

export default function useGetRegionDistricts(regions: Region[], selectedRegionId: number){
    const districts = regions?.find((region) => region?.id === selectedRegionId)?.districts || []
    return {districts}
}

