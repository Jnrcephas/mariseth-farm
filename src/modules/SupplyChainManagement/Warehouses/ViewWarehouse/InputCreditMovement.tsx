"use client"

import { useWarehouseGetInputCreditWarehouseMovement } from "@/apis/adminApiComponents";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { commaSeparator } from "@/lib/helpers";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import InputCreditInboundOutbound from "./InputCreditInboundOutbound";

export default function WarehouseInputCreditMovement(
    {warehouseId, creditId, }:{warehouseId: string; creditId: string; creditData: any }){

    const router = useRouter()

    const {data:_data} = useWarehouseGetInputCreditWarehouseMovement({pathParams:{
        id: Number(warehouseId),
        inputCreditId: creditId
    }})
    const data  = _data as any

    return (
        <div className="p-5 px-8 bg-white rounded-lg">
            <Button variant="outline" className="cursor-pointer" onClick={() => router.back()}>
                <ArrowLeft className="text-[#16A34A]"/>Back
            </Button>
            <Card className="w-full  mx-auto px-8 mt-5  border-1 !shadow-none">
                <CardHeader className="pb-2 border-l-4 border-[#26A996] border-b-0 border-r-0">
                    <CardTitle className=" font-medium mb-3 text-2xl flex justify-between">
                        <div>
                            NPK
                            <div className="text-sm mt-1 text-[#475569] mb-2">
                                IC-29992
                            </div>
                            <Badge variant="success" className="text-sm">Active</Badge>
                        </div>
                        
                    </CardTitle>
                    <div className="space-y-3 text-[#475569]">
                        <div className="space-2">
                            <span className="text-[#4A8D34] text-sm mr-2">Credit Type:</span>
                            Fertilizer
                        </div>
                        <div className="space-2">
                            <span className="text-[#4A8D34] text-sm mr-2">Description:</span>
                            1
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="w-full mx-auto mt-10">
                <Card className="rounded-lg overflow-hidden h-[162px] border-1 !shadow-none">
                    <div className="h-full grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-dark/50">
                        <div className="px-6 flex flex-col justify-between">
                        <h3 className="text-sm font-normal mb-1 text-[#4A8D34]">Total Number Of Bags</h3>
                        <p className="text-2xl font-bold mt-4">{commaSeparator(data?.totals?.total_quantity)}</p>
                        </div>
            
                        <div className="px-6 flex flex-col justify-between">
                        
                        <h3 className="text-sm font-normal text-[#4A8D34] mb-1">Total Weight</h3>
                        <p className="text-2xl font-bold mt-4">{commaSeparator(data?.totals?.total_weight)}</p>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="mt-8 mb-5">
                <div className="mb-1 font-semibold text-lg text-[#0F172A]">Input Credit Movement</div>
            </div>
            <Tabs defaultValue="1" className="w-full mx-auto mt-2">
                <TabsList className="grid w-[400px] grid-cols-2 mx-auto p- h-[36px] bg-[#F1F5F9] border mb-5">
                    <TabsTrigger className="h-[28px] cursor-pointer" value="1">Inbound</TabsTrigger>
                    <TabsTrigger className="h-[28px] cursor-pointer" value="2">Outbound</TabsTrigger>
                </TabsList>
                <TabsContent value="1">
                    <InputCreditInboundOutbound warehouseId={warehouseId} creditId={creditId} orderType={"inflow"}/>
                </TabsContent>
                <TabsContent value="2">
                    <InputCreditInboundOutbound warehouseId={warehouseId} creditId={creditId} orderType={"outflow"}/>
                </TabsContent>
            </Tabs>
        </div>
    )
}