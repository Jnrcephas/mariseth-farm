"use client"
import CustomTable, { IPagination } from "@/components/CustomTable";
import {  Eye, BadgeCheck } from "lucide-react";
import { useState } from "react";
import { PAGE_SIZE, routeTo } from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { statusBadgeMap } from "@/modules/FarmManagement/utils/constants";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useInflowApprovalsList } from "@/apis/adminApiComponents";
import { commaSeparator, formatDateReadable } from "@/lib/helpers";
import { FilterPropsInflow } from "@/modules/SupplyChainManagement/utils/types";
import InflowSearch from "@/modules/SupplyChainManagement/InflowOrders/InflowSearch";

export default function ApprovalsInflowOrders({completed=false}:{completed?: boolean}){

    const [filters, setFilters] = useState<FilterPropsInflow>({
        page: 1, page_size: PAGE_SIZE, completed: completed
    })

    const {data: _data, isLoading, refetch} = useInflowApprovalsList({queryParams: filters})
    const data = _data as any
   
    const handlePaginationChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page }))
    }
    const handleSetPageSize = (pageSize: number) => {
        setFilters((prev) => ({ ...prev, page_size: pageSize}))
    }
    
    const columns: ColumnDef<any>[] = [
        { header: "Order Id", accessorKey: "id" },
        { header: "Date", accessorKey: "order_creation_date",
            cell: (_row) => {
                const order_creation_date = _row.row.original?.order_creation_date
                return(
                <div className="capitalize">
                    {formatDateReadable(order_creation_date)}
                </div>)
            }
        },
        { header: "Aggregator", accessorKey: "aggregator", 
            cell: (_row) => {
                const aggregator = _row.row.original?.aggregator
                return(<div>
                        {aggregator?.first_name} {aggregator?.last_name}
                </div>)
             }
        },
        { header: "Products", accessorKey: "products",
            cell: (_row) => {
                const products = _row.row.original?.products?.map((item: any) => item?.product?.name).join(", ")
                return(
                <div className="capitalize">
                    {products}
                </div>)
            }
        },
        { header: "Total No. of Bags", accessorKey: "total_bags" },
        { header: "Total Amount (GH₵)", accessorKey: "total_cost",
            cell: (_row) => {
                const total_cost = _row.row.original?.total_cost
                return(<div className="capitalize">
                        {commaSeparator(total_cost)}
                </div>)
            }
         },
        { header: "Status", accessorKey: "status",
            cell: (row) => {
                return (
                  <div className="">
                    <Badge variant={statusBadgeMap[row.cell.row.original.status]} className="capitalize">
                        {row.cell.row.original.status?.replace("_", " ")}
                    </Badge>
                  </div>
                );
            },
          },
        { header: "Action", accessorKey: "action",
            cell: (_row) => {
                const row = _row.cell.row.original
                return (
                  <Link href={`${routeTo.viewInflowApprovals}/${row?.id}`} className=""> 
                    <Eye className="text-[#4A8D34] cursor-pointer"/>
                  </Link>
                );
            },
        },
    ];
    return(
        <div>
            <Card className="p-5 shadow-none border border-[#E2E8F0] mb-5 w-full sm:w-fit">
                <div className="flex items-center gap-4">
                    <div className={`rounded-full p-2.5 flex items-center justify-center ${completed ? "bg-[#D1FAE5]" : "bg-[#FEE2E2]"}`}>
                        <BadgeCheck className={`h-5 w-5 ${completed ? "text-[#059669]" : "text-[#DC2626]"}`} />
                    </div>
                    <div>
                        <span className="text-sm text-[#475569] font-medium">{completed ? "Completed Inbound Approvals" : "Pending Inbound Approvals"}</span>
                        <p className="text-2xl font-bold text-black">{data?.pagination?.total ?? 0}</p>
                    </div>
                </div>
            </Card>
            <CustomTable 
                searchFilter={<InflowSearch setFilters={setFilters} filters={filters} refetch={refetch} isLoading={isLoading} />}
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