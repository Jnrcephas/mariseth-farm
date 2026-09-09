"use client"
import { useInvoiceRead } from "@/apis/adminApiComponents";
import SuspensePageWrapper from "@/components/SuspensePageWrapper";
import { AuthorizeAndRenderPage } from "@/components/Unauthorized";
import { PageProps } from "@/lib/types";
import PrintInvoice from "@/modules/Accounting/Invoices/PrintInvoice";
import { use } from "react";

export default function Page({ params }: PageProps){
    const { id } = use(params);
    const {data, isPending} = useInvoiceRead({pathParams: {id: Number(id)}})
    return(

        <AuthorizeAndRenderPage permission={"accounting|view_invoice"}>
            <SuspensePageWrapper isLoading={isPending}>
                <div>
                    <div className="bg-[#fff] rounded-lg h-full">
                        <PrintInvoice data={data as any}/>
                    </div>
                </div>
            </SuspensePageWrapper>
        </AuthorizeAndRenderPage>
    )
}