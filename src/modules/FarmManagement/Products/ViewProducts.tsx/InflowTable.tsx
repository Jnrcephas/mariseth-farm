"use client"
import CustomTable, { IPagination } from "@/components/CustomTable";
import { Eye } from "lucide-react";
import { useState } from "react";
import { FilterProps } from "../../utils/types";
import { CEDI, PAGE_SIZE } from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import ViewFlowDetailsModal from "./ViewFlowDetailsModal";
import { useFarmManagementProductGetProductMovement } from "@/apis/adminApiComponents";
import { commaSeparator, formatDateReadable } from "@/lib/helpers";


export default function InflowTable({product}: { product?: any }) {

    const [viewModal, setViewModal] = useState(false)
    const [selected, setSelected] = useState<any>({})

    const [filters, setFilters] = useState<FilterProps>({
        page: 1, page_size: PAGE_SIZE, order_type: "inflow"
    })

    const {data, isLoading} = useFarmManagementProductGetProductMovement({
        queryParams: filters,
        pathParams: {id: Number(product?.id)}, 
    },{enabled: !!product?.id})

    const handlePaginationChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page }))
    }
    const handleSetPageSize = (pageSize: number) => {
        setFilters((prev) => ({ ...prev, page_size: pageSize}))
    }

    function handleViewModal(data: any){
        setSelected(data)
        setViewModal(true)
    }
   
    
    const columns: ColumnDef<any>[] = [
        { header: "Order Id", accessorKey: "order_id",
            cell: (_row) => {
                const order_id = _row.row.original?.inflow_order?.order_id
                return(<div className="capitalize">
                        {order_id}
                </div>)
            }
         },
        { header: "Date", accessorKey: "date", 
            cell: (_row) => {
                const date_created = _row.row.original?.date_created
                return(<div className="capitalize">
                        {formatDateReadable(date_created)}
                </div>)
            }
        },
        { header: "Warehouse", accessorKey: "warehouse", 
            cell: (_row) => {
                const warehouse = _row.row.original?.warehouse?.name
                return(<div className="capitalize">
                        {warehouse}
                </div>)
            }
         },
        // { header: "Weight", accessorKey: "weight" },
        { header: "Quantity (weight)", accessorKey: "quantity",
            cell: (_row) => {
                const quantity = _row.row.original?.quantity
                return(<div className="capitalize">
                        {Number(quantity).toFixed(0)}
                </div>)
            }
         },
        { header: "Amount", accessorKey: "amount",
            cell: (_row) => {
                const amount = _row.row.original?.amount
                return(<div className="capitalize">
                    {CEDI} {commaSeparator(amount)}
                </div>)
            }
         },
        { header: "Aggregator", accessorKey: "aggregator",
            cell: (_row) => {
                const aggregator = _row.row.original?.aggregator
                return(<div className="capitalize">
                        {aggregator?.first_name} {aggregator?.last_name}
                </div>)
            }
         },
        { header: "Action", accessorKey: "action",
            cell: (tableData) => {
                const infoData = tableData.row.original
                return (
                  <div className=""> 
                    <Eye className="text-[#4A8D34] cursor-pointer" onClick={() => handleViewModal(infoData)}/>
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
            {viewModal && 
                <ViewFlowDetailsModal
                    open={viewModal} 
                    setOpen={setViewModal}
                    defaultData={{crop: product, ...selected}}
                    flow_type="Inflow"
                />
            }
        </div>
    )
}