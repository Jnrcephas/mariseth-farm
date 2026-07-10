"use client"
import CustomTable, { IPagination } from "@/components/CustomTable";
import { PAGE_SIZE} from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { ClockFading, EllipsisVertical, CalendarClock } from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLeaveList } from "@/apis/adminApiComponents";
import { useHasAccess } from "@/hooks/auth/useHasAccess";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LeaveRequestsSearch from "./LeaveRequestsSearch";
import { FilterPropsLeaveRequests } from "./utils/types";
import AddLeaveRequestModal from "./Modals/AddLeaveRequestModal";
import { formatDateReadable } from "@/lib/helpers";
import { statusBadgeMap } from "../FarmManagement/utils/constants";
import ViewLeaveRequestModal from "./Modals/ViewLeaveRequestModal";
import DenyLeaveRequestModal from "./Modals/DenyLeaveRequestModal";
import DeleteLeaveRequestModal from "./Modals/DeleteLeaveRequestModal";


export default function LeaveRequests({pending}:{pending: boolean}){
    const {hasAccess: update_leave_request} = useHasAccess("leave|update_leave_request")
    const {hasAccess: create_leave_request} = useHasAccess("leave|create_leave_request")
    const {hasAccess: delete_leave_request} = useHasAccess("leave|delete_leave_request")
    const {hasAccess: view_leave_request} = useHasAccess("leave|view_leave_request")

    const [addModal, setAddModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [viewModal, setViewModal] = useState(false)
    const [denyModal, setDenyModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [selected, setSelected] = useState<any>({})
    const [filters, setFilters] = useState<FilterPropsLeaveRequests>({
        page: 1, page_size: PAGE_SIZE, pending: pending
    })

    const {data: _data, isLoading, refetch} = useLeaveList({queryParams:filters})
    const data = _data as any

    function handleEditModal(data: any){
        setSelected(data)
        setEditModal(true)
    }
    function handleDeleteModal(data: any){
        setSelected(data)
        setDeleteModal(true)
    }
    function handleViewModal(data: any){
        setSelected(data)
        setViewModal(true)
    }
    function handleDenyModal(data: any){
        setSelected(data)
        setViewModal(false)
        setDenyModal(true)
    }


    const handlePaginationChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page }))
    }

    const handleSetPageSize = (pageSize: number) => {
        setFilters((prev) => ({ ...prev, page_size: pageSize}))
    }

    
    const columns: ColumnDef<any>[] = [
         { header: "Date", accessorKey: "date_created",
            cell: (_row) => {
                const row = _row?.row?.original
                return(
                    <div className="capitalize">{formatDateReadable(row?.date_created)}</div>
                )
            }
        },
        { header: "Request ID", accessorKey: "leave_id",
            cell: (_rowData) => {
                const rowData = _rowData.row.original
                return(
                    <span className="capitalize">{rowData?.leave_id}</span>
                )
            }
         },
        { header: "Employee", accessorKey: "employee",
            cell: (_row) => {
                const row = _row?.row?.original
                return(
                    <div className="capitalize">{row?.employee?.first_name} {row?.employee?.last_name}</div>
                )
            }
         },
        { header: "Leave Type", accessorKey: "leave_type",
            cell: (_row) => {
                const row = _row?.row?.original
                return(
                    <div className="capitalize">{row?.leave_type?.name}</div>
                )
            }
        },
        { header: "From", accessorKey: "start_date",
            cell: (_row) => {
                const row = _row?.row?.original
                return(
                    <div className="capitalize">{formatDateReadable(row?.start_date)}</div>
                )
            }
        },
        { header: "To", accessorKey: "end_date",
            cell: (_row) => {
                const row = _row?.row?.original
                return(
                    <div className="capitalize">{formatDateReadable(row?.end_date)}</div>
                )
            }
        },
        { header: "Annual Leave Remaining", accessorKey: "annual_leave_remaining",
            cell: (_row) => {
                const row = _row?.row?.original
                return(
                    <div className="capitalize">{row?.annual_leave_remaining}</div>
                )
            }
        },
        { header: "Status", accessorKey: "status",
            cell: (_row) => {
                const row = _row?.row?.original
                return(
                    <div><Badge className="capitalize" variant={statusBadgeMap[row?.status]}>{row?.status}</Badge></div>
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
                            {view_leave_request && 
                                <DropdownMenuItem className=" cursor-pointer" onClick={() => handleViewModal(row)}>View </DropdownMenuItem>
                            }  
                            {(row?.status !== "approved") &&
                                <div>
                                    {update_leave_request && 
                                        <DropdownMenuItem className="cursor-pointer" onClick={() => handleEditModal(row)}>Edit </DropdownMenuItem>
                                    }
                                    {delete_leave_request && 
                                        <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={() => handleDeleteModal(row)}>Delete </DropdownMenuItem>
                                    } 
                                </div>
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
                    Leave Management
                </div>
                {create_leave_request && 
                    <Button className="" onClick={() => setAddModal(true)}><ClockFading/> Create Leave Request</Button>
                }
            </div>
            <Card className="p-5 shadow-none border border-[#E2E8F0] mb-5 w-full sm:w-fit">
                <div className="flex items-center gap-4">
                    <div className={`rounded-full p-2.5 flex items-center justify-center ${pending ? "bg-[#FEE2E2]" : "bg-[#D1FAE5]"}`}>
                        <CalendarClock className={`h-5 w-5 ${pending ? "text-[#DC2626]" : "text-[#059669]"}`} />
                    </div>
                    <div>
                        <span className="text-sm text-[#475569] font-medium">{pending ? "Pending Leave Requests" : "Approved Leave Requests"}</span>
                        <p className="text-2xl font-bold text-black">{data?.pagination?.total ?? 0}</p>
                    </div>
                </div>
            </Card>
            <div >
            <CustomTable 
                searchFilter={<LeaveRequestsSearch setFilters={setFilters} refetch={refetch} isLoading={isLoading} pending={pending}/>}
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
            {addModal && 
                <AddLeaveRequestModal 
                    open={addModal} 
                    setOpen={setAddModal}
                    refetch={refetch}
                />
            }
            {editModal && 
                <AddLeaveRequestModal 
                    open={editModal} 
                    setOpen={setEditModal}
                    refetch={refetch}
                    defaultData={selected}
                    isEdit
                />
            }
            {deleteModal && 
                <DeleteLeaveRequestModal
                    open={deleteModal} 
                    setOpen={setDeleteModal}
                    data={selected}
                    refetch={refetch}
                />
            }
            {viewModal && 
                <ViewLeaveRequestModal
                    open={viewModal} 
                    setOpen={setViewModal}
                    data={selected}
                    refetch={refetch}
                    handleDenyModal={handleDenyModal}
                />
            }
            {denyModal &&
                <DenyLeaveRequestModal
                    open={denyModal} 
                    setOpen={setDenyModal}
                    data={selected}
                    refetch={refetch}
                />
            }
            </div>
       
        </div>
    )
}