"use client"
import CustomTable, { IPagination } from "@/components/CustomTable";
import { EllipsisVertical, Package } from "lucide-react";
import { useState } from "react";
import { PAGE_SIZE } from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { useCreditListCreditFulfill } from "@/apis/adminApiComponents";
import { commaSeparator, formatDateReadable } from "@/lib/helpers";
import { FilterPropsCredit } from "@/modules/SupplyChainManagement/utils/types";
import ViewWarehouseCreditModal from "./Modals/ViewWarehouseCreditModal";
import CreditSearch from "@/modules/CreditManagement/CreditSearch";
import { AuthorizeAndRenderPage } from "@/components/Unauthorized";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import PageTitle from "@/components/layouts/PageTitle";


export default function WarehouseCreditTable(){

    const [filters, setFilters] = useState<FilterPropsCredit>({
        page: 1, page_size: PAGE_SIZE
    })
    const {data: _data, isLoading, refetch} = useCreditListCreditFulfill({queryParams: filters})
    const data = _data as any

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
        { header: "Credit ID", accessorKey: "credit_id",
            cell: (_row) => {
                const credit = _row.row.original?.credit
                return(<div>
                        {credit?.credit_id}
                </div>)
             }
         },
        { header: "Farmer Name", accessorKey: "farmer", 
            cell: (_row) => {
                const farmer = _row.row.original?.credit?.farmer
                return(<div>
                        {farmer?.first_name} {farmer?.last_name}
                </div>)
             }
        },
        { header: "Input Credit", accessorKey: "input_credit",
            cell: (_row) => {
                const input_credit = _row.row.original?.credit?.input_credit?.name
                return(<div className="capitalize">
                        {input_credit}
                </div>)
            }
         },
        { header: "Credit Type", accessorKey: "type",
            cell: (_row) => {
                const type = _row.row.original?.credit?.input_credit?.category?.name
                return(<div className="capitalize">
                        {type}
                </div>)
            }
         },
        { header: "Amount (GH₵)", accessorKey: "credit_amount",
            cell: (_row) => {
                const credit_amount = _row.row.original?.credit?.credit_amount
                return(<div className="capitalize">
                        {commaSeparator(credit_amount)}
                </div>)
            }
        },
        { header: "Issue Date", accessorKey: "issue_date",
            cell: (_row) => {
                const issue_date = _row.row.original?.credit?.issue_date
                return(<div className="capitalize">
                        {formatDateReadable(issue_date) ?? "N/A"}
                </div>)
            }

         },
        { header: "Due Date", accessorKey: "due_date",
            cell: (_row) => {
                const due_date = _row.row.original?.credit?.due_date
                return(<div className="capitalize">
                        {formatDateReadable(due_date) ?? "N/A"}
                </div>)
            }
         },
        { header: "Status", accessorKey: "is_fulfilled",
            cell: (row) => {
                const status = row.cell.row.original?.is_fulfilled
                return (
                  <div className="">
                    {status ? 
                    <Badge variant={"success"} className="capitalize">
                        Fulfilled
                    </Badge>: 
                    <Badge variant={"warning"} className="capitalize">
                        Pending
                    </Badge>}
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
                            {!row?.is_fulfilled && 
                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleViewModal({...row, action:"approve"})}>Fulfill Request</DropdownMenuItem>
                            }
                        </DropdownMenuContent>
					</DropdownMenu>
                  </div>
                );
            },
        },
    ];
    return(
        <AuthorizeAndRenderPage permission="credit|list_credit_fulfill">
            <div className="mt-5">
                <PageTitle title="Warehouse Credit Approvals" />
                <Card className="p-5 shadow-none border border-[#E2E8F0] mb-5 w-full sm:w-fit">
                    <div className="flex items-center gap-4">
                        <div className="rounded-full p-2.5 flex items-center justify-center bg-[#FEF3C7]">
                            <Package className="h-5 w-5 text-[#D97706]" />
                        </div>
                        <div>
                            <span className="text-sm text-[#475569] font-medium">Total Warehouse Credit Requests</span>
                            <p className="text-2xl font-bold text-black">{data?.pagination?.total ?? 0}</p>
                        </div>
                    </div>
                </Card>
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
                    <ViewWarehouseCreditModal
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