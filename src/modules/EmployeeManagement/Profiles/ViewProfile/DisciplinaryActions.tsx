"use client"
import CustomTable from "@/components/CustomTable";
import { PAGE_SIZE} from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

import { useEmployeeDisciplinaryActions } from "@/apis/adminApiComponents";

import { FilterPropsEmployees } from "../../utils/types";
import { formatDateReadable } from "@/lib/helpers";
import { Badge } from "@/components/ui/badge";
import { statusBadgeMap } from "@/modules/FarmManagement/utils/constants";



export default function ViewDisciplinaryActions({employeeId}:{employeeId: number}){
    
    const [filters, setFilters] = useState<FilterPropsEmployees>({
        page: 1, page_size: PAGE_SIZE,
    })

    const {data: _data, isLoading} = useEmployeeDisciplinaryActions({
        pathParams: {
            id: employeeId
        },
        queryParams:filters
    })
    const data  = _data as any

    // const handlePaginationChange = (page: number) => {
    //     setFilters((prev) => ({ ...prev, page }))
    // }

    const handleSetPageSize = (pageSize: number) => {
        setFilters((prev) => ({ ...prev, page_size: pageSize}))
    }

    const columns: ColumnDef<any>[] = [
        { header: "Date Issued", accessorKey: "date_issued",
            cell: (_row) => {
                const row = _row?.row.original
                return(
                    <div>
                        {formatDateReadable(row?.date_issued)}
                    </div>
                )

            }
         },
        { header: "Action", accessorKey: "action_type",
             cell: (_row) => {
                const row = _row?.row.original
                return (
                  <div className="">
                    <Badge variant={statusBadgeMap[row?.action_type?.toLowerCase()]} className="capitalize">
                        {row?.action_type?.replaceAll("_", " ")}
                    </Badge>
                  </div>
                );
            },
         },
        { header: "Offense", accessorKey: "offence"}
    ];
    return(
        <div className="">
            
           <div className="bg-white rounded-lg border p-5">
            <CustomTable 
                // searchFilter={<ProfilesSearch setFilters={setFilters} refetch={refetch} isLoading={isLoading} />}
                columns={columns} 
                data={data?.results || []} 
                setPerPage={handleSetPageSize} 
                perPage={filters.page_size || PAGE_SIZE} 
                isLoading={isLoading}
                currentPage={filters?.page}
                count={data?.results?.length || 0}
                // handlePaginationChange={handlePaginationChange}
                // pagination={data?.pagination as IPagination}
            />
            
            </div>
       
        </div>
    )
}