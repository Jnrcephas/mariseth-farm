"use client"
import CustomTable, { IPagination } from "@/components/CustomTable";
import { PAGE_SIZE, routeTo } from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEmployeeList } from "@/apis/adminApiComponents";
import { useHasAccess } from "@/hooks/auth/useHasAccess";
import { FilterPropsEmployees } from "../utils/types";
import { Badge } from "@/components/ui/badge";
import { statusBadgeMap } from "@/modules/FarmManagement/utils/constants";

export default function AssignedEmployees({departmentId}:{departmentId: string}){
    const {hasAccess: view_employee} = useHasAccess("employee|view_employee")
    const router = useRouter()
    const [filters, setFilters] = useState<FilterPropsEmployees>({
        page: 1, page_size: PAGE_SIZE, department: departmentId
    })

    const {data: _data, isLoading} = useEmployeeList({queryParams:filters})
    const data  = _data as any

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
                    <span className="capitalize">{rowData?.first_name} {rowData?.last_name}</span>
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
        { header: "Leave Days Left", accessorKey: "leave_days_left",
            cell: (_row) => {
                const row = _row.cell?.row?.original
                return(
                    <div>{row?.leave_days_left || 0}</div>
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
                    {view_employee ?
                        <Eye className="cursor-pointer" onClick={() => router.push(`${routeTo.employeeProfilesView}/${row?.id}`)}/>:
                        <Eye className="cursor-not-allowed opacity-10"/>
                    }
                  </div>
                );
            },
        },
    ];
    return(
        <div className="mt-3">  
            <CustomTable 
                // searchFilter={<ProfilesSearch setFilters={setFilters} refetch={refetch} isLoading={isLoading} />}
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
    )
}