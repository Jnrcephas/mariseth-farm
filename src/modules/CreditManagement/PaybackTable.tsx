"use client"
import CustomTable, { IPagination } from "@/components/CustomTable";
import { Eye } from "lucide-react";
import { useState } from "react";
import { CEDI, PAGE_SIZE } from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { statusBadgeMap } from "@/modules/FarmManagement/utils/constants";
import { Badge } from "@/components/ui/badge";
import { usePaybackList } from "@/apis/adminApiComponents";
import PaybackSearch from "./PaybackSearch";
import { commaSeparator, formatDateReadable } from "@/lib/helpers";
import ViewPaybackModal from "./Modals/ViewPaybackModal";
import { FilterPropsPayback } from "./utils/types";
import { AuthorizeAndRenderPage } from "@/components/Unauthorized";


export default function PaybackTable(){
    const [filters, setFilters] = useState<FilterPropsPayback>({
        page: 1, page_size: PAGE_SIZE
    })

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
    const {data, isLoading, refetch} = usePaybackList({queryParams: filters})
    
    const columns: ColumnDef<any>[] = [
        { header: "Credit ID", accessorKey: "credit_id",  
            cell: (_row) => {
                const credit_id = _row.row.original?.credit?.credit_id
                return(<div>
                        {credit_id}
                </div>)
             }
        },
        
        { header: "Farmer", accessorKey: "farmer",
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
                        {input_credit?.replace("_", " ") || "N/A"}
                </div>)
            }
         },
        { header: "Credit Type", accessorKey: "type",
            cell: (_row) => {
                const type = _row.row.original?.credit?.input_credit?.category?.name
                return(<div className="capitalize">
                        {type?.replace("_", " ") || "N/A"}
                </div>)
            }
         },
         { header: "Date Paid", accessorKey: "date_paid", 
            cell: (_row) => {
                const date_paid = _row.row.original?.date_paid
                return(<div className="capitalize">
                        {formatDateReadable(date_paid)}
                </div>)
            }
        },
        { header: "Payback Method", accessorKey: "payback_method"
         },
         { header: "Credit Amount", accessorKey: "credit_amount",
            cell: (_row) => {
                const amount = _row.row.original?.credit?.credit_amount || 0
                return(<div>
                       {CEDI} {commaSeparator(amount)}
                </div>)
             }
         },
        { header: "Amount Paid", accessorKey: "amount",
            cell: (_row) => {
                const amount = _row.row.original?.amount || 0
                return(<div>
                       {CEDI} {commaSeparator(amount)}
                </div>)
             }
         },
        /*{ header: "Outstanding", accessorKey: "outstanding_after",
            cell: (_row) => {
                const outstanding_after = _row.row.original?.outstanding_after || 0
                return(
                <div>
                    {CEDI} {commaSeparator(outstanding_after)}
                </div>)
            }
        }*/
        { header: "Status", accessorKey: "status",
            cell: (_row) => {
                const status = String(_row.cell.row.original.status)
                return (
                  <div className="">
                    <Badge variant={statusBadgeMap[status?.toLowerCase()]} className="capitalize">
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
                    <Eye className="text-[#4A8D34] cursor-pointer" onClick={() => handleViewModal(row)}/>
                  </div>
                );
            },
        },
    ];
    return(
        <AuthorizeAndRenderPage permission="payback|list_paybacks">
            <div className="mt-5">
                <CustomTable 
                    searchFilter={<PaybackSearch setFilters={setFilters} filters={filters} refetch={refetch} isLoading={isLoading} />}
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
                    <ViewPaybackModal 
                        open={viewModal} 
                        setOpen={setViewModal} 
                        defaultData={selected}
                    />
                }
            </div>
        </AuthorizeAndRenderPage>
    )
}