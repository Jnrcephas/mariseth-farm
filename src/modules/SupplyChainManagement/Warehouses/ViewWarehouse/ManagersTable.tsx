"use client"
import CustomTable from "@/components/CustomTable";
import { PAGE_SIZE } from "@/lib/constants";
import { ColumnDef } from "@tanstack/react-table";
import { formatGender } from "@/lib/helpers";
import { formatPhoneNumberStartWithZero } from "@/modules/UserManagement/utils/helpers";

export default function ManagersTable({data}: { data: any[] }){

   
    const columns: ColumnDef<any>[] = [
        { header: "Name", accessorKey: "name", 
            cell: (_row) => {
                const name = _row.row.original
                return(<div className="capitalize">
                        {name?.first_name} {name?.last_name}
                </div>)
            }
         },
        { header: "Phone Number", accessorKey: "phone_number",
            cell: (_row) => {
                const phone_number = _row.row.original?.phone_number
                return(<div className="capitalize">
                        {formatPhoneNumberStartWithZero(phone_number)}
                </div>)
            }

        },
        { header: "Email", accessorKey: "email"},
        
        { header: "Gender", accessorKey: "gender",
            cell: (_row) => {
                const gender = _row.row.original?.gender
                return(<div className="capitalize">
                        {formatGender(gender)}
                </div>)
            }
         }
        
    ];
    return(
        <div>
            <hr/>
            <div className="mt-5">
                <div className="mb-1 font-semibold text-lg text-[#0F172A]">Warehouse Managers</div>
                <hr className="mb-0"/>
                <CustomTable 
                    columns={columns} 
                    data={data || []} 
                    perPage={PAGE_SIZE} 
                    isLoading={false}
                    currentPage={1}
                    count={data?.length || 0}
                />
            </div>
        </div>
    )
}