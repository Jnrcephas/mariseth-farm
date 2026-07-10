"use client"
import CustomTable, { IPagination } from "@/components/CustomTable";
import { Eye, BadgeCheck } from "lucide-react";
import { useState } from "react";
import { PAGE_SIZE, routeTo } from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { statusBadgeMap } from "@/modules/FarmManagement/utils/constants";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useOutflowApprovalListOutflowOrders } from "@/apis/adminApiComponents";
import { commaSeparator, formatDateReadable } from "@/lib/helpers";
import { AuthorizeAndRenderPage } from "@/components/Unauthorized";
import { useHasAccess } from "@/hooks/auth/useHasAccess";
import { FilterPropsInflow } from "@/modules/SupplyChainManagement/utils/types";
import OutflowSearch from "@/modules/SupplyChainManagement/OutflowOrders/OutflowSearch";

export default function OutflowApprovalsOrders({completed}:{completed?: boolean}){

    const [filters, setFilters] = useState<FilterPropsInflow>({
        page: 1, page_size: PAGE_SIZE, completed: completed
    })
    const {hasAccess: view_outflow_order} = useHasAccess("outflow_orders|view_outflow_order")

    const {data: respData, isLoading, refetch} = useOutflowApprovalListOutflowOrders({queryParams: filters})
    const _data = respData as any
   
    const handlePaginationChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page }))
    }
    const handleSetPageSize = (pageSize: number) => {
        setFilters((prev) => ({ ...prev, page_size: pageSize}))
    }
    
    const columns: ColumnDef<any>[] = [
        { header: "Order Id", accessorKey: "order_id" },
        { header: "Date", accessorKey: "date_created",
            cell: (_row) => {
                const date_created = _row.row.original?.date_created
                return(
                <div className="capitalize">
                    {formatDateReadable(date_created)}
                </div>)
            }
        },
        { header: "Buyer", accessorKey: "buyer", 
            cell: (_row) => {
                const customer = _row.row.original?.customer
                return(<div className="capitalize">
                        {customer}
                </div>)
             }
        },
        { header: "Products", accessorKey: "products",
            cell: (_row) => {
                const products = _row.row.original?.warehouse?.products?.map((item: any) => item?.product?.name).join(", ")
                return(
                <div className="capitalize">
                    {products}
                </div>)
            }
        },
        { header: "Total No. of Bags", accessorKey: "total_quantity",
            cell: (_row) => {
                const total_quantity = _row.row.original?.warehouse?.total_quantity
                return(<div className="capitalize">
                        {commaSeparator(total_quantity)}
                </div>)
            }
         },
        { header: "Total Amount (GH₵)", accessorKey: "total_cost",
            cell: (_row) => {
                const total_cost = _row.row.original?.warehouse?.total_cost
                return(<div className="capitalize">
                        {commaSeparator(total_cost)}
                </div>)
            }
         },
        { header: "Status", accessorKey: "status",
            cell: (row) => {
                return (
                  <div className="">
                    <Badge variant={statusBadgeMap[row.cell.row.original.warehouse?.status]} className="capitalize">
                        {row.cell.row.original.warehouse?.status?.replace("_", " ")}
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
                        <Link href={`${routeTo.viewOutflowApprovals}/${row?.id}/warehouse/${row?.warehouse?.id}`} className=""> 
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
            <Card className="p-5 shadow-none border border-[#E2E8F0] mb-5 w-full sm:w-fit">
                <div className="flex items-center gap-4">
                    <div className={`rounded-full p-2.5 flex items-center justify-center ${completed ? "bg-[#D1FAE5]" : "bg-[#FEE2E2]"}`}>
                        <BadgeCheck className={`h-5 w-5 ${completed ? "text-[#059669]" : "text-[#DC2626]"}`} />
                    </div>
                    <div>
                        <span className="text-sm text-[#475569] font-medium">{completed ? "Approved Pickups" : "Pending Outbound Approvals"}</span>
                        <p className="text-2xl font-bold text-black">{_data?.pagination?.total ?? 0}</p>
                    </div>
                </div>
            </Card>
            <CustomTable 
                searchFilter={<OutflowSearch setFilters={setFilters} refetch={refetch} isLoading={isLoading} />}
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