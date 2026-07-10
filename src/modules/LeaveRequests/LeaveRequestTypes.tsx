"use client"
import CustomTable, { IPagination } from "@/components/CustomTable";
import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical, PlusCircle, CalendarDays } from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLeaveTypeList } from "@/apis/adminApiComponents";
import { useHasAccess } from "@/hooks/auth/useHasAccess";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FilterPropsLeaveRequests } from "./utils/types";
import AddLeaveTypeModal from "./Modals/AddLeaveTypeModal";
import DeleteLeaveTypeModal from "./Modals/DeleteLeaveTypeModal";
import LeaveRequestTypeSearch from "./LeaveRequestTypeSearch";


export default function LeaveRequestTypes(){
     const {hasAccess: update_leave_type} = useHasAccess("leave|update_leave_type")
    const {hasAccess: create_leave_type} = useHasAccess("leave|create_leave_type")
    const {hasAccess: delete_leave_type} = useHasAccess("leave|delete_leave_type")

    const [addModal, setAddModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [selected, setSelected] = useState<any>({})
    const [filters, setFilters] = useState<FilterPropsLeaveRequests>({
        page: 1, page_size: 50,
    })

    const {data: _data, isLoading, refetch} = useLeaveTypeList({queryParams:filters})
    const data = _data as any

    function handleEditModal(data: any){
        setSelected(data)
        setEditModal(true)
    }
    function handleDeleteModal(data: any){
        setSelected(data)
        setDeleteModal(true)
    }

    const handlePaginationChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page }))
    }

    const handleSetPageSize = (pageSize: number) => {
        setFilters((prev) => ({ ...prev, page_size: pageSize}))
    }

    
     const columns: ColumnDef<any>[] = [
        { header: "Name", accessorKey: "name",
            cell: (_rowData) => {
                const rowData = _rowData.row.original
                return(
                    <span className="capitalize">{rowData?.name}</span>
                )
            }
         },
        { header: "Description", accessorKey: "description",
            cell: (_row) => {
                const row = _row?.row?.original
                return(
                    <div>{row?.description}</div>
                )
            }
         },
        { header: "Maximum Days", accessorKey: "max_days",
            cell: (_row) => {
                const row = _row?.row?.original
                return(
                    <div>{row?.max_days}</div>
                )
            }
        },
        { header: "Deducts From Allowances", accessorKey: "deducts_from_allowance",
            cell: (_row) => {
                const row = _row?.row?.original
                return(
                    <div><Badge className="capitalize" variant={`${row?.deducts_from_allowance ? "success" : "danger" }`}>{row?.deducts_from_allowance ? "Yes" : "No"}</Badge></div>
                )
            }
        },
        { header: "Deduct From", accessorKey: "deduct_from",
            cell: (_row) => {
                const row = _row?.row?.original
                return(
                    <div className="capitalize">{row?.deduct_from}</div>
                )
            }
         },
        { header: "Action", accessorKey: "action",
            cell: (_row) => {
                const row = _row?.row?.original
                return (
                  <div className="">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className="cursor-pointer">
                            <EllipsisVertical className="text-[#4A8D34]"/>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            
                            {update_leave_type && 
                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleEditModal(row)}>Edit </DropdownMenuItem>
                            }
                             {delete_leave_type && 
                                <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={() => handleDeleteModal(row)}>Delete </DropdownMenuItem>
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
            },
        },
    ];
    return(
        <div className="mt-3">
            <div className="flex justify-between items-center mb-5">
                <div className="font-semibold text-black ">
                    Leave Types
                </div>
                {create_leave_type && 
                    <Button className="" onClick={() => setAddModal(true)}><PlusCircle/> Add Leave Type</Button>
                }
            </div>
            <Card className="p-5 shadow-none border border-[#E2E8F0] mb-5 w-full sm:w-fit">
                <div className="flex items-center gap-4">
                    <div className="rounded-full p-2.5 flex items-center justify-center bg-[#D1FAE5]">
                        <CalendarDays className="h-5 w-5 text-[#059669]" />
                    </div>
                    <div>
                        <span className="text-sm text-[#475569] font-medium">Total Leave Types</span>
                        <p className="text-2xl font-bold text-black">{data?.pagination?.total ?? 0}</p>
                    </div>
                </div>
            </Card>
            <div >
            <CustomTable 
                searchFilter={<LeaveRequestTypeSearch setFilters={setFilters} refetch={refetch} isLoading={isLoading} />}
                columns={columns} 
                data={data?.results || []} 
                setPerPage={handleSetPageSize} 
                perPage={50} 
                isLoading={isLoading}
                currentPage={filters?.page}
                count={data?.results?.length || 0}
                handlePaginationChange={handlePaginationChange}
                pagination={data?.pagination as IPagination}
            />
            {addModal && 
                <AddLeaveTypeModal 
                    open={addModal} 
                    setOpen={setAddModal}
                    refetch={refetch}
                />
            }
            {editModal && 
                <AddLeaveTypeModal 
                    open={editModal} 
                    setOpen={setEditModal}
                    refetch={refetch}
                    defaultData={selected}
                    isEdit
                />
            }
            {deleteModal && 
                <DeleteLeaveTypeModal
                    open={deleteModal} 
                    setOpen={setDeleteModal}
                    data={selected}
                    refetch={refetch}
                />
            }
            </div>
       
        </div>
    )
}