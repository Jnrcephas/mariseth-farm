"use client"
import CustomTable, { IPagination } from "@/components/CustomTable";
import { EllipsisVertical} from "lucide-react";
import { useState } from "react";
import { PAGE_SIZE, routeTo } from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { FilterProps } from "@/modules/FarmManagement/utils/types";
import { statusBadgeMap } from "@/modules/FarmManagement/utils/constants";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AddCropModal from "@/modules/FarmManagement/Products/Modals/AddCropModal";
import { useWarehouseGetWarehouseInventory } from "@/apis/adminApiComponents";
import { commaSeparator, formatDateReadable } from "@/lib/helpers";

export default function InventoryTable({warehouseId}: { warehouseId: number | string }){

    const route = useRouter()

    const [editModal, setEditModal] = useState(false)
    // const [deleteModal, setDeleteModal] = useState(false)
    const [selected, setSelected] = useState<any>({})

    const [filters, setFilters] = useState<FilterProps>({
        page: 1, page_size: PAGE_SIZE
    })

    const {data, isLoading} = useWarehouseGetWarehouseInventory({
        queryParams: filters,
        pathParams: {id: Number(warehouseId)},
    }, {enabled: !!warehouseId})

    const handlePaginationChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page }))
    }
    const handleSetPageSize = (pageSize: number) => {
        setFilters((prev) => ({ ...prev, page_size: pageSize}))
    }
    
    function handleEditModal(data: any){
        setSelected(data)
        setEditModal(true)
    }

    // function handleDeleteModal(data: any){
    //     console.log("deleteModal",deleteModal)
    //     setSelected(data)
    //     setDeleteModal(true)
    // }
   

   
    
    const columns: ColumnDef<any>[] = [
        { header: "ID", accessorKey: "id",
            cell: (_row) => {
                const product_id = _row.row.original?.product?.product_id
                return(<div className="capitalize">
                        {product_id}
                </div>)
            }
         },
        { header: "Name", accessorKey: "name", 
            cell: (_row) => {
                const name = _row.row.original?.product?.name
                return(<div className="capitalize">
                        {name}
                </div>)
            }
         },
        { header: "Category", accessorKey: "category",
            cell: (_row) => {
                const category = _row.row.original?.product?.category?.name
                return(<div className="capitalize">
                        {category}
                </div>)
            }
         },
        { header: "Last Updated", accessorKey: "last_updated",
            cell: (_row) => {
                const last_updated = _row.row.original?.product?.last_updated
                return(<div className="capitalize">
                        {formatDateReadable(last_updated)}
                </div>)
            }
         },
        { header: "Weight", accessorKey: "weight",
            cell: (_row) => {
                const weight = _row.row.original?.weight
                return(<div className="capitalize">
                        {commaSeparator(Number(weight).toFixed(2))} kg
                </div>)
            }
         },
        { header: "Quantity (weight)", accessorKey: "quantity",
            cell: (_row) => {
                const quantity = _row.row.original?.quantity
                return(<div className="capitalize">
                        {commaSeparator(Number(quantity).toFixed(0))}
                </div>)
            }
         },
        { header: "Status", accessorKey: "status",
            cell: (row) => {
                return (
                  <div className="">
                    <Badge variant={statusBadgeMap[row.cell.row.original.product?.season_status]} className="capitalize">
                        {row.cell.row.original.product?.season_status?.replace("_", " ")} Season
                    </Badge>
                  </div>
                );
            },
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
                        <DropdownMenuItem className="cursor-pointer" onClick={() => route.push(`${routeTo.products}/view-product/${tableData.row.original.product?.id}`)}>View </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => handleEditModal(tableData.row.original?.product)}>Edit </DropdownMenuItem>
                        {/* <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={() => handleDeleteModal(tableData.row.original)}>Delete </DropdownMenuItem> */}
                        </DropdownMenuContent>
					</DropdownMenu>
                  </div>
                );
            },
        },
    ];
    return(
        <div>
            {/* <div className="w-full mx-auto mt-10">
                <Card className="rounded-lg overflow-hidden h-[162px] border-1 !shadow-none">
                    <div className="h-full grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-dark/50">
                        <div className="px-6 flex flex-col justify-between">
                        <h3 className="text-sm font-normal mb-1 text-[#4A8D34]">Total Number Of Crops</h3>
                        <p className="text-2xl font-bold mt-4">{data?.results?.length}</p>
                        </div>
            
                        <div className="px-6 flex flex-col justify-between">
                        
                        <h3 className="text-sm font-normal text-[#4A8D34] mb-1">Total</h3>
                        <p className="text-2xl font-bold mt-4"></p>
                        </div>
                    </div>
                </Card>
            </div> */}
            
                
                <CustomTable 
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
                    <AddCropModal
                        open={editModal} 
                        setOpen={setEditModal}
                        defaultData={selected}
                        isEdit
                    />
                }
                
        </div>
    )
}