"use client"

import CustomTable, { IPagination } from "@/components/CustomTable";
import { PAGE_SIZE} from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical} from "lucide-react";
import { useState } from "react";
import { FilterPropsProduct } from "../utils/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AddOtherProductsModal from "./Modals/AddOtherProducts";
import DeleteOtherProductModal from "./Modals/DeleteOtherProductModal";
import DeactivateProductModal from "./Modals/DeactivateProductModal";
import ViewProductModal from "./Modals/ViewProductModal";
import { useFarmManagementProductList } from "@/apis/adminApiComponents";
import OtherProductSearch from "./OtherProductSearch";
import { useHasAccess } from "@/hooks/auth/useHasAccess";
import { colorPalate, commaSeparator } from "@/lib/helpers";
import { Badge } from "@/components/ui/badge";
import { CEDI } from "@/lib/constants";

export default function OtherProductsView(){
    const {hasAccess: update_product} = useHasAccess("product|update_product")
    const {hasAccess: delete_product} = useHasAccess("product|delete_product")

    const [viewModal, setViewModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [deactivateModal, setDeactivateModal] = useState(false)
    const [selected, setSelected] = useState<any>({})

    const [filters, setFilters] = useState<FilterPropsProduct>({
        page: 1, page_size: PAGE_SIZE, type: "other"
    })
    
    const {data, isLoading, refetch} = useFarmManagementProductList({queryParams: filters})

    function handleViewModal(data: any){
        setSelected(data)
        setViewModal(true)
    }
    function handleEditModal(data: any){
        setSelected(data)
        setEditModal(true)
    }
    function handleDeleteModal(data: any){
        setSelected(data)
        setDeleteModal(true)
    }
    // function handleDeactivateModal(data: any){
    //     setSelected(data)
    //     setDeactivateModal(true)
    // }

    const handlePaginationChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page }))
    }
    const handleSetPageSize = (pageSize: number) => {
        setFilters((prev) => ({ ...prev, page_size: pageSize}))
    }
    
    const columns: ColumnDef<any>[] = [
        { header: "Product ID", accessorKey: "product_id" },
        { header: "Name", accessorKey: "name", 
            cell: (_row) => {
                const row = _row.cell.row.original
                const colorObj = colorPalate(row?.color)
                return (
                    <div className="space-x-1 space-y-1">
                        <Badge  style={{backgroundColor: colorObj.bgColor, color: colorObj.color}} className="capitalize">
                            {row?.name}
                        </Badge>
                    </div>
                );
            }
        },
       { header: "Category", accessorKey: "category",
            cell: (row) => {
                return (
                  <div className="">
                    
                        {row.cell.row.original.category?.name}
                  </div>
                );
            },
        },
        { header: "Breed", accessorKey: "breed" },
        { header: "Weight", accessorKey: "weight", 
            cell: (_row) =>{
                const row = _row?.row?.original
                return(
                    <div>
                        {row?.weight} {row?.weight_metric?.name}
                    </div>
                )
            }
        },
        { header: "Price", accessorKey: "price",
            cell: (_row) => {
                const price = _row?.row?.original?.price
                return (
                    <div>
                        {price === null || price === undefined || price === "" ? "N/A" : `${CEDI} ${commaSeparator(price)}`}
                    </div>
                )
            }
        },
        { header: "Action", accessorKey: "action",
            cell: (tableData) => {
                return (
                  <div className="">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className="cursor-pointer">
                            <EllipsisVertical className="text-[#4A8D34]"/>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => handleViewModal(tableData.row.original)}>View </DropdownMenuItem>
                        {update_product &&
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleEditModal(tableData.row.original)}>Edit </DropdownMenuItem>
                        }
                        {/* <DropdownMenuItem className="cursor-pointer" onClick={() => handleDeactivateModal(tableData.row.original)}>Deactivate </DropdownMenuItem> */}
                        {delete_product && 
                            <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={() => handleDeleteModal(tableData.row.original)}>Delete </DropdownMenuItem>
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
        <CustomTable 
            searchFilter={<OtherProductSearch setFilters={setFilters} filters={filters} refetch={refetch} isLoading={isLoading} />}
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
        {editModal && 
            <AddOtherProductsModal
                open={editModal} 
                setOpen={setEditModal}
                defaultData={selected}
                isEdit
                refetch={refetch}
            />
        }
        {viewModal && 
            <ViewProductModal
                open={viewModal} 
                setOpen={setViewModal}
                defaultData={selected}
            />
        }
        {deleteModal && 
            <DeleteOtherProductModal
                open={deleteModal} 
                setOpen={setDeleteModal}
                data={selected}
                
            />
        }
        {deactivateModal &&
            <DeactivateProductModal
                open={deactivateModal} 
                setOpen={setDeactivateModal}
                data={selected}
                
            />
        }
    </div>
    )
}
