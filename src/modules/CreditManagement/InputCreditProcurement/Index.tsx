"use client"
import CustomTable, { IPagination } from "@/components/CustomTable";
import { CirclePlus, EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { CEDI, PAGE_SIZE } from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FilterPropsCredit } from "../utils/types";
import {   useInputCreditListInputCreditPurchases } from "@/apis/adminApiComponents";
import { commaSeparator, formatDateReadable } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import InputCreditSearch from "./InputCreditSearch";
import AddInputCreditProcurementModal from "../Modals/AddInputCreditProcurementModal";
import { AuthorizeAndRenderPage } from "@/components/Unauthorized";
import DeleteCreditProcurementModal from "../Modals/DeleteCreditProcurementModal";
import { useHasAccess } from "@/hooks/auth/useHasAccess";

export default function InputCreditProcurement(){

    const [filters, setFilters] = useState<FilterPropsCredit>({
        page: 1, page_size: PAGE_SIZE
    })
    const {data: _data, isPending:isLoading, refetch} = useInputCreditListInputCreditPurchases({queryParams: filters})
    const data = _data as any

    const {hasAccess: delete_input_credit_purchase} = useHasAccess("input_credit|delete_input_credit_purchase")
    const {hasAccess: create_input_credit_purchase} = useHasAccess("input_credit|create_input_credit_purchase")

    const [addModal, setAddModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [selected, setSelected] = useState<any>({})

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
        { header: "ID", accessorKey: "input_credit_purchase_id" },
        { header: "Credit Type", accessorKey: "type", 
            cell: (_row) => {
                const category = _row.row.original?.input_credit?.category?.name
                return(<div>
                        {category}
                </div>)
             }
        },
        { header: "Input Credit", accessorKey: "input_credit",
            cell: (_row) => {
                const name = _row.row.original?.input_credit?.name
                return(<div className="capitalize">
                        {name}
                </div>)
            }
         },
         { header: "Purchase Date", accessorKey: "purchase_created",
            cell: (_row) => {
                const purchase_date = _row.row.original?.purchase_date
                return(<div className="capitalize">
                        {formatDateReadable(purchase_date)}
                </div>)
            }
         },
         { header: "Source", accessorKey: "source",
            cell: (_row) => {
                const source = _row.row.original?.source
                return(<div className="capitalize">
                        {source}
                </div>)
            }
         },
          { header: "Price", accessorKey: "price",
            cell: (_row) => {
                const total_price = _row.row.original?.total_price
                return(<div className="capitalize">
                     {CEDI} {commaSeparator(total_price)}
                </div>)
            }
         },
        { header: "Weight", accessorKey: "weight",
            cell: (_row) => {
                const total_weight = _row.row.original?.total_weight
                return(<div className="capitalize">
                        {commaSeparator(total_weight)}
                </div>)
            }
        },
         { header: "Qty (weight)", accessorKey: "quantity",
            cell: (_row) => {
                const quantity = _row.row.original?.quantity
                return(<div className="capitalize">
                        {commaSeparator(quantity)}
                </div>)
            }
         },
        { header: "Warehouse", accessorKey: "warehouse",
            cell: (_row) => {
                const warehouse = _row.row.original?.warehouse
                return(<div className="capitalize">
                        {warehouse?.name}
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
                            {delete_input_credit_purchase ?
                                <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={() => handleDeleteModal(row)}>Delete </DropdownMenuItem>:
                                <DropdownMenuItem className="text-red-500 cursor-pointer !cursor-not-allowed !opacity-50 disabled">Delete </DropdownMenuItem>
                            }
                        </DropdownMenuContent>
					</DropdownMenu>
                  </div>
                );
            },
        },
    ];
    return(
        <AuthorizeAndRenderPage permission="input_credit|list_input_credit_purchase">
            <div>
                <div className="flex justify-between">
                    <div className="font-semibold text-black mb-10">
                        Input Credit Procurement
                    </div>
                    {create_input_credit_purchase && 
                    <Button className="bg-[#4A8D34] text-white cursor-pointer" onClick={() => setAddModal(true)}>
                        <CirclePlus/>
                        Add Input Credit Purchase
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
                        <AddInputCreditProcurementModal
                            open={addModal} 
                            setOpen={setAddModal}
                            refetch={refetch}
                        />
                    }
                    {deleteModal && 
                        <DeleteCreditProcurementModal
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