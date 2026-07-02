import CustomTable, { IPagination } from "@/components/CustomTable";
import { PAGE_SIZE, routeTo } from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { FilterProps } from "../utils/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import DeleteFarmerModal from "./Modals/DeleteFarmer";
import { useRouter } from "next/navigation";
import { useFarmManagementFarmerList } from "@/apis/adminApiComponents";
import LeadFarmerSearch from "./LeadFarmerSearch";
import { useHasAccess } from "@/hooks/auth/useHasAccess";
import { commaSeparator } from "@/lib/helpers";


export default function LeadFarmers(){
    const {hasAccess: update_farmer} = useHasAccess("farmer|update_farmer")
    const {hasAccess: delete_farmer} = useHasAccess("farmer|delete_farmer")
    const {hasAccess: view_farmer} = useHasAccess("farmer|view_farmer")

    const router = useRouter()
    const [deleteModal, setDeleteModal] = useState(false)
    const [selected, setSelected] = useState<any>({})
    const [filters, setFilters] = useState<FilterProps>({
        page: 1, page_size: PAGE_SIZE, farmer_type: "lead"
    })

    const {data, isLoading, refetch} = useFarmManagementFarmerList({queryParams:filters})

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
        { header: "Farmer ID", accessorKey: "farmer_id" },
        { header: "Farmer Name", accessorKey: "farmer_name",
            cell: (_rowData) => {
                const rowData = _rowData.row.original
                return(
                    <span className="capitalize">{rowData?.first_name} {rowData?.last_name}</span>
                )
            }
         },
        { header: "Main Farm", accessorKey: "farm_name",
            cell: (_row) => {
                const row = _row.cell?.row?.original
                return(
                    <div>{row?.farm?.name}</div>
                )
            }
         },
        { header: "Operational Area", accessorKey: "village" },
        { header: "Size", accessorKey: "size",  
            cell: (_row) => {
                const row = _row.cell?.row?.original
                return(
                    <div>{commaSeparator(row?.farm?.size)} <span className="lowercase">{row?.farm?.size_metric?.name}</span></div>
                )
            }
        },
        { header: "Number Of Smallholder Farmers", accessorKey: "number_of_smallholders",
            cell: (_row) => {
                const row = _row.cell?.row?.original
                return(
                    <div>{row?.number_of_smallholders || 0}</div>
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
                            {view_farmer &&
                                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`${routeTo.viewLeadFarmer}/${tableData.row?.original?.id}`)}>View </DropdownMenuItem>
                            }
                            {update_farmer && 
                                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`${routeTo.editLeadFarmer}/${tableData.row?.original?.id}`)}>Edit </DropdownMenuItem>
                            }
                             {delete_farmer && 
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
            searchFilter={<LeadFarmerSearch setFilters={setFilters} filters={filters} refetch={refetch} isLoading={isLoading} />}
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
       
        {deleteModal && 
            <DeleteFarmerModal 
                open={deleteModal} 
                setOpen={setDeleteModal}
                data={selected}
                refetch={refetch}
            />
        }
       
    </div>
    )
}