import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InflowTable from "./InflowTable";
import OutflowTable from "./OutflowTable";
import PriceChangesTable from "./PriceChangesTable";

export default function ProductMovement({product}:{product?: any}) {

    return(
        <div className="mt-5">
            <h3 className="text-xl font-semibold text-[#0F172A]">Product Movement</h3>
            <div>
                <Tabs defaultValue="1" className="w-full mx-auto">
                    <TabsList className="grid w-[540px] grid-cols-3 mx-auto p- h-[36px] bg-[#F1F5F9] mb-5">
                        <TabsTrigger className="h-[28px] cursor-pointer" value="1">Inbound</TabsTrigger>
                        <TabsTrigger className="h-[28px] cursor-pointer" value="2">Outbound</TabsTrigger>
                        <TabsTrigger className="h-[28px] cursor-pointer" value="3">Price Changes</TabsTrigger>
                    </TabsList>
                    <TabsContent value="1">
                        <InflowTable product={product}/>
                    </TabsContent>
                    <TabsContent value="2">
                        <OutflowTable product={product}/>
                    </TabsContent>
                    <TabsContent value="3">
                        <PriceChangesTable product={product}/>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
