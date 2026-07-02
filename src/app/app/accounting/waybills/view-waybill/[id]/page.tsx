"use client"
import { useWaybillRead } from "@/apis/adminApiComponents";
import SuspensePageWrapper from "@/components/SuspensePageWrapper";
import { PageProps } from "@/lib/types";
import PrintWaybillInbound from "@/modules/Accounting/Waybills/PrintWaybillInbound";
import { use } from "react";
import { useSearchParams } from "next/navigation";
import PrintWaybillOutbound from "@/modules/Accounting/Waybills/PrintWaybillOutbound";

export default function Page({ params }: PageProps){
    const { id } = use(params);

    const searchParams = useSearchParams();
    const order_type = searchParams.get("order_type") || "";

    const {data, isPending} = useWaybillRead({
        pathParams: {id: Number(id)},
        queryParams: {order_type: order_type},
    },{enabled: Boolean(order_type)})

    return(

        <div>
            <SuspensePageWrapper isLoading={isPending}>
                <div>
                    <div className="bg-[#fff] rounded-lg h-full">
                        {order_type === "inflow" ?
                            <PrintWaybillInbound data={data as any}/>
                        :
                            <PrintWaybillOutbound data={data as any}/>
                        }
                    </div>
                </div>
            </SuspensePageWrapper>
        </div>
    )
}