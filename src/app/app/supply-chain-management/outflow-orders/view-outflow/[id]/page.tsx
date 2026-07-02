"use client"
import {  useOutflowRead } from "@/apis/adminApiComponents";
import { SuspenseLogo } from "@/components/SuspenseLoader";
import { PageProps } from "@/lib/types";
import ViewOutflowDetails from "@/modules/SupplyChainManagement/OutflowOrders/ViewOutflow";
import { use } from "react";

export default function Page({ params }: PageProps){
    const { id } = use(params);
    const {data: respData, isPending,  refetch} = useOutflowRead({pathParams: {
        id: Number(id),
    }})
    const _data = respData as any
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
                            <span className="text-[#737373] text-xl">Outbound Orders / </span>{_data.order_id}
                        </div>
                    </div>
                    <div className="bg-[#fff] rounded-lg h-full">
                        <ViewOutflowDetails defaultData={_data as any} refetch={refetch}/>
                    </div>
                </div>
            }
        </div>
    )
}