"use client"
import CustomTable, { IPagination } from "@/components/CustomTable";
import { CEDI, PAGE_SIZE, routeTo } from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { Eye} from "lucide-react";
import { useState } from "react";
import {  useInvoiceList } from "@/apis/adminApiComponents";
import { FilterPropsInvoice } from "../utils/types";
import { commaSeparator, formatDateReadable } from "@/lib/helpers";
import Link from "next/link";
import InvoiceSearch from "./InvoiceSearch";
import { AuthorizeAndRenderPage } from "@/components/Unauthorized";
import { useHasAccess } from "@/hooks/auth/useHasAccess";

export default function InvoicesView(){
    const {hasAccess: view_invoice} = useHasAccess("accounting|view_invoice")

    const [filters, setFilters] = useState<FilterPropsInvoice>({
        page: 1, page_size: PAGE_SIZE,
    })

    const {data: _data, isLoading, refetch} = useInvoiceList({queryParams: filters})

    const data = _data  as any


    const handlePaginationChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page }))
    }
    const handleSetPageSize = (pageSize: number) => {
        setFilters((prev) => ({ ...prev, page_size: pageSize}))
    }
    
    const columns: ColumnDef<any>[] = [
        { header: "Invoice ID", accessorKey: "invoice_id" },
        { header: "Order ID", accessorKey: "order_id",
            cell: (_row) => {
                const row = _row.row.original
                const orderLink = `${routeTo.outflowOrdersView}/${row?.outflow_order?.id}`
                return (
                  <Link href={`${orderLink}`} className="text-blue-600 underline">
                    {row?.outflow_order?.order_id}
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
        { header: "Order Type", accessorKey: "order_type",
            cell: (_row) => {
                const row = _row.row.original
                return (
                  <div className="">
                    {row?.outflow_order?.order_id?.includes("i") ? "Inbound" : "Outbound"}
                  </div>
                );
            },
            
        },
        { header: "Weight Quantity", accessorKey: "quantity",
            cell: (_row) => {
                const row = _row.row.original
                return (
                  <div className="">
                    {commaSeparator(row?.quantity)}
                  </div>
                );
            },
            
        },
        { header: "Amount", accessorKey: "amount_paid",
            cell: (_row) => {
                const row = _row.row.original
                return (
                  <div className="">
                    {CEDI} {commaSeparator(row?.amount_paid)}
                  </div>
                );
            },
            
        },
        { header: "Action", accessorKey: "action",
            cell: (_row) => {
                const row = _row.row.original
                return (
                    <div>
                        {view_invoice ?
                            <Link className="cursor-pointer" href={`${routeTo.accountingViewInvoice}/${row?.id}`} >
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
        <AuthorizeAndRenderPage permission={"accounting|list_invoices"}>
            <div>
                <CustomTable 
                    searchFilter={<InvoiceSearch setFilters={setFilters} refetch={refetch} isLoading={isLoading} />}
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