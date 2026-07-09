"use client"
import CustomTable, { IPagination } from "@/components/CustomTable";
import { CEDI, PAGE_SIZE, routeTo} from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useExpensesList } from "@/apis/adminApiComponents";
import ExpensesSearch from "./ExpensesSearch";
import { commaSeparator, formatDateReadable } from "@/lib/helpers";
import { FilterPropsExpenses } from "../utils/types";
import { AuthorizeAndRenderPage } from "@/components/Unauthorized";
import Link from "next/link";
import PageTitle from "@/components/layouts/PageTitle";
import { Card } from "@/components/ui/card";
import { Wallet } from "lucide-react";

export default function ExpensesView(){
    
    const [filters, setFilters] = useState<FilterPropsExpenses>({
        page: 1, page_size: PAGE_SIZE
    })

    const {data: _data, isLoading, refetch} = useExpensesList({queryParams: filters})
    const data = _data  as any

    const handlePaginationChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page }))
    }
    const handleSetPageSize = (pageSize: number) => {
        setFilters((prev) => ({ ...prev, page_size: pageSize}))
    }
    
    const columns: ColumnDef<any>[] = [
        { header: "Date", accessorKey: "date_created",  
            cell: (_row) => {
                const row = _row.row.original
                return (
                    <div className="">
                        {formatDateReadable(row?.date_created)}
                    </div>
                );
            }
        },
        { header: "Order ID", accessorKey: "order_id",
            cell: (_row) => {
                const row = _row.row.original
                const orderLink = row?.order_type === "inflow" ? `${routeTo.inflowOrdersView}/${row.order_detail?.id}` : `${routeTo.outflowOrdersView}/${row.order_detail?.id}`
                return (
                  <Link href={`${orderLink}`} className="text-blue-600 underline">
                    {row?.order_detail?.order_id}
                  </Link>
                );
            },
            
         },
         { header: "Description", accessorKey: "description",
            cell: (_row) => {
                const row = _row.row.original
                return (
                  <div className="">
                    {row?.description}
                  </div>
                );
            },
            
         },
         { header: "Amount", accessorKey: "amount",
            cell: (_row) => {
                const row = _row.row.original
                return (
                  <div className="">
                    {CEDI} {commaSeparator(row?.amount)}
                  </div>
                );
            },
            
        }
    ];
    
    return(
        <AuthorizeAndRenderPage permission={"accounting|list_expenses"}>
            <PageTitle title="Expenses" />
            <Card className="p-5 shadow-none border border-[#E2E8F0] mb-5 w-full sm:w-fit">
                <div className="flex items-center gap-4">
                    <div className="rounded-full p-2.5 flex items-center justify-center bg-[#FEE2E2]">
                        <Wallet className="h-5 w-5 text-[#DC2626]" />
                    </div>
                    <div>
                        <span className="text-sm text-[#475569] font-medium">Total Expenses</span>
                        <p className="text-2xl font-bold text-black">{CEDI} {commaSeparator(data?.total_expenses?.total_sum)}</p>
                    </div>
                </div>
            </Card>
            <div>
                <CustomTable 
                    searchFilter={<ExpensesSearch setFilters={setFilters} refetch={refetch} isLoading={isLoading} />}
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
        </AuthorizeAndRenderPage>
    )
}