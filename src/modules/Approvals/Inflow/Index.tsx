import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApprovalsInflowOrders from "./ApprovalsInflowOrders";

export default function InflowApprovals(){
    return(
        <div className="mt-5">
            <Tabs defaultValue="1" className="w-full mx-auto">
                <TabsList className="grid w-[450px] grid-cols-2 mx-auto p- h-[36px] bg-[#F1F5F9] border ">
                <TabsTrigger className="h-[28px] cursor-pointer" value="1">Pending Inbound Approvals</TabsTrigger>
                <TabsTrigger className="h-[28px] cursor-pointer" value="2">Completed Inbound Approvals</TabsTrigger>
                </TabsList>
                <TabsContent value="1">
                    <ApprovalsInflowOrders />
                </TabsContent>
                <TabsContent value="2">
                    <ApprovalsInflowOrders completed={true}/>
                </TabsContent>
            </Tabs>
        </div>
    )
}