import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OutflowApprovalsOrders from "./OutflowApprovalsOrders";
import PageTitle from "@/components/layouts/PageTitle";

export default function ViewMainOutflowApprovals(){
    return(
        <div className="mt-5">
            <PageTitle title="Outbound Approvals" />
            <Tabs defaultValue="1" className="w-full mx-auto">
                <TabsList className="grid w-full sm:w-[450px] grid-cols-2 h-auto p-1 bg-[#E2E8F0] rounded-full mb-5">
                    <TabsTrigger
                        className="h-[38px] rounded-full cursor-pointer font-semibold data-[state=active]:bg-[#0B3D19] data-[state=active]:text-white"
                        value="1"
                    >
                        Pending Outbound Approvals
                    </TabsTrigger>
                    <TabsTrigger
                        className="h-[38px] rounded-full cursor-pointer font-semibold data-[state=active]:bg-[#0B3D19] data-[state=active]:text-white"
                        value="2"
                    >
                        Approved Pickups
                    </TabsTrigger>
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
