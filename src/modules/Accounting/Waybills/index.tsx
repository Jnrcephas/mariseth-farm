"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Inbound from "./Inbound";
import Outbound from "./Outbound";
import { AuthorizeAndRenderPage } from "@/components/Unauthorized";

export default function WaybillView(){
    return(
        <AuthorizeAndRenderPage permission={"accounting|list_waybills"}>
            <Tabs defaultValue="1" className="w-full mx-auto">
                <TabsList className="grid w-[400px] grid-cols-2 mx-auto p- h-[36px] bg-[#F1F5F9] border ">
                    <TabsTrigger className="h-[28px] cursor-pointer" value="1">Inbound</TabsTrigger>
                    <TabsTrigger className="h-[28px] cursor-pointer" value="2">Outbound</TabsTrigger>
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