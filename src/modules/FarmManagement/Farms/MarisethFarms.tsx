import CustomTable, { IPagination } from "@/components/CustomTable";
import { PAGE_SIZE } from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical} from "lucide-react";
import { useState } from "react";
import { FilterPropsFarms } from "../utils/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AddMerisethFarmModal from "./Modals/AddMerisethFarm";
import DeleteFarmModal from "./Modals/DeleteFarm";
import { useFarmManagementFarmList } from "@/apis/adminApiComponents";
import ViewMarisethFarm from "./Modals/ViewMarisethFarm";
import MarisethFarmSearch from "./MarisethFarmSearch";
import { useHasAccess } from "@/hooks/auth/useHasAccess";
import { Badge } from "@/components/ui/badge";
import { colorPalate, commaSeparator } from "@/lib/helpers";


export default function MarisethFarms(){

    const {hasAccess: update_farm} = useHasAccess("farm|update_farm")
    const {hasAccess: delete_farm} = useHasAccess("farm|delete_farm")

    const [viewModal, setViewModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [selected, setSelected] = useState<any>({})
   
    const [filters, setFilters] = useState<FilterPropsFarms>({
        page: 1, page_size: PAGE_SIZE, farm_type: "internal"
    })
   
    const {data, isLoading, refetch} = useFarmManagementFarmList({queryParams: filters})
   
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


    const handlePaginationChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page }))
    }
    const handleSetPageSize = (pageSize: number) => {
        setFilters((prev) => ({ ...prev, page_size: pageSize}))
    }
    
    const columns: ColumnDef<any>[] = [
        { header: "Farm ID", accessorKey: "farm_id" },
        { header: "Farm Name", accessorKey: "name", },
        { header: "Type of Farm", accessorKey: "type", },
        { header: "Size", accessorKey: "size",
            cell: (_row) => {
                const row = _row.cell.row.original
                return (
                  <div className="capitalize">
                        {commaSeparator(row?.size)} <span className="lowercase">{row?.size_metric?.name}</span>
                  </div>
                );
            },
         },
        { header: "Location", accessorKey: "location" },
        { header: "District", accessorKey: "district",
            cell: (row) => {
                return (
                  <div className="capitalize">
                        {row.cell.row.original.district?.name}
                  </div>
                );
            },
         },
         { header: "Main Crops", accessorKey: "crops",
            cell: (_row) => {
                const row = _row.cell.row.original
                return (
                  <div className="space-x-1 space-y-1">
                    {row?.crops?.map((item:any, idx: number) => (
                        <Badge key={idx} style={{backgroundColor: colorPalate(item?.product?.color).bgColor, color: colorPalate(item?.product?.color).color}} className="capitalize">
                            {item?.product?.name}
                        </Badge>
                    ))}
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
                        <DropdownMenuItem className="cursor-pointer" onClick={() => handleViewModal(tableData.row.original)}>View </DropdownMenuItem>
                        {update_farm && 
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleEditModal(tableData.row.original)}>Edit </DropdownMenuItem>
                        }
                        {delete_farm &&
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
            searchFilter={<MarisethFarmSearch setFilters={setFilters} filters={filters} refetch={refetch} isLoading={isLoading} />}
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
        {viewModal && 
            <ViewMarisethFarm open={viewModal} setOpen={setViewModal} data={selected}/>
        }
        {editModal && 
            <AddMerisethFarmModal
                open={editModal} 
                setOpen={setEditModal}
                defaultData={selected}
                refetch={refetch}
                isEdit
            />
        }
        {deleteModal && 
            <DeleteFarmModal
                open={deleteModal} 
                setOpen={setDeleteModal}
                data={selected}
                refetch={refetch}
            />
        }
    </div>
    )
}