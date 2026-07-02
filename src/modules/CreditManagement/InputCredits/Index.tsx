"use client"
import CustomTable, { IPagination } from "@/components/CustomTable";
import { CirclePlus, EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { PAGE_SIZE } from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FilterPropsCredit } from "../utils/types";
import {  useInputCreditList } from "@/apis/adminApiComponents";
import { commaSeparator, formatDateReadable } from "@/lib/helpers";
import DeleteInputCreditModal from "../Modals/DeleteInputCreditModal";
import { Button } from "@/components/ui/button";
import InputCreditSearch from "./InputCreditSearch";
import AddInputCreditModal from "./AddInputCreditModal";
import { AuthorizeAndRenderPage } from "@/components/Unauthorized";
import { useHasAccess } from "@/hooks/auth/useHasAccess";

export default function InputCreditTable(){

    const [filters, setFilters] = useState<FilterPropsCredit>({
        page: 1, page_size: PAGE_SIZE
    })
    const {data: _data, isPending: isLoading, refetch} = useInputCreditList({queryParams: filters})
    const data = _data as any

    const {hasAccess: create_input_credit} = useHasAccess("input_credit|create_input_credit")
    const {hasAccess: update_input_credit} = useHasAccess("input_credit|update_input_credit")
    const {hasAccess: delete_input_credit} = useHasAccess("input_credit|delete_input_credit")

    const [addModal, setAddModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [selected, setSelected] = useState<any>({})

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
        // { header: "Credit ID", accessorKey: "credit_id" },
        { header: "Name", accessorKey: "name", 
            cell: (_row) => {
                const name = _row.row.original?.name
                return(<div>
                        {name}
                </div>)
             }
        },
        { header: "Category", accessorKey: "category",
            cell: (_row) => {
                const category = _row.row.original?.category
                return(<div className="capitalize">
                        {category?.name}
                </div>)
            }
         },
        { header: "Price (GH₵)", accessorKey: "price",
            cell: (_row) => {
                const price = _row.row.original?.price
                return(<div className="capitalize">
                        {commaSeparator(price)}
                </div>)
            }
        },
        { header: "Weight", accessorKey: "weight",
            cell: (_row) => {
                const weight = _row.row.original?.weight
                return(<div className="capitalize">
                        {weight}
                </div>)
            }

         },
        { header: "Date Created", accessorKey: "date_created",
            cell: (_row) => {
                const date_created = _row.row.original?.date_created
                return(<div className="capitalize">
                        {formatDateReadable(date_created)}
                </div>)
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

                            <DropdownMenuItem  disabled={!update_input_credit} className="cursor-pointer" onClick={() => handleEditModal(row)}>Edit </DropdownMenuItem>
                            <DropdownMenuItem disabled={!delete_input_credit}  className="text-red-500 cursor-pointer" onClick={() => handleDeleteModal(row)}>Delete </DropdownMenuItem>
                        </DropdownMenuContent>
					</DropdownMenu>
                  </div>
                );
            },
        },
    ];
    return(
        <AuthorizeAndRenderPage permission="input_credit|list_input_credit">
            <div>
                <div className="flex justify-between">
                    <div className="font-semibold text-black mb-10">
                        Input Credits
                    </div>
                    {create_input_credit && 
                    <Button className="bg-[#4A8D34] text-white cursor-pointer" onClick={() => setAddModal(true)}>
                        <CirclePlus/>
                        Add Input Credit
                    </Button>}
                </div>
                <div className="mt-5">
                    <CustomTable 
                        searchFilter={<InputCreditSearch setFilters={setFilters} filters={filters} refetch={refetch} isLoading={isLoading} />}
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
                        <AddInputCreditModal
                            open={addModal} 
                            setOpen={setAddModal}
                            refetch={refetch}
                        />
                    }
                    {editModal && 
                        <AddInputCreditModal
                            open={editModal} 
                            setOpen={setEditModal}
                            refetch={refetch}
                            defaultData={selected}
                            isEdit
                        />
                    }
                    {deleteModal && 
                        <DeleteInputCreditModal
                            open={deleteModal} 
                            setOpen={setDeleteModal}
                            data={selected}
                            refetch={refetch}
                        />
                    }
                </div>
            </div>
        </AuthorizeAndRenderPage>
    )
}