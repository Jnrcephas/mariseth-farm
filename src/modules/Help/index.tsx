"use client"
import CustomTable, { IPagination } from "@/components/CustomTable";
import PageTitle from "@/components/layouts/PageTitle";
import { PAGE_SIZE } from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useHelpList } from "@/apis/adminApiComponents";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddHelpModal from "./Modals/AddHelpModal";
import DeleteHelpModal from "./Modals/DeleteHelpModal";
import { FilterProps } from "./utils/types";
import Link from "next/link";
import HelpSearch from "./HelpSearch";

export default function HelpTable(){
    const [addModal, setAddModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [selected, setSelected] = useState<any>({})

    const [filters, setFilters] = useState<FilterProps>({
        page: 1, page_size: PAGE_SIZE, 
    })

    const {data, isLoading, refetch} = useHelpList({queryParams:filters})

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
        { header: "Name", accessorKey: "title" },
        { header: "Link", accessorKey: "url",  
            cell: (cell) => {
                return (
                    <Link href={cell.row.original?.url} target="_blank" className=" underline text-blue-600 cursor-pointer">{cell.row.original?.url}</Link>
            )}
        },
        { header: "Description", accessorKey: "description" },
        { header: "Action", accessorKey: "action",
            cell: (tableData) => {
                return (
                  <div className="">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className="cursor-pointer">
                            <EllipsisVertical className="text-[#4A8D34]"/>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleEditModal(tableData.row.original)}>Edit </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={() => handleDeleteModal(tableData.row.original)}>Delete </DropdownMenuItem>
                        </DropdownMenuContent>
					</DropdownMenu>
                  </div>
                );
            },
        },
    ];
    return(
        <div className="p-5 pt-4">
            <div className="mb-2 flex justify-between w-full">
                <PageTitle title="Help"/>
                
                <Button className="bg-[#4A8D34] font-medium" onClick={() => setAddModal(true)}>Add New Help</Button>
            </div>
            <div>
                <CustomTable 
                    searchFilter={<HelpSearch setFilters={setFilters} isLoading={isLoading} refetch={refetch}/>}
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
                    <AddHelpModal 
                        open={addModal} 
                        setOpen={setAddModal}
                        refetch={refetch}              
                    />
                }
                {editModal &&
                    <AddHelpModal 
                        isEdit
                        defaultData={selected}
                        open={editModal} 
                        setOpen={setEditModal} 
                        refetch={refetch}                
                    />
                }
                {deleteModal &&
                    <DeleteHelpModal 
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