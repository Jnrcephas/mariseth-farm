"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Inbound from "./Inbound";
import Outbound from "./Outbound";
import { AuthorizeAndRenderPage } from "@/components/Unauthorized";
import PageTitle from "@/components/layouts/PageTitle";

export default function WaybillView(){
    return(
        <AuthorizeAndRenderPage permission={"accounting|list_waybills"}>
            <PageTitle title="Waybills" />
            <Tabs defaultValue="1" className="w-full mx-auto">
                <TabsList className="grid w-full sm:w-[300px] grid-cols-2 h-auto p-1 bg-[#E2E8F0] rounded-full mb-5">
                    <TabsTrigger
                        className="h-[38px] rounded-full cursor-pointer font-semibold data-[state=active]:bg-[#0B3D19] data-[state=active]:text-white"
                        value="1"
                    >
                        Inbound
                    </TabsTrigger>
                    <TabsTrigger
                        className="h-[38px] rounded-full cursor-pointer font-semibold data-[state=active]:bg-[#0B3D19] data-[state=active]:text-white"
                        value="2"
                    >
                        Outbound
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="1">
                    <Inbound/>
                </TabsContent>
                <TabsContent value="2">
                    <Outbound/>
                </TabsContent>
            </Tabs>
        </AuthorizeAndRenderPage>
    ) 
}