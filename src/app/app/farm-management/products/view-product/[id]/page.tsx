"use client"
import { useFarmManagementProductRead } from "@/apis/adminApiComponents";
import SuspensePageWrapper from "@/components/SuspensePageWrapper";
import { PageProps } from "@/lib/types";
import ViewProductDetails from "@/modules/FarmManagement/Products/ViewProducts.tsx";
import { use } from "react";

export default function Page({ params }: PageProps){
    const { id } = use(params);
    const {data, isPending} = useFarmManagementProductRead({pathParams: {id: Number(id)}})
    return(

        <div>
            <SuspensePageWrapper isLoading={isPending}>
                <div>
                    <div className="text-lg">
                        <span className="text-[#737373]">Product /  </span>{data?.name}
                    </div>
                    <div className="bg-[#fff] rounded-lg h-full">
                        <ViewProductDetails defaultData={data as any}/>
                    </div>
                </div>
            </SuspensePageWrapper>
        </div>
    )
}