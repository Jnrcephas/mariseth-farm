"use client"
import CustomTable, { IPagination } from "@/components/CustomTable";
import { Button } from "@/components/ui/button";
import { PAGE_SIZE, routeTo } from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { CirclePlus, EllipsisVertical} from "lucide-react";
import { useState } from "react";
import AddCustomerModal from "./Modals/AddCustomerModal";
import { useCustomerList } from "@/apis/adminApiComponents";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import DeleteCustomerModal from "./Modals/DeleteCustomerModal";
import CustomerSearch from "./CustomerSearch";
import { FilterPropsCustomers } from "../utils/types";

export default function CustomersView(){
    const [addModal, setAddModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [selected, setSelected] = useState<any>({})

    const route = useRouter()
    
    const [filters, setFilters] = useState<FilterPropsCustomers>({
        page: 1, page_size: PAGE_SIZE
    })

    const {data, isLoading, refetch} = useCustomerList({queryParams: filters})

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
        { header: "Customer ID", accessorKey: "customer_id" },
        { header: "Name", accessorKey: "name" },
        { header: "Phone Number", accessorKey: "phone_number" },
        { header: "Email", accessorKey: "email" },
        { header: "Company", accessorKey: "company" },
        { header: "Location", accessorKey: "location" },
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
                        <DropdownMenuItem className="cursor-pointer" onClick={() =>  route.push(`${routeTo.viewCustomers}/${row.id}`)}>View </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => handleEditModal(row)}>Edit </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={() => handleDeleteModal(row)}>Delete </DropdownMenuItem>
                        </DropdownMenuContent>
					</DropdownMenu>
                  </div>
                );
            },
        },
    ];
    
    return(
        <div>
            <div className="flex justify-between">
                <div className="font-semibold text-black mb-10">
                    Customers
                </div>
                <Button className="bg-[#4A8D34] hover:bg-[#3f7a2c] text-white cursor-pointer rounded-sm px-6 py-4 text-base font-bold" onClick={() => setAddModal(true)}>
                    <CirclePlus/>
                    Add New Customer
                </Button>
            </div>
            <div>
                <CustomTable 
                    searchFilter={<CustomerSearch setFilters={setFilters} refetch={refetch} isLoading={isLoading} />}
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
                    <AddCustomerModal
                        open={addModal}
                        setOpen={setAddModal}
                        refetch={refetch}
                    />
                }
                {editModal &&
                    <AddCustomerModal
                        isEdit
                        open={editModal}
                        setOpen={setEditModal}
                        refetch={refetch}
                        defaultData={selected}
                    />
                }
                {deleteModal &&
                    <DeleteCustomerModal
                        open={deleteModal}
                        setOpen={setDeleteModal}
                        refetch={refetch}
                        data={selected}
                    />
                }
            </div>
        </div>
    )
}