"use client";
import { useAuditTrailListInflowHistory } from "@/apis/adminApiComponents"
import CustomTable, { IPagination } from "@/components/CustomTable"
import { PAGE_SIZE, routeTo } from "@/lib/constants"
import { formatDateReadable, formatText } from "@/lib/helpers"
import { ColumnDef } from "@tanstack/react-table"
import { FilterPropsAudit } from "./utils/types"
import { useState } from "react"
import AuditOutflowSearch from "./AuditOutflowSearch"
import Link from "next/link";

export default function InflowAuditTrails(){

    const [filters, setFilters] = useState<FilterPropsAudit>({
        page: 1, page_size: PAGE_SIZE
    })
    const {data: _data, isLoading, refetch} = useAuditTrailListInflowHistory({queryParams: filters})
    const data = _data as any

    const handlePaginationChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page }))
    }
    const handleSetPageSize = (pageSize: number) => {
        setFilters((prev) => ({ ...prev, page_size: pageSize}))
    }
    
    const columns: ColumnDef<any>[] = [
        { header: "Date", accessorKey: "date_created",
            cell: (_row) => {
                const created_at = _row.row.original?.date_created
                return(<div className="capitalize">
                        {formatDateReadable(created_at, "Do MMMM, YYYY - hh:mm A")}
                </div>)
            }
         },
        { header: "Order ID", accessorKey: "order_id", 
            cell: (_row) => {
                const order = _row.row.original?.order
                const orderLink = `${routeTo.inflowOrdersView}/${order?.id}`
                return (
                  <Link href={`${orderLink}`} className="text-blue-600 underline">
                    {order?.order_id}
                  </Link>
                );
             }
        },
        { header: "Action", accessorKey: "new_value",
            cell: (_row) => {
                const value = _row.row.original?.old_value
                const action = _row.row.original?.new_value
                return(<div className="capitalize">
                      {action === "order_approval" ? "Approved" : formatText(action)} {formatText(value)}
                </div>)
            }
         },
        { header: "User", accessorKey: "user",
            cell: (_row) => {
                const created_by = _row.row.original?.created_by
                return(<div className="capitalize">
                        {created_by?.first_name} {created_by?.last_name}
                </div>)
            }
         },
        
    ]

    return(
        <div className="mt-5">
            <CustomTable
                searchFilter={<AuditOutflowSearch setFilters={setFilters} filters={filters} refetch={refetch} isLoading={isLoading} />}
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
    )
}