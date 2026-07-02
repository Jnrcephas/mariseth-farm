"use client"
import CustomTable, { IPagination } from "@/components/CustomTable";
import { PAGE_SIZE} from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

import {useEmployeeGetEmployeeTrainings } from "@/apis/adminApiComponents";

import { FilterPropsEmployees } from "../../utils/types";
import { formatDateReadable } from "@/lib/helpers";
import { Badge } from "@/components/ui/badge";
import { statusBadgeMap } from "@/modules/FarmManagement/utils/constants";




export default function ViewTraining({employeeId}:{employeeId: number}){
    
    const [filters, setFilters] = useState<FilterPropsEmployees>({
        page: 1, page_size: PAGE_SIZE,
    })

    const {data: _data, isLoading} = useEmployeeGetEmployeeTrainings({
        pathParams: {
            id: employeeId
        },
        queryParams:filters
    })
    const data  = _data as any

    const handlePaginationChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page }))
    }

    const handleSetPageSize = (pageSize: number) => {
        setFilters((prev) => ({ ...prev, page_size: pageSize}))
    }

    const columns: ColumnDef<any>[] = [
        { header: "Training ID", accessorKey: "training_id",
            cell: (_row) => {
                const row = _row?.row?.original
                return(
                    <div className="capitalize">{row?.training?.training_id}</div>
                )
            }
        },
        { header: "Title", accessorKey: "title",
            cell: (_row) => {
                const row = _row?.row?.original
                return(
                    <div className="capitalize">{row?.training?.title}</div>
                )
            }
        },
        { header: "Training Type", accessorKey: "training_type",
            cell: (_row) => {
                const row = _row?.row?.original
                return(
                    <div className="capitalize">{row?.training?.training_type}</div>
                )
            }
        },
        { header: "Training Mode", accessorKey: "training_mode",
            cell: (_row) => {
                const row = _row?.row?.original
                return(
                    <div className="capitalize">{row?.training?.training_mode}</div>
                )
            }
        },
        { header: "Start", accessorKey: "start_date",
            cell: (_row) => {
                const row = _row?.row?.original
                return(
                    <div className="capitalize">{formatDateReadable(row?.training?.start_date)}</div>
                )
            }
        },
        { header: "End", accessorKey: "end_date",
            cell: (_row) => {
                const row = _row?.row?.original
                return(
                    <div className="capitalize">{formatDateReadable(row?.training?.end_date)}</div>
                )
            }
        },
        { header: "Status", accessorKey: "status",
            cell: (_row) => {
                const row = _row?.row?.original
                return(
                    <div><Badge className="capitalize" variant={statusBadgeMap[row?.status]}>{row?.status}</Badge></div>
                )
            }
        },
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
                count={data?.pagination?.total || 0}
                handlePaginationChange={handlePaginationChange}
                pagination={data?.pagination as IPagination}
            />
            
            </div>
       
        </div>
    )
}