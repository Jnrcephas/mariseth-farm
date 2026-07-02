"use client"
import CustomTable, { IPagination } from "@/components/CustomTable";
import { PAGE_SIZE, routeTo } from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical, PlusCircle } from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useEmployeeList } from "@/apis/adminApiComponents";
import { useHasAccess } from "@/hooks/auth/useHasAccess";
import ProfilesSearch from "./ProfilesSearch";
import { FilterPropsEmployees } from "../utils/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { statusBadgeMap } from "@/modules/FarmManagement/utils/constants";
import DeleteEmployeeModal from "./Modals/DeleteEmployeeModal";
import DeactivateEmployeeModal from "./Modals/DeactivateEmployeeModal";
import DisciplinaryModal from "./Modals/DisciplinaryModal";
import ReactivateEmployeeModal from "./Modals/ReactivateEmployeeModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export default function EmployeeProfiles(){
    const {hasAccess: update_employee} = useHasAccess("employee|update_employee")
    const {hasAccess: delete_employee} = useHasAccess("employee|delete_employee")
    const {hasAccess: view_employee} = useHasAccess("employee|view_employee")
    const {hasAccess: add_employee_disciplinary_action} = useHasAccess("employee|add_employee_disciplinary_action")

    const router = useRouter()
    const [deleteModal, setDeleteModal] = useState(false)
    const [disciplinaryModal, setDisciplinaryModal] = useState(false)
    const [deactivateModal, setDeactivateModal] = useState(false)
    const [reactivateModal, setReactivateModal] = useState(false)
    const [selected, setSelected] = useState<any>({})
    const [filters, setFilters] = useState<FilterPropsEmployees>({
        page: 1, page_size: PAGE_SIZE,
    })

    const {data: _data, isLoading, refetch} = useEmployeeList({queryParams:filters})
    const data  = _data as any

    function handleDeleteModal(data: any){
        setSelected(data)
        setDeleteModal(true)
    }

    function handleDeactivateModal(data: any){
        setSelected(data)
        setDeactivateModal(true)
    }

    function handleReactivateModal(data: any){
        setSelected(data)
        setReactivateModal(true)
    }

    function handleDisciplinaryModal(data: any){
        setSelected(data)
        setDisciplinaryModal(true)
    }

    const handlePaginationChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page }))
    }

    const handleSetPageSize = (pageSize: number) => {
        setFilters((prev) => ({ ...prev, page_size: pageSize}))
    }

    
    const columns: ColumnDef<any>[] = [
        { header: "Employee ID", accessorKey: "employee_id" },
        { header: "Full Name", accessorKey: "full_name",
            cell: (_rowData) => {
                const rowData = _rowData.row.original
                return(
                    <div className="flex items-center gap-2">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={rowData?.profile_picture}  />
                            <AvatarFallback>{rowData?.first_name?.[0]}{rowData?.last_name?.[0]}</AvatarFallback>
                        </Avatar>
                        <span className="capitalize">{rowData?.first_name} {rowData?.last_name}</span>
                    </div>
                    
                )
            }
         },
        { header: "Contact Info", accessorKey: "farm_name",
            cell: (_row) => {
                const row = _row.cell?.row?.original
                return(
                    <div className="flex-col">
                        <div className="font-medium">{row?.email}</div>
                        <div className="text-xs">{row?.phone_number}</div>
                    </div>
                )
            }
         },
        { header: "Job Title", accessorKey: "job_title",
            cell: (_row) => {
                const row = _row.cell?.row?.original
                return(
                    <div>{row?.job_title}</div>
                )
            }
         },
        { header: "Department", accessorKey: "department",
            cell: (_row) => {
                const row = _row.cell?.row?.original
                return(
                    <div>{row?.department}</div>
                )
            }
        },
        // { header: "Work Location", accessorKey: "work_location",
        //     cell: (_row) => {
        //         const row = _row.cell?.row?.original
        //         return(
        //             <div>{row?.work_location}</div>
        //         )
        //     }
        // },
        { header: "Annual Leave Remaining", accessorKey: "annual_leave_remaining",
            cell: (_row) => {
                const row = _row.cell?.row?.original
                return(
                    <div>{row?.annual_leave_days_left || 0}</div>
                )
            }
        },
        { header: "Status", accessorKey: "status",
            cell: (_row) => {
                const row = _row.cell?.row?.original
                return(
                    <div>
                        <Badge variant={statusBadgeMap[row.status]} className="capitalize">
                            {row?.status}
                        </Badge>
                    </div>
                )
            }
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
                            {view_employee &&
                                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`${routeTo.employeeProfilesView}/${row?.id}`)}>View </DropdownMenuItem>
                            }
                            {update_employee && 
                                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`${routeTo.employeeProfilesEdit}/${row?.id}`)}>Edit </DropdownMenuItem>
                            }
                            {update_employee && 
                                <>
                                {row.status === "active" ?
                                    <DropdownMenuItem className=" cursor-pointer" onClick={() => handleDeactivateModal(row)}>Deactivate Account </DropdownMenuItem>:
                                    <DropdownMenuItem className=" cursor-pointer" onClick={() => handleReactivateModal(row)}>Reactivate Account </DropdownMenuItem>}
                                </>
                            }
                            {add_employee_disciplinary_action && 
                                <DropdownMenuItem className=" cursor-pointer" onClick={() => handleDisciplinaryModal(row)}>Disciplinary Actions </DropdownMenuItem>
                            }
                            {delete_employee && 
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
                    Employee Profiles
                </div>
                <Link href={routeTo.employeeProfilesAdd}>
                    <Button className=""><PlusCircle/> Add New Employee</Button>
                </Link>
            </div>
            <div >
            <CustomTable 
                searchFilter={<ProfilesSearch setFilters={setFilters} filters={filters} refetch={refetch} isLoading={isLoading} />}
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
            {deleteModal &&
                <DeleteEmployeeModal 
                    open={deleteModal} 
                    setOpen={setDeleteModal}
                    data={selected}
                    refetch={refetch}
                />
            }

            {deactivateModal &&
                <DeactivateEmployeeModal 
                    open={deactivateModal} 
                    setOpen={setDeactivateModal}
                    data={selected}
                    refetch={refetch}
                />
            }
            {reactivateModal &&
                <ReactivateEmployeeModal
                    open={reactivateModal} 
                    setOpen={setReactivateModal}
                    data={selected}
                    refetch={refetch}
                />
            }

            {disciplinaryModal &&
                <DisciplinaryModal 
                    open={disciplinaryModal} 
                    setOpen={setDisciplinaryModal}
                    data={selected}
                    refetch={refetch}
                />
            }
            
            </div>
       
        </div>
    )
}