import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OutflowApprovalsOrders from "./OutflowApprovalsOrders";

export default function ViewMainOutflowApprovals(){
    return(
        <div className="mt-5">
            <Tabs defaultValue="1" className="w-full mx-auto">
                <TabsList className="grid w-[450px] grid-cols-2 mx-auto p- h-[36px] bg-[#F1F5F9] border ">
                <TabsTrigger className="h-[28px] cursor-pointer" value="1">Pending Outbound Approvals</TabsTrigger>
                <TabsTrigger className="h-[28px] cursor-pointer" value="2">Approved Pickups</TabsTrigger>
                </TabsList>
                <TabsContent value="1">
                    <OutflowApprovalsOrders completed={false}/>
                </TabsContent>
                <TabsContent value="2">
                    <OutflowApprovalsOrders completed={true}/>
                </TabsContent>
            </Tabs>
        </div>
    )
}

