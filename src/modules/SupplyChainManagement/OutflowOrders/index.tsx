import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SupplyChainOutflowOrders from "./SupplyChainOutflowOrders";

export default function MainSupplyChainOutflow(){
    return(
        <div className="mt-10">
            <Tabs defaultValue="1" className="w-full mx-auto">
                <TabsList className="grid w-[450px] grid-cols-2 mx-auto p- h-[36px] bg-[#F1F5F9] border ">
                <TabsTrigger className="h-[28px] cursor-pointer" value="1">Pending Outbound Orders</TabsTrigger>
                <TabsTrigger className="h-[28px] cursor-pointer" value="2">Completed Outbound Orders</TabsTrigger>
                </TabsList>
                <TabsContent value="1">
                    <SupplyChainOutflowOrders completed={false}/>
                </TabsContent>
                <TabsContent value="2">
                    <SupplyChainOutflowOrders completed={true}/>
                </TabsContent>
            </Tabs>
        </div>
    )
}