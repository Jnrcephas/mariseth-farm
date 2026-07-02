import CustomTable, { IPagination } from "@/components/CustomTable";
import { PAGE_SIZE, routeTo } from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical} from "lucide-react";
import { useState } from "react";
import { FilterPropsProduct } from "../utils/types";
import { statusBadgeMap} from "../utils/constants";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AddCropModal from "./Modals/AddCropModal";
import DeleteCropModal from "./Modals/DeleteCropModal";
import { Badge } from "@/components/ui/badge";
import DeactivateCropModal from "./Modals/DeactivateCropModal";
import { useRouter } from "next/navigation";
import { useFarmManagementProductList } from "@/apis/adminApiComponents";
import CropsSearch from "./CropsSearch";
import { useHasAccess } from "@/hooks/auth/useHasAccess";
import { colorPalate } from "@/lib/helpers";

export default function CropsView(){

    const {hasAccess: update_product} = useHasAccess("product|update_product")
    const {hasAccess: delete_product} = useHasAccess("product|delete_product")

    const route = useRouter()

    const [editModal, setEditModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [deactivateModal, setDeactivateModal] = useState(false)
    const [selected, setSelected] = useState<any>({})

    const [filters, setFilters] = useState<FilterPropsProduct>({
        page: 1, page_size: PAGE_SIZE, type: "crop"
    })

    const {data, isLoading, refetch} = useFarmManagementProductList({queryParams: filters})

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
        // { header: "Weight (kg)", accessorKey: "weight" },
        // { header: "Quantity", accessorKey: "quantity" },
        { header: "Status", accessorKey: "season_status",
            cell: (row) => {
                const cell =  row.cell.row.original
                return (
                  <div className="">
                    <Badge variant={statusBadgeMap[cell.season_status]} className="capitalize">
                        {cell.season_status} Season
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
                        <DropdownMenuItem className="cursor-pointer" onClick={() => route.push(`${routeTo.products}/view-product/${tableData.row.original.id}`)}>View </DropdownMenuItem>
                        
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
            searchFilter={<CropsSearch setFilters={setFilters} filters={filters} refetch={refetch} isLoading={isLoading} />}
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
                refetch={refetch}
            />
        }
        {deleteModal && 
            <DeleteCropModal
                open={deleteModal} 
                setOpen={setDeleteModal}
                data={selected}
                refetch={refetch}
            />
        }
        {deactivateModal &&
            <DeactivateCropModal
                open={deactivateModal} 
                setOpen={setDeactivateModal}
                data={selected}
                refetch={refetch}
            />
        }
    </div>
    )
}