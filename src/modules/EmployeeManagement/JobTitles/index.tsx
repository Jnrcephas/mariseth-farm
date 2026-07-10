"use client"
import CustomTable, { IPagination } from "@/components/CustomTable";
import { PAGE_SIZE, routeTo } from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical, PlusCircle, Briefcase } from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useJobTitleList } from "@/apis/adminApiComponents";
import { useHasAccess } from "@/hooks/auth/useHasAccess";
import { FilterPropsEmployees } from "../utils/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import JobTitleSearch from "./JobTitleSearch";
import AddJobTitleModal from "./Modals/AddJobTitleModal";
import DeleteJobTitleModal from "./Modals/DeleteJobTitleModal";


export default function JobTitles(){
     const {hasAccess: update_job_title} = useHasAccess("hr|update_job_title")
    const {hasAccess: create_job_title} = useHasAccess("hr|create_job_title")
    const {hasAccess: delete_job_title} = useHasAccess("hr|delete_job_title")
    const {hasAccess: view_job_title} = useHasAccess("hr|view_job_title")

    const router = useRouter()
    const [addModal, setAddModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [selected, setSelected] = useState<any>({})
    const [filters, setFilters] = useState<FilterPropsEmployees>({
        page: 1, page_size: PAGE_SIZE,
    })

    const {data: _data, isLoading, refetch} = useJobTitleList({queryParams:filters})
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
        console.log("filters", filters)
        setFilters((prev) => ({ ...prev, page }))
    }

    const handleSetPageSize = (pageSize: number) => {
        setFilters((prev) => ({ ...prev, page_size: pageSize}))
    }

    
    const columns: ColumnDef<any>[] = [
        { header: "Job Title ID", accessorKey: "job_title_id" },
        { header: "Job Title", accessorKey: "name",
            cell: (_rowData) => {
                const rowData = _rowData.row.original
                return(
                    <span className="capitalize">{rowData?.name}</span>
                )
            }
         },
        { header: "Department", accessorKey: "department",
            cell: (_row) => {
                const row = _row.cell?.row?.original
                return(
                    <div>{row?.department?.name}</div>
                )
            }
         },
        { header: "Employees Assigned", accessorKey: "number_of_employees" },
        
        { header: "Level", accessorKey: "level",
            cell: (_row) => {
                const row = _row.cell?.row?.original
                return(
                    <div>{row?.level?.name}</div>
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
                            {view_job_title &&
                                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`${routeTo.employeeViewJobTitle}/${row?.id}`)}>View </DropdownMenuItem>
                            }
                            {update_job_title && 
                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleEditModal(row)}>Edit </DropdownMenuItem>
                            }
                            {delete_job_title && 
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
                    Job Titles
                </div>
                {create_job_title && 
                    <Button className="" onClick={() => setAddModal(true)}><PlusCircle/> Add New Job Title</Button>
                }
                
            </div>
            <Card className="p-5 shadow-none border border-[#E2E8F0] mb-5 w-full sm:w-fit">
                <div className="flex items-center gap-4">
                    <div className="rounded-full p-2.5 flex items-center justify-center bg-[#FEF3C7]">
                        <Briefcase className="h-5 w-5 text-[#D97706]" />
                    </div>
                    <div>
                        <span className="text-sm text-[#475569] font-medium">Total Job Titles</span>
                        <p className="text-2xl font-bold text-black">{data?.pagination?.total ?? 0}</p>
                    </div>
                </div>
            </Card>
            <div >
            <CustomTable 
                searchFilter={<JobTitleSearch setFilters={setFilters} refetch={refetch} isLoading={isLoading} />}
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
                <AddJobTitleModal 
                    open={addModal} 
                    setOpen={setAddModal}
                    refetch={refetch}
                />
            }
            {editModal && 
                <AddJobTitleModal 
                    open={editModal} 
                    setOpen={setEditModal}
                    refetch={refetch}
                    defaultData={selected}
                    isEdit
                />
            }
            {deleteModal && 
                <DeleteJobTitleModal
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