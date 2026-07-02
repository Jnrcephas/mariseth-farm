"use client"
import { useEmployeeRead } from "@/apis/adminApiComponents";
import SuspensePageWrapper from "@/components/SuspensePageWrapper";
import { PageProps } from "@/lib/types";
import { AddEmployee } from "@/modules/EmployeeManagement/Profiles/AddEmployee";
import { useSearchParams } from "next/navigation";
import { use } from "react";

export default function Page({ params }: PageProps){
    const { id } = use(params);
    const {data, isPending:isLoading, refetch} = useEmployeeRead({pathParams: {id: Number(id)}})
    const searchParams = useSearchParams();
    const level = searchParams.get("level") || 1;

    return(
        <div>
            <SuspensePageWrapper isLoading={isLoading}>
                <AddEmployee isEdit={true} defaultData={data as any} formLevel={Number(level)} refetch={refetch}/>
            </SuspensePageWrapper>
        </div>
    )
}