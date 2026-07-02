"use client"
import { useEmployeeRead } from "@/apis/adminApiComponents";
import SuspensePageWrapper from "@/components/SuspensePageWrapper";
import { PageProps } from "@/lib/types";
import ViewEmployeeProfile from "@/modules/EmployeeManagement/Profiles/ViewProfile";
import { use } from "react";

export default function Page({ params }: PageProps){
    const { id } = use(params);
    const {data, isLoading, refetch} = useEmployeeRead({pathParams: {id: Number(id)}})

    return(
        <div>
            <SuspensePageWrapper isLoading={isLoading}>
                <div className="text-lg">
                    <span className="text-[#737373]">Employee Profiles / </span>{data?.first_name} {data?.last_name}
                </div>
                <ViewEmployeeProfile  defaultData={data as any}  refetch={refetch}/>
            </SuspensePageWrapper>
        </div>
    )
}