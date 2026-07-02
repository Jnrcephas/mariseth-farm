import { useFarmManagementFarmerList, useFarmManagementFarmList } from "@/apis/adminApiComponents"
import { Region } from "@/apis/adminApiSchemas"
import { useEffect, useMemo, useState } from "react"

export function useAllFarmers(farmer_type: "lead" | "smallholder" | "") {
  const [filters, setFilters] = useState({
    page: 1,
    page_size: 100,
    farmer_type,
  })
  const [allFarmers, setAllFarmers] = useState<any[]>([])

  const { data: farmersData, isLoading } = useFarmManagementFarmerList({
    queryParams: filters,
  })
  const farmers = farmersData as any
  const pagination = farmers?.pagination

  useEffect(() => {
    if (farmers?.results?.length) {
      const newFarmers = farmers.results.map((item: any) => ({
        ...item,
        label:
          item.entity_type === "individual"
            ? `${item.first_name} ${item.last_name}`
            : `${item.organization_name} - ${item.first_name} ${item.last_name}`,
        value: item.id,
      }))

      setAllFarmers(prev => {
        // Merge and remove duplicates by `id`
        const merged = [...prev, ...newFarmers]
        const unique = Array.from(
          new Map(merged.map(f => [f.id, f])).values()
        )
        return unique
      })

      if (pagination?.has_next) {
        setFilters(prev => ({ ...prev, page: pagination.page + 1 }))
      }
    }
  }, [pagination?.page, farmers?.results])

  const sortedFarmers = useMemo(() => {
    return [...allFarmers].sort((a, b) =>
      a.first_name && b.first_name
        ? a.first_name.localeCompare(b.first_name)
        : 0
    )
  }, [allFarmers])

  return { allFarmers: sortedFarmers, isLoading }
}



export function useAllFarms() {
  const [filters, setFilters] = useState({
    page: 1,
    page_size: 100,
  })
  const [farms, setAllFarms] = useState<any[]>([])

  const { data, isLoading } = useFarmManagementFarmList({
    queryParams: filters,
  })
  const farmData = data as any
  const pagination = farmData?.pagination

  useEffect(() => {
    if (farmData?.results?.length) {
      const newFarms = farmData.results.map((item: any) => ({
        ...item,
        label:
          item.entity_type === "individual"
            ? `${item.first_name} ${item.last_name}`
            : `${item.organization_name} - ${item.first_name} ${item.last_name}`,
        value: item.id,
      }))

      setAllFarms(prev => {
        // Merge and remove duplicates by `id`
        const merged = [...prev, ...newFarms]
        const unique = Array.from(new Map(merged.map(f => [f.id, f])).values())
        return unique
      })

      if (pagination?.has_next) {
        setFilters(prev => ({ ...prev, page: pagination.page + 1 }))
      }
    }
  }, [pagination?.page, farmData?.results])

  return { farms, isLoading }
}


export default function useGetRegionDistricts(regions: Region[], selectedRegionId: number){
    const districts = regions?.find((region) => region?.id === selectedRegionId)?.districts || []
    return {districts}
}

