"use client"
import CustomTable, { IPagination } from "@/components/CustomTable";
import {  PAGE_SIZE, routeTo } from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import {  Eye} from "lucide-react";
import { useState } from "react";
import {  useWaybillList } from "@/apis/adminApiComponents";
import { FilterPropsWaybill } from "../utils/types";
import { commaSeparator, formatDateReadable } from "@/lib/helpers";
import Link from "next/link";
import OutboundSearch from "./OutboundSearch";
import { useHasAccess } from "@/hooks/auth/useHasAccess";

export default function Inbound(){
    const {hasAccess: view_waybill} = useHasAccess("accounting|view_waybill")

    const [filters, setFilters] = useState<FilterPropsWaybill>({
        page: 1, page_size: PAGE_SIZE, order_type: "outflow"
    })

    const {data: _data, isLoading, refetch} = useWaybillList({queryParams: filters})

    const data = _data  as any


    const handlePaginationChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page }))
    }
    const handleSetPageSize = (pageSize: number) => {
        setFilters((prev) => ({ ...prev, page_size: pageSize}))
    }
    
    const columns: ColumnDef<any>[] = [
        { header: "Waybill ID", accessorKey: "waybill_id" },
        { header: "Order ID", accessorKey: "order_id",
            cell: (_row) => {
                const row = _row.row.original
                const orderLink = row?.order_id?.includes("i") ? `${routeTo.inflowOrdersView}/${row?.id}` : `${routeTo.outflowOrdersView}/${row?.id}`
                return (
                  <Link href={`${orderLink}`} className="text-blue-600 underline">
                    {row?.order_id}
                  </Link>
                );
            },
            
         },
         { header: "Issue Date", accessorKey: "date_created",
            cell: (_row) => {
                const row = _row.row.original
                return (
                  <div className="">
                     {formatDateReadable(row?.date_created)}
                  </div>
                );
            },
            
         },
         { header: "Customer", accessorKey: "customer",
            cell: (_row) => {
                const row = _row.row.original
                return (
                  <div className="">
                     {row?.customer?.name}
                  </div>
                );
            },
            
         },
         { header: "Destination", accessorKey: "destination",
            cell: (_row) => {
                const row = _row.row.original
                return (
                  <div className="">
                    {row?.destination}
                  </div>
                );
            },
            
        },
        { header: "Total Bags", accessorKey: "total_bags",
            cell: (_row) => {
                const row = _row.row.original
                return (
                  <div className="">
                    {commaSeparator(row?.total_quantity)}
                  </div>
                );
            },
            
        },
        { header: "Action", accessorKey: "vehicle",
            cell: (_row) => {
                const row = _row.row.original
                return (
                    <div>
                        {view_waybill ?
                            <Link className="cursor-pointer" href={`${routeTo.accountingViewWaybill}/${row?.id}/?order_type=outflow`} >
                                <Eye className="text-[#4A8D34]"/>
                            </Link>: 
                            <Eye className="text-[#4A8D34] cursor-not-allowed opacity-20"/>
                        }
                    </div>
                );
            },
            
        }
    ];
    
    return(
        <div>
            
            <div>
                <CustomTable 
                    searchFilter={<OutboundSearch setFilters={setFilters} refetch={refetch} isLoading={isLoading} />}
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