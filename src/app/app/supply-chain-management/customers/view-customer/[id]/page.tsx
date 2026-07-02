"use client"
import { useCustomerRead } from "@/apis/adminApiComponents";
import { SuspenseLogo } from "@/components/SuspenseLoader";
import { PageProps } from "@/lib/types";
import ViewCustomerDetails from "@/modules/SupplyChainManagement/Customers/ViewCustomer";
import { use } from "react";

export default function Page({ params }: PageProps){
    const { id } = use(params);
    const {data, isPending, refetch} = useCustomerRead({pathParams: {id: Number(id)}})
    return(
        <div>
            {isPending ?
                <div className="bg-[#fff] rounded-lg h-[80vh]">
                    <div className="flex justify-center items-center h-full w-full">
                        <SuspenseLogo/>
                    </div>
                </div>:
                <div>
                    <div className="text-lg">
                        <span className="text-[#737373]">Customer / </span>{data?.name}
                    </div>
                    <div className="bg-[#fff] rounded-lg h-full">
                        <ViewCustomerDetails defaultData={data as any} refetch={refetch}/>
                    </div>
                </div>
            }
        </div>
    )
}