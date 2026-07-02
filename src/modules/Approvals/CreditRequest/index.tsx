"use client"
import CustomTable, { IPagination } from "@/components/CustomTable";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { PAGE_SIZE } from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { statusBadgeMap } from "@/modules/FarmManagement/utils/constants";
import { Badge } from "@/components/ui/badge";
import { useCreditList } from "@/apis/adminApiComponents";
import { commaSeparator, formatDateReadable } from "@/lib/helpers";
import { FilterPropsCredit } from "@/modules/SupplyChainManagement/utils/types";
import ViewCreditModal from "./Modals/ViewCreditModal";
import CreditSearch from "@/modules/CreditManagement/CreditSearch";
import { AuthorizeAndRenderPage } from "@/components/Unauthorized";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useHasAccess } from "@/hooks/auth/useHasAccess";


export default function ApprovalsCreditTable(){

    const [filters, setFilters] = useState<FilterPropsCredit>({
        page: 1, page_size: PAGE_SIZE
    })

    const {hasAccess: approve_deny_credit} = useHasAccess("credit|approve_deny_credit")

    const {data, isLoading, refetch} = useCreditList({queryParams: filters})

    const [viewModal, setViewModal] = useState(false)
  
    const [selected, setSelected] = useState<any>({})

    function handleViewModal(data: any){
        setSelected(data)
        setViewModal(true)
    }

    const handlePaginationChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page }))
    }
    const handleSetPageSize = (pageSize: number) => {
        setFilters((prev) => ({ ...prev, page_size: pageSize}))
    }
    
    const columns: ColumnDef<any>[] = [
        { header: "Credit ID", accessorKey: "credit_id" },
        { header: "Farmer Name", accessorKey: "farmer", 
            cell: (_row) => {
                const farmer = _row.row.original?.farmer
                return(<div>
                        {farmer?.first_name} {farmer?.last_name}
                </div>)
             }
        },
        { header: "Input Credit", accessorKey: "input_credit",
            cell: (_row) => {
                const input_credit = _row.row.original?.input_credit?.name
                return(<div className="capitalize">
                        {input_credit?.replace("_", " ") || "N/A"}
                </div>)
            }
         },
        { header: "Credit Type", accessorKey: "type",
            cell: (_row) => {
                const type = _row.row.original?.input_credit?.category?.name
                return(<div className="capitalize">
                        {type?.replace("_", " ") || "N/A"}
                </div>)
            }
         },
        { header: "Amount (GH₵)", accessorKey: "credit_amount",
            cell: (_row) => {
                const credit_amount = _row.row.original?.credit_amount
                return(<div className="capitalize">
                        {commaSeparator(credit_amount)}
                </div>)
            }
        },
        { header: "Issue Date", accessorKey: "issue_date",
            cell: (_row) => {
                const issue_date = _row.row.original?.issue_date
                return(<div className="capitalize">
                        {formatDateReadable(issue_date) ?? "N/A"}
                </div>)
            }

         },
        { header: "Due Date", accessorKey: "due_date",
            cell: (_row) => {
                const due_date = _row.row.original?.due_date
                return(<div className="capitalize">
                        {formatDateReadable(due_date) ?? "N/A"}
                </div>)
            }
         },
        { header: "Status", accessorKey: "approval_status",
            cell: (row) => {
                const status = String(row.cell.row.original.approval_status)
                return (
                  <div className="">
                    <Badge variant={statusBadgeMap[status === "approved" ? "order_approved" : status?.toLowerCase()]} className="capitalize">
                        {status?.replace("_", " ")}
                    </Badge>
                  </div>
                );
            },
        },
        { header: "Action", accessorKey: "action",
            cell: (_row) => {
                const row = _row.row.original
                return (
                  <div className="">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className="cursor-pointer">
                            <EllipsisVertical className="text-[#4A8D34]"/>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleViewModal({...row, action:"view"})}>View </DropdownMenuItem>
                            {row?.approval_status !== "approved" && 
                                <DropdownMenuItem disabled={!approve_deny_credit} className="cursor-pointer" onClick={() => handleViewModal({...row, action:"approve"})}>Approve Request</DropdownMenuItem>
                            }
                            {row?.approval_status === "pending" && 
                                <DropdownMenuItem disabled={!approve_deny_credit} className="cursor-pointer" onClick={() => handleViewModal({...row, action:"deny"})}>Deny Request</DropdownMenuItem>
                            }
                        </DropdownMenuContent>
					</DropdownMenu>
                  </div>
                );
            },
        },
    ];
    return(
        <AuthorizeAndRenderPage permission="credit|list_credits">
            <div className="mt-5">
                <CustomTable 
                    searchFilter={<CreditSearch setFilters={setFilters} filters={filters} refetch={refetch} isLoading={isLoading} />}
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

                {viewModal && 
                    <ViewCreditModal
                        open={viewModal} 
                        setOpen={setViewModal} 
                        defaultData={selected}
                        refetch={refetch}
                    />
                }
            </div>
        </AuthorizeAndRenderPage>
    )
}