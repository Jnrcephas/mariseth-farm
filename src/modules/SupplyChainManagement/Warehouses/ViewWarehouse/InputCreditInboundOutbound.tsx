"use client"
import CustomTable, { IPagination } from "@/components/CustomTable";
import { useState } from "react";
import { CEDI, PAGE_SIZE } from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { FilterProps } from "@/modules/FarmManagement/utils/types";
import AddCropModal from "@/modules/FarmManagement/Products/Modals/AddCropModal";
import { useWarehouseGetInputCreditWarehouseMovement } from "@/apis/adminApiComponents";
import { commaSeparator, formatDateReadable } from "@/lib/helpers";

export default function InputCreditInboundOutbound({warehouseId, creditId, orderType}: 
    { 
        warehouseId: number | string;  
        creditId: number | string;
        orderType: "inflow" | "outflow"
    }){

    const [editModal, setEditModal] = useState(false)
    // const [deleteModal, setDeleteModal] = useState(false)
    // const [selected, setSelected] = useState<any>({})

    const [filters, setFilters] = useState<FilterProps>({
        page: 1, page_size: PAGE_SIZE
    })

    const {data:_data, isPending: isLoading} = useWarehouseGetInputCreditWarehouseMovement({pathParams:{
        id: Number(warehouseId),
        inputCreditId: String(creditId)

    }, queryParams:{
        order_type: orderType
    }},{enabled: Boolean(warehouseId && creditId)})
    const data  = _data as any


    const handlePaginationChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page }))
    }
    const handleSetPageSize = (pageSize: number) => {
        setFilters((prev) => ({ ...prev, page_size: pageSize}))
    }
    
    // function handleEditModal(data: any){
    //     setSelected(data)
    //     setEditModal(true)
    // }

    // function handleDeleteModal(data: any){
    //     console.log("deleteModal",deleteModal)
    //     setSelected(data)
    //     setDeleteModal(true)
    // }
   

   
    
    const columns: ColumnDef<any>[] = [
        { header: "Date", accessorKey: "date_created",
            cell: (_row) => {
                const date_created = _row.row.original?.date_created
                return(<div className="capitalize">
                        {formatDateReadable(date_created)}
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
        { header: "Amount", accessorKey: "amount",
            cell: (_row) => {
                const quantity = _row.row.original?.amount
                return(<div className="capitalize">
                    {CEDI} {commaSeparator(Number(quantity).toFixed(2))}
                </div>)
            }
         }
        
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
            {editModal && 
                <AddCropModal
                    open={editModal} 
                    setOpen={setEditModal}
                    defaultData={{}}
                    isEdit
                />
            }
                
        </div>
    )
}