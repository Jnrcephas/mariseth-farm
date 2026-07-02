"use client"
import { useFarmManagementFarmerRead } from "@/apis/adminApiComponents";
import PageTitle from "@/components/layouts/PageTitle";
import { SuspenseLogo } from "@/components/SuspenseLoader";
import { PageProps } from "@/lib/types";
import AddSmallholderFarmer from "@/modules/FarmManagement/Farmers/AddSmallholderFarmer";
import { use } from "react";

export default function Page({ params }: PageProps){
    const { id } = use(params);
    const {data, isPending} = useFarmManagementFarmerRead({pathParams: {id: Number(id)}})
    return(
        <div>
            <PageTitle title="Edit Lead Farmer" />
            {isPending ?
                <div className="bg-[#fff] rounded-lg h-[80vh]">
                    <div className="flex justify-center items-center h-full w-full">
                        <SuspenseLogo/>
                    </div>
                </div>:
                <div className="bg-[#fff] rounded-lg">
                    <AddSmallholderFarmer defaultData={data} isEdit/>
                </div>
            }
        </div>
    )
}