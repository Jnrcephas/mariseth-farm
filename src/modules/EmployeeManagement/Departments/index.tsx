"use client"
import CustomTable, { IPagination } from "@/components/CustomTable";
import { PAGE_SIZE, routeTo } from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical, PlusCircle } from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useDepartmentList } from "@/apis/adminApiComponents";
import { useHasAccess } from "@/hooks/auth/useHasAccess";
import { FilterPropsEmployees } from "../utils/types";
import { Button } from "@/components/ui/button";
import DepartmentSearch from "./DepartmentSearch";
import AddNewDepartmentModal from "./Modals/AddNewDepartmentModal";
import { Badge } from "@/components/ui/badge";
import DeleteDepartmentModal from "./Modals/DeleteDepartmentModal";


export default function Departments(){
    const {hasAccess: update_department} = useHasAccess("hr|update_department")
    const {hasAccess: create_department} = useHasAccess("hr|create_department")
    const {hasAccess: delete_department} = useHasAccess("hr|delete_department")
    const {hasAccess: view_department} = useHasAccess("hr|view_department")

    const router = useRouter()
    const [addModal, setAddModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [selected, setSelected] = useState<any>({})
    const [filters, setFilters] = useState<FilterPropsEmployees>({
        page: 1, page_size: PAGE_SIZE,
    })

    const {data: _data, isLoading, refetch} = useDepartmentList({queryParams:filters})
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
        { header: "Department ID", accessorKey: "department_id" },
        { header: "Name", accessorKey: "name",
            cell: (_rowData) => {
                const rowData = _rowData.row.original
                return(
                    <span className="capitalize">{rowData?.name}</span>
                )
            }
         },
        { header: "Employees Assigned", accessorKey: "number_of_employees",
            cell: (_row) => {
                const row = _row?.row?.original
                return(
                    <div>{row?.number_of_employees}</div>
                )
            }
         },
        { header: "Status", accessorKey: "status",
            cell: (_row) => {
                const row = _row?.row?.original
                return(
                    <div><Badge className="capitalize" variant={`${row?.status === "active" ? "success" : "danger" }`}>{row?.status}</Badge></div>
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
                            {view_department &&
                                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`${routeTo.employeeViewDepartment}/${row?.id}`)}>View </DropdownMenuItem>
                            }
                            {update_department && 
                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleEditModal(row)}>Edit </DropdownMenuItem>
                            }
                             {delete_department && 
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
                    Department
                </div>
                {create_department && 
                    <Button className="" onClick={() => setAddModal(true)}><PlusCircle/> Add New Department</Button>
                }
            </div>
            <div >
            <CustomTable 
                searchFilter={<DepartmentSearch setFilters={setFilters} refetch={refetch} isLoading={isLoading} />}
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
                <AddNewDepartmentModal 
                    open={addModal} 
                    setOpen={setAddModal}
                    refetch={refetch}
                />
            }
            {editModal && 
                <AddNewDepartmentModal 
                    open={editModal} 
                    setOpen={setEditModal}
                    refetch={refetch}
                    defaultData={selected}
                    isEdit
                />
            }
            {deleteModal && 
                <DeleteDepartmentModal
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