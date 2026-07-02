"use client"
import { useFarmManagementFarmerRead } from "@/apis/adminApiComponents";
import { SuspenseLogo } from "@/components/SuspenseLoader";
import { PageProps } from "@/lib/types";
import { ViewLeadFarmer } from "@/modules/FarmManagement/Farmers/ViewLeadFarmer";
import { use } from "react";

export default function Page({ params }: PageProps){
    const { id } = use(params);
    const {data, isPending} = useFarmManagementFarmerRead({pathParams: {id: Number(id)}})
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
                        <span className="text-[#737373]">Farmers / </span>{data?.first_name} {data?.last_name}
                    </div>
                    <div className="bg-[#fff] rounded-lg h-full">
                        <ViewLeadFarmer defaultData={data as any}/>
                    </div>
                </div>
            }
        </div>
    )
}