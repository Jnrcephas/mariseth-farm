import { useCustomTypeList } from "@/apis/adminApiComponents"
import { useEffect, useState } from "react"
import { TCategories } from "./types"

export function useAllCustomTypes(custom_type: TCategories) {
     const [filters, setFilters] = useState<any>({
     page: 1, page_size: 50, query: custom_type
    })
    const [allCustomTypes, setAllCustomTypes] = useState<any[]>([])
  
      const {data: data, isLoading} = useCustomTypeList({
          queryParams: filters,
      })
      const customTypes = data as any
      const pagination = customTypes?.pagination
  
  
      useEffect(() => {
          const dataList = [] as any[]
          if(customTypes?.results?.length){
              const shareHoldersList = customTypes?.results?.map((item: any) => ({...item, label: `${item?.entity_type === "individual" ? 
                  `${item?.first_name} ${item?.last_name}` :`${item?.organization_name} - ${item?.first_name} ${item?.last_name}`} `, 
                  value: item?.id})) || []
  
              dataList.push(...shareHoldersList)
            setAllCustomTypes(dataList)
              if(pagination?.has_next){
                  setFilters({...filters, page: pagination?.page + 1})
              }
          }
      },[pagination?.page])
      
      return {allCustomTypes, isLoading}
}


