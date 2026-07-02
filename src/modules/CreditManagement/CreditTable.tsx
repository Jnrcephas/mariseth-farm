"use client"
import CustomTable, { IPagination } from "@/components/CustomTable";
import { CirclePlus, EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { PAGE_SIZE } from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { statusBadgeMap } from "@/modules/FarmManagement/utils/constants";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCreditList } from "@/apis/adminApiComponents";
import CreditSearch from "./CreditSearch";
import { commaSeparator, formatDateReadable } from "@/lib/helpers";
import ViewCreditModal from "./Modals/ViewCreditModal";
import DeleteCreditModal from "./Modals/DeleteCreditModal";
import PaybackModal from "./Modals/PaybackModal";
import { FilterPropsCredit } from "./utils/types";
import { AuthorizeAndRenderPage } from "@/components/Unauthorized";
import { useHasAccess } from "@/hooks/auth/useHasAccess";
import { Button } from "@/components/ui/button";
import AddCreditModal from "./Modals/AddCreditModal";

export default function CreditTable(){

    const [filters, setFilters] = useState<FilterPropsCredit>({
        page: 1, page_size: PAGE_SIZE
    })
    const {data, isLoading, refetch} = useCreditList({queryParams: filters})

    const {hasAccess: create_payback} = useHasAccess("payback|create_payback")
    const {hasAccess: delete_credit} = useHasAccess("credit|delete_credit")
    const {hasAccess: create_credit} = useHasAccess("credit|create_credit")

    const [viewModal, setViewModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [paybackModal, setPaybackModal] = useState(false)
    const [selected, setSelected] = useState<any>({})
    const [addCreditModal, setAddCreditModal] = useState(false)
   

    function handleViewModal(data: any){
        setSelected(data)
        setViewModal(true)
    }
    function handleDeleteModal(data: any){
        setSelected(data)
        setDeleteModal(true)
    }
    function handlePaybackModal(data: any){
        setSelected(data)       
        setPaybackModal(true)
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
        { header: "Payment Status", accessorKey: "payment_status",
            cell: (_row) => {
                const payment_status = String(_row.cell.row.original.payment_status)
                return (
                  <div className="">
                    <Badge variant={statusBadgeMap[payment_status?.toLowerCase()]} className="capitalize">
                        {payment_status?.replace("_", " ")}
                    </Badge>
                  </div>
                );
            },
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
                            
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleViewModal(row)}>View </DropdownMenuItem>
                            {row.approval_status === "fulfilled" && 
                                <DropdownMenuItem disabled={!create_payback} className="cursor-pointer" onClick={() => handlePaybackModal(row)}>Payback </DropdownMenuItem>
                            }
                            <DropdownMenuItem disabled={!delete_credit} className="text-red-500 cursor-pointer" onClick={() => handleDeleteModal(row)}>Delete </DropdownMenuItem>
                        </DropdownMenuContent>
					</DropdownMenu>
                  </div>
                );
            },
        },
    ];
    return(
        <AuthorizeAndRenderPage permission="credit|list_credits">
            <div className="flex justify-end absolute right-0 -mt-5">
                 {create_credit &&
                    <Button className="bg-[#4A8D34] text-white cursor-pointer" onClick={() => setAddCreditModal(true)}>
                        <CirclePlus/>
                        Record New Credit
                    </Button>
                }
            </div>
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

                {addCreditModal &&
                    <AddCreditModal
                        open={addCreditModal} 
                        setOpen={setAddCreditModal}
                        refetch={refetch}
                    />
                }

                {viewModal && 
                    <ViewCreditModal 
                        open={viewModal} 
                        setOpen={setViewModal} 
                        defaultData={selected}
                    />
                }
                {paybackModal && 
                    <PaybackModal 
                        open={paybackModal} 
                        setOpen={setPaybackModal} 
                        defaultData={selected}
                        refetch={refetch}
                    />
                }
                {deleteModal && 
                    <DeleteCreditModal
                        open={deleteModal} 
                        setOpen={setDeleteModal}
                        data={selected}
                        refetch={refetch}
                    />
                }
            </div>
        </AuthorizeAndRenderPage>
    )
}