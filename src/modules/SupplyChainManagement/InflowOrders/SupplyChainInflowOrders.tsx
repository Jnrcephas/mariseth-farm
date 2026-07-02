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
import { useInflowList } from "@/apis/adminApiComponents";
import InflowSearch from "./InflowSearch";
import { commaSeparator, formatDateReadable } from "@/lib/helpers";
import { AuthorizeAndRenderPage } from "@/components/Unauthorized";
import { useHasAccess } from "@/hooks/auth/useHasAccess";

export default function SupplyChainInflowOrders({completed=false}:{completed?: boolean}){

    const [filters, setFilters] = useState<FilterPropsInflow>({
        page: 1, page_size: PAGE_SIZE, completed: completed
    })

    const {hasAccess: create_inflow_order} = useHasAccess("inflow_orders|create_inflow_order")
    const {hasAccess: view_inflow_order} = useHasAccess("inflow_orders|view_inflow_order")

    const {data, isLoading, refetch} = useInflowList({queryParams: filters})
   
    const handlePaginationChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page }))
    }
    const handleSetPageSize = (pageSize: number) => {
        setFilters((prev) => ({ ...prev, page_size: pageSize}))
    }
    
    const columns: ColumnDef<any>[] = [
        { header: "Order Id", accessorKey: "order_id" },
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
        { header: "Total No. of Bags", accessorKey: "total_bags",
            cell: (_row) => {
                const total_bags = _row.row.original?.total_bags
                return(<div className="capitalize">
                        {commaSeparator(total_bags)}
                </div>)
            }
         },
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
                    <>
                        {view_inflow_order ? 
                            <Link href={`${routeTo.inflowOrdersView}/${row?.id}`} className=""> 
                                <Eye className="text-[#4A8D34] cursor-pointer"/>
                            </Link> :
                            <Eye className="text-[#4A8D34] cursor-not-allowed opacity-50"/>
                        }
                    </>
                );
            },
        },
    ];
    return(
        <AuthorizeAndRenderPage permission={"inflow_orders|list_inflow_orders"}>
            <div className="flex justify-between">
                <div className="font-semibold text-black mb-10">
                    Inbound Orders
                </div>
                {create_inflow_order &&
                    <Link href={routeTo.inflowOrdersAdd}>
                        <Button className="bg-[#4A8D34] text-white cursor-pointer">
                            <CirclePlus/>
                            Add New Inbound Order
                        </Button>
                    </Link>
                }
            </div>
            <CustomTable 
                searchFilter={<InflowSearch setFilters={setFilters} filters={filters} refetch={refetch} isLoading={isLoading} completed={completed}/>}
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
        </AuthorizeAndRenderPage>
    )
}