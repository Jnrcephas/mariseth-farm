import { fetchCustomTypeList } from "@/apis/adminApiComponents"
import { useAdminApiContext } from "@/apis/adminApiContext"
import { useQuery } from "@tanstack/react-query"
import { TCategories } from "./types"

// NOTE: this used to page through /custom-type one page at a time
// (page 1 -> wait -> page 2 -> wait -> ...), the same sequential-waterfall
// pattern that was fixed in useAllFarms/useAllFarmers. Custom types are a
// small reference/lookup list (categories, not farms/farmers), so rather
// than build a full search-as-you-type combobox for it - which would be
// overkill for a short dropdown list - this fetches page 1 then any
// remaining pages in parallel, same as the interim fix used for farms
// before that got the full search treatment.
const PAGE_SIZE = 100

export function useAllCustomTypes(custom_type: TCategories) {
  const { fetcherOptions } = useAdminApiContext()

  const { data, isLoading } = useQuery({
    queryKey: ["all-custom-types", custom_type],
    queryFn: async () => {
      const first: any = await fetchCustomTypeList({
        ...fetcherOptions,
        queryParams: { page: 1, page_size: PAGE_SIZE, query: custom_type },
      } as any)

      const totalPages = first?.pagination?.pages ?? 1
      const remainingPages = await Promise.all(
        Array.from({ length: Math.max(totalPages - 1, 0) }, (_, i) =>
          fetchCustomTypeList({
            ...fetcherOptions,
            queryParams: { page: i + 2, page_size: PAGE_SIZE, query: custom_type },
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

  return { allCustomTypes: data ?? [], isLoading }
}
