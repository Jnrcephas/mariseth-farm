"use client"
import CustomTable, { IPagination } from "@/components/CustomTable";
import { Button } from "@/components/ui/button";
import { PAGE_SIZE, routeTo } from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { CirclePlus, EllipsisVertical} from "lucide-react";
import { useState } from "react";
import AddWarehouseModal from "./Modals/AddWarehouseModal";
import { useWarehouseList } from "@/apis/adminApiComponents";
import { FilterPropsWarehouse } from "../utils/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import DeleteWarehouseModal from "./Modals/DeleteWarehouseModal";
import WarehouseSearch from "./WarehouseSearch";
import { AuthorizeAndRenderPage } from "@/components/Unauthorized";
import { useHasAccess } from "@/hooks/auth/useHasAccess";
import { commaSeparator } from "@/lib/helpers";

export default function WareHousesView(){
    const [addModal, setAddModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [selected, setSelected] = useState<any>({})

    const {hasAccess: create_warehouse} = useHasAccess("warehouse|create_warehouse")
    const {hasAccess: delete_warehouse} = useHasAccess("warehouse|delete_warehouse")
    const {hasAccess: update_warehouse} = useHasAccess("warehouse|update_warehouse")

    const route = useRouter()
    
    const [filters, setFilters] = useState<FilterPropsWarehouse>({
        page: 1, page_size: PAGE_SIZE
    })

    const {data, isLoading, refetch} = useWarehouseList({queryParams: filters})

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
        { header: "Warehouse ID", accessorKey: "warehouse_id" },
        { header: "Warehouse Name", accessorKey: "name", },
        { header: "Region", accessorKey: "region",
            cell: (row) => {
                return (
                  <div className="capitalize">
                        {row.cell.row.original.region?.name}
                  </div>
                );
            },
        },
        { header: "District", accessorKey: "district",
            cell: (row) => {
                return (
                  <div className="capitalize">
                        {row.cell.row.original.district?.name}
                  </div>
                );
            },
        },
        { header: "Capacity (tons)", accessorKey: "capacity",
            cell: (_row) =>{
                const capacity = _row.row.original?.capacity
                return(
                    <div>
                        {commaSeparator(capacity)}
                    </div>
                )
            }
         },
        { header: "Managers", accessorKey: "managers",
             cell: (_row) => {
                const managers = _row.row.original?.managers
                return(<div>
                        {managers?.length}
                </div>)
             }
        },
        { header: "Action", accessorKey: "action",
            cell: (tableData) => {
                const infoData = tableData.row.original
                return (
                  <div className="">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className="cursor-pointer">
                            <EllipsisVertical className="text-[#4A8D34]"/>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                        <DropdownMenuItem className="cursor-pointer" onClick={() =>  route.push(`${routeTo.viewWarehouse}/${infoData.id}`)}>View </DropdownMenuItem>
                        {update_warehouse &&
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleEditModal(tableData.row.original)}>Edit </DropdownMenuItem>
                        }
                        {delete_warehouse &&
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
        <AuthorizeAndRenderPage permission={"warehouse|list_warehouses"}>
            <div className="flex justify-between">
                <div className="font-semibold text-black mb-10">
                    Warehouses
                </div>
                {create_warehouse &&
                    <Button className="bg-[#4A8D34] hover:bg-[#3f7a2c] text-white cursor-pointer rounded-sm px-6 py-4 text-base font-bold" onClick={() => setAddModal(true)}>
                        <CirclePlus/>
                        Add New Warehouse
                    </Button>
                }
            </div>
            <div>
                <CustomTable 
                    searchFilter={<WarehouseSearch setFilters={setFilters} filters={filters} refetch={refetch} isLoading={isLoading} />}
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
                    <AddWarehouseModal
                        open={addModal}
                        setOpen={setAddModal}
                        refetch={refetch}
                    />
                }
                {editModal &&
                    <AddWarehouseModal
                        isEdit
                        open={editModal}
                        setOpen={setEditModal}
                        refetch={refetch}
                        defaultData={selected}
                    />
                }
                {deleteModal &&
                    <DeleteWarehouseModal
                        open={deleteModal}
                        setOpen={setDeleteModal}
                        refetch={refetch}
                        data={selected}
                    />
                }
            </div>
        </AuthorizeAndRenderPage>
    )
}