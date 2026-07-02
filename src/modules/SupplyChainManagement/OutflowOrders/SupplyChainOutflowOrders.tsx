"use client"
import CustomTable, { IPagination } from "@/components/CustomTable";
import { CirclePlus, Eye } from "lucide-react";
import { useState } from "react";
import { PAGE_SIZE, routeTo } from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { statusBadgeMap } from "@/modules/FarmManagement/utils/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { FilterPropsInflow } from "../utils/types";
import { useOutflowList } from "@/apis/adminApiComponents";
import OutflowSearch from "./OutflowSearch";
import { commaSeparator, formatDateReadable, formatText } from "@/lib/helpers";
import { AuthorizeAndRenderPage } from "@/components/Unauthorized";
import { useHasAccess } from "@/hooks/auth/useHasAccess";
import { ORDER_STATUS_MAP_OUTFLOW } from "../utils/constants";

export default function SupplyChainOutflowOrders({completed=false}:{completed?: boolean}){

    const [filters, setFilters] = useState<FilterPropsInflow>({
        page: 1, page_size: PAGE_SIZE, completed: completed
    })
    const {hasAccess: create_outflow_order} = useHasAccess("outflow_orders|create_outflow_order")
    const {hasAccess: view_outflow_order} = useHasAccess("outflow_orders|view_outflow_order")

    const {data: respData, isLoading, refetch} = useOutflowList({queryParams: filters})
    const _data = respData as any
   
    const handlePaginationChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page }))
    }
    const handleSetPageSize = (pageSize: number) => {
        setFilters((prev) => ({ ...prev, page_size: pageSize}))
    }
    
    const columns: ColumnDef<any>[] = [
        { header: "Order Id", accessorKey: "order_id" },
        { header: "Delivery Date", accessorKey: "expected_delivery_date",
            cell: (_row) => {
                const expected_delivery_date = _row.row.original?.expected_delivery_date
                return(
                <div className="capitalize">
                    {formatDateReadable(expected_delivery_date)}
                </div>)
            }
        },
        { header: "Buyer", accessorKey: "buyer", 
            cell: (_row) => {
                const customer = _row.row.original?.customer
                return(<div>
                        {customer?.name}
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
        { header: "Total No. of Bags", accessorKey: "total_quantity" },
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
                const status = row.cell.row.original.status as keyof typeof ORDER_STATUS_MAP_OUTFLOW
                const _stage = ORDER_STATUS_MAP_OUTFLOW[status] || "availability_check"
                return (
                  <div className="">
                    <Badge variant={statusBadgeMap[_stage]} className="capitalize">
                        {formatText(_stage)}
                    </Badge>
                  </div>
                );
            },
          },
        { header: "Action", accessorKey: "action",
            cell: (_row) => {
                const row = _row.cell.row.original
                return (
                    <>{view_outflow_order ?
                        <Link href={`${routeTo.outflowOrdersView}/${row?.id}`} className=""> 
                            <Eye className="text-[#4A8D34] cursor-pointer"/>
                        </Link>:
                        <Eye className="text-[#4A8D34] cursor-not-allowed opacity-50"/>
                        }
                    </>
                );
            },
        },
    ];
    return(
        <AuthorizeAndRenderPage permission={"outflow_orders|list_outflow_orders"}>
            <div className="flex justify-between">
                <div className="font-semibold text-black mb-10">
                    Outbound Orders
                </div>
                {create_outflow_order && 
                    <Link href={routeTo.outflowOrdersAdd}>
                        <Button className="bg-[#4A8D34] text-white cursor-pointer">
                            <CirclePlus/>
                            Add New Outbound Order
                        </Button>
                    </Link>
                }
            </div>
            <CustomTable 
                searchFilter={<OutflowSearch setFilters={setFilters} filters={filters} refetch={refetch} isLoading={isLoading} completed={completed}/>}
                columns={columns} 
                data={_data?.results || []} 
                setPerPage={handleSetPageSize} 
                perPage={filters.page_size || PAGE_SIZE} 
                isLoading={isLoading}
                currentPage={filters?.page}
                count={_data?.pagination?.total || 0}
                handlePaginationChange={handlePaginationChange}
                pagination={_data?.pagination as IPagination}
            />
        </AuthorizeAndRenderPage>
    )
}