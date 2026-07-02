"use client"
import { useInflowRead } from "@/apis/adminApiComponents";
import { SuspenseLogo } from "@/components/SuspenseLoader";
import { PageProps } from "@/lib/types";
import ViewInflowDetails from "@/modules/SupplyChainManagement/InflowOrders/ViewInflow";
import { use } from "react";

export default function Page({ params }: PageProps){
    const { id } = use(params);
    const {data, isPending,  refetch} = useInflowRead({pathParams: {id: Number(id)}})
    return(
        <div>
            {isPending ?
                <div className="bg-[#fff] rounded-lg h-[80vh]">
                    <div className="flex justify-center items-center h-full w-full">
                        <SuspenseLogo/>
                    </div>
                </div>:
                <div>
                    <div className="text-lg flex justify-between mb-2">
                        <div>
                            <span className="text-[#737373] text-xl">Inbound Orders / </span>{data?.id}
                        </div>
                    </div>
                    <div className="bg-[#fff] rounded-lg h-full">
                        <ViewInflowDetails defaultData={data as any} refetch={refetch}/>
                    </div>
                </div>
            }
        </div>
    )
}