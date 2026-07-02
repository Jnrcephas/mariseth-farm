"use client"
import CustomTable, { IPagination } from "@/components/CustomTable";
import { PAGE_SIZE, routeTo } from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { EllipsisVertical} from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { FilterProps, IFarmer } from "../../utils/types";
import { statusBadgeMap } from "../../utils/constants";
import { useFarmManagementFarmerGetSmallholdersByLead } from "@/apis/adminApiComponents";
import SmallholderByLeadSearch from "./SmallholderByLeadSearch";
import DropdownButton from "@/components/customs/ButtonDropdown";
import ReassignLeadFarmerModal from "../Modals/ReassignLeadFarmerModal";
import { commaSeparator } from "@/lib/helpers";

export default function LeadFarmerSmallholderFarmers({defaultData}:{defaultData: IFarmer}){
    const router = useRouter()

    const [detachModal, setDetachModal] = useState(false)
    const [selectedFarmers, setSelectedFarmers] = useState<any[]>([]);


    const [bulkAction, setBulkAction] = useState(false)

    const [filters, setFilters] = useState<FilterProps>({
        page: 1, page_size: PAGE_SIZE
    })

    const {data, isPending:isLoading, refetch} = useFarmManagementFarmerGetSmallholdersByLead({
        queryParams: filters,
        pathParams: {id: Number(defaultData?.id),
      }},{enabled: !!defaultData?.id})

    function handleDetachModal(values: any[]){
        setSelectedFarmers(values)
        setDetachModal(true)
    }

    const handlePaginationChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page }))
    }

    const handleSetPageSize = (pageSize: number) => {
        setFilters((prev) => ({ ...prev, page_size: pageSize}))
    }
    
    const columns: ColumnDef<any>[] = [
         { header: "Farm ID", accessorKey: "farmer_id" },
       { header: "Farmer Name", accessorKey: "farmer_name",
            cell: (_rowData) => {
                const rowData = _rowData.row.original
                return(
                    <span className="capitalize">{rowData?.first_name} {rowData?.last_name}</span>
                )
            }
         },
        { header: "Farm Name", accessorKey: "farm_name",
            cell: (_row) => {
                const row = _row.cell?.row?.original
                return(
                    <div>{row?.farm?.name}</div>
                )
            }
         },
        { header: "Operational Area", accessorKey: "village" },
        { header: "Size (Acres)", accessorKey: "size",  
            cell: (_row) => {
                const row = _row.cell?.row?.original
                return(
                    <div>{commaSeparator(row?.farm?.size)}</div>
                )
            }
        },
        { header: "Lead Farmer Name", accessorKey: "lead_farmer_name",
             cell: (_rowData) => {
                const rowData = _rowData.row.original
                return(
                    <span className="capitalize">{rowData?.lead_farmer?.first_name} {rowData?.lead_farmer?.last_name}</span>
                )
            }
         },
        { header: "Land Ownership", accessorKey: "land_ownership",
            cell: (_rowData) => {
                const rowData = _rowData.row.original
                return (
                  <div className="">
                    {rowData.original?.farm?.land_ownership &&
                        <Badge variant={statusBadgeMap[rowData.farm?.land_ownership]} className="capitalize">
                            {rowData.original?.farm?.land_ownership}
                        </Badge>
                    }
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
                            <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`${routeTo.viewSmallholderFarmer}/${tableData.row?.original?.id}`)}>View </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={() => handleDetachModal([tableData.row.original])}>Reassign Lead Farmer </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
            },
        },
    ];
    return(
    <div className="">
        <CustomTable 
            enableRowSelection
            columns={columns} 
            searchFilter={<SmallholderByLeadSearch setFilters={setFilters} filters={filters} refetch={refetch} isLoading={isLoading} />}
            data={data?.results || []} 
            setPerPage={handleSetPageSize} 
            perPage={filters.page_size || PAGE_SIZE} 
            isLoading={isLoading}
            currentPage={filters?.page}
            count={data?.pagination?.total || 0}
            handlePaginationChange={handlePaginationChange}
            pagination={data?.pagination as IPagination}
            bulkActions={
                (selected: any[]) => (
                <DropdownButton
                    className="!bg-white !text-green-700 border border-green-700"
                    open={bulkAction} 
                    setOpen={setBulkAction} 
                    title="Bulk Action" 
                    menuItems={[
                    <DropdownMenuItem key="external-farm" onClick={() => handleDetachModal(selected)} className="py-3 px-6 text-gray-700  text-sm font-normal hover:bg-gray-50 focus:bg-gray-50 cursor-pointer">
                        Reassign Lead Farmer
                    </DropdownMenuItem>
                    ]}
                />)
            }
        />
       
        {detachModal && 
            <ReassignLeadFarmerModal
                open={detachModal} 
                setOpen={setDetachModal}
                data={selectedFarmers}
                refetch={refetch}
            />
        }
    </div>
    )
}