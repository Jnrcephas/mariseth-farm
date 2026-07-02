"use client"
import CustomTable, { IPagination } from "@/components/CustomTable";
import { useState } from "react";
import { CEDI, PAGE_SIZE } from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { FilterProps } from "@/modules/FarmManagement/utils/types";
import { Badge } from "@/components/ui/badge";
import { colorPalate, commaSeparator, formatDateReadable } from "@/lib/helpers";
import { useCustomerListOrders } from "@/apis/adminApiComponents";
import { Card } from "@/components/ui/card";

export default function OrdersTable({customerId}:{customerId: number}){

    const [filters, setFilters] = useState<FilterProps>({
        page: 1, page_size: PAGE_SIZE
    })

    const {data: _data, isLoading} = useCustomerListOrders({
        pathParams: {
            id: customerId
        },
        queryParams:filters
    })
    const data = _data as any


    const handlePaginationChange = (page: number) => {
        setFilters((prev) => ({ ...prev, page }))
    }
    const handleSetPageSize = (pageSize: number) => {
        setFilters((prev) => ({ ...prev, page_size: pageSize}))
    }

    // const [viewModal, setViewModal] = useState(false)
    // const [selected, setSelected] = useState<any>({})

    // function handleViewModal(data: any){
    //     setSelected(data)
    //     setViewModal(true)
    // }
   
    
    const columns: ColumnDef<any>[] = [
        { header: "Order ID", accessorKey: "order_id" },
        { header: "Date", accessorKey: "expected_delivery_date",
            cell: (_row) => {
                const row = _row?.row?.original
                return(
                    <div className="capitalize">{formatDateReadable(row?.expected_delivery_date)}</div>
                )
            }
        },
        { header: "Crops Purchased", accessorKey: "products",
            cell: (_row) => {
            const row = _row.cell.row.original
            return (
                <div className="space-x-1">
                {row?.products?.map((item:any, idx: number) => (
                    <Badge key={idx} style={{backgroundColor: colorPalate(item?.product?.color).bgColor, color: colorPalate(item?.product?.color).color}} className="capitalize">
                        {item?.product?.name}
                    </Badge>
                ))}
                </div>
            );
            }
         },
        { header: "Quantity (weight)", accessorKey: "total_quantity",
            cell: (_row) => {
            const row = _row.cell.row.original
                return (
                  <div className=""> 
                    {commaSeparator(row?.total_quantity)}
                  </div>
                );
            },
         },
        { header: "Amount", accessorKey: "total_cost",
            cell: (_row) => {
            const row = _row.cell.row.original
                return (
                  <div className=""> 
                    {CEDI} {commaSeparator(row?.total_cost)}
                  </div>
                );
            },
        },
        // { header: "Action", accessorKey: "action",
        //     cell: () => {
        //         // const infoData = tableData.row.original
        //         return (
        //           <div className=""> 
        //             <Eye className="text-[#4A8D34] cursor-pointer" />
        //           </div>
        //         );
        //     },
        // },
    ];
    return(
        <div>
            <div className="w-full mx-auto mt-10">
                <Card className="rounded-lg overflow-hidden h-[162px] border-1 !shadow-none">
                <div className="h-full grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-dark/50">
                    <div className="px-6 flex flex-col justify-between">
                    <h3 className="text-sm font-normal mb-1 text-[#475569]">Total Number Of Crops</h3>
                    <p className="text-2xl font-bold mt-4">0</p>
                    </div>
        
                    <div className="px-6 flex flex-col justify-between">
                    
                    <h3 className="text-sm font-normal text-[#475569] mb-1">Total</h3>
                    <p className="text-2xl font-bold mt-4">{CEDI} {commaSeparator(data?.total_amount || 0)}</p>
                    </div>
                </div>
                </Card>
            </div>
             <div className="mt-12">
            <div className="mb-1 font-semibold text-lg text-[#0F172A]">Orders</div>
            <hr className="mb-0"/>
            <div className="mt-5">
                <CustomTable 
                    // searchFilter={<CustomerSearch setFilters={setFilters} refetch={refetch} isLoading={isLoading} />}
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
            </div>
        </div>
    )
}