"use client"
import CustomTable, { IPagination } from "@/components/CustomTable";
import { Eye} from "lucide-react";
import { useState } from "react";
import { PAGE_SIZE, routeTo } from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { FilterProps } from "@/modules/FarmManagement/utils/types";
import { useRouter } from "next/navigation";
import { useWarehouseGetInputCreditInventory } from "@/apis/adminApiComponents";
import { commaSeparator } from "@/lib/helpers";

export default function WarehouseInputCredits({warehouseId}: { warehouseId: number | string }){

    const route = useRouter()

    const [filters, setFilters] = useState<FilterProps>({
        page: 1, page_size: PAGE_SIZE
    })

    const {data: _data, isLoading} = useWarehouseGetInputCreditInventory({
        queryParams: filters,
        pathParams: {id: Number(warehouseId)},
    }, {enabled: !!warehouseId})

    const data = _data as any

    const handlePaginationChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page }))
    }
    const handleSetPageSize = (pageSize: number) => {
        setFilters((prev) => ({ ...prev, page_size: pageSize}))
    }
    
    const columns: ColumnDef<any>[] = [
        { header: "Input Credit ID", accessorKey: "input_credit_id",
            cell: (_row) => {
                const product_id = _row.row.original?.input_credit?.input_credit_id
                return(<div className="capitalize">
                        {product_id}
                </div>)
            }
         },
        { header: "Name", accessorKey: "name", 
            cell: (_row) => {
                const name = _row.row.original?.input_credit?.name
                return(<div className="capitalize">
                        {name}
                </div>)
            }
         },
        { header: "Credit Type", accessorKey: "type",
            cell: (_row) => {
                const category = _row.row.original?.input_credit?.category?.name
                return(<div className="capitalize">
                        {category}
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
        { header: "Action", accessorKey: "action",
            cell: (tableData) => {
                return (
                  <div className="">
                    <Eye className="cursor-pointer text-[#4A8D34]" onClick={() => route.push(`${routeTo.warehouses}/view-warehouse/${warehouseId}/input-credit/${tableData.row.original.input_credit?.id}`)}/>
                  </div>
                );
            },
        },
    ];
    return(
        <div>
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
        </div>
    )
}