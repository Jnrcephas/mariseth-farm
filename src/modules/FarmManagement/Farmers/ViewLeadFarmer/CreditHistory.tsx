"use client";
import CustomTable, { IPagination } from "@/components/CustomTable";
import { CEDI, PAGE_SIZE} from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { FilterProps } from "../../utils/types";
import { statusBadgeMap } from "../../utils/constants";
import { Badge } from "@/components/ui/badge";
import { useFarmManagementFarmerGetFarmerCreditHistory } from "@/apis/adminApiComponents";
import { Farmer } from "@/apis/adminApiSchemas";
import { commaSeparator, formatDateReadable } from "@/lib/helpers";

export default function CreditHistory({farmerId}:{farmerId: Farmer["id"]}) {

    const [filters, setFilters] = useState<FilterProps>({
        page: 1, page_size: PAGE_SIZE
    })

    const {data:resp, isLoading} = useFarmManagementFarmerGetFarmerCreditHistory({
        queryParams: filters,
        pathParams: {id: Number(farmerId)}, 
    },{enabled: !!farmerId})

    const _data = resp as any || []

    const handlePaginationChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page }))
    }

    const handleSetPageSize = (pageSize: number) => {
        setFilters((prev) => ({ ...prev, page_size: pageSize}))
    }

    const columns: ColumnDef<any>[] = [
        { header: "ID", accessorKey: "id" },
        { header: "Date Paid", accessorKey: "due_date",  
            cell: (_row) => {
                const due_date = _row.row.original?.due_date
                return(<div className="capitalize">
                        {formatDateReadable(due_date)}
                </div>)
            }
        },
        { header: "Input Credits", accessorKey: "input_credits" },
        { header: "Amount", accessorKey: "amount",
            cell: (_row) => {
                const amount = _row.row.original?.credit_amount || 0
                return(<div>
                      {CEDI} {commaSeparator(amount)}
                </div>)
             }
         },
        { header: "Payback Method", accessorKey: "payback_method",
            cell: (_row) => {
                const payback_method = _row.row.original?.outstanding_amount ? "Cash" : "Crop Exchange"
                return(<div className="capitalize">
                        {payback_method}
                </div>)
            }
         },
        { header: "Payback Amount (GH₵)", accessorKey: "payback_amount",
            cell: (_row) => {
                const payback_amount = _row.row.original?.credit_amount || 0
                return(<div>
                      {CEDI} {commaSeparator(payback_amount)}
                </div>)
             }
         },
        { header: "Outstanding (GH₵)", accessorKey: "outstanding",
            cell: (_row) => {
                const outstanding = _row.row.original?.outstanding_amount || 0
                return(
                <div>
                    {CEDI} {commaSeparator(outstanding)}
                </div>)
            }
        },
        { header: "Status", accessorKey: "status",
            cell: (row) => {
                return (
                  <div className="">
                    <Badge variant={statusBadgeMap[row.cell.row.original.payment_status?.toLowerCase()]} className="capitalize">
                        {row.cell.row.original.payment_status?.replaceAll("_", " ")}
                    </Badge>
                  </div>
                );
            },
        }
    ];
    return(
    <div className="">
        <CustomTable 
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
    </div>
    )
}