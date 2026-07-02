import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import ProductMovement from "./ProductMovement";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ViewProductDetails({defaultData}:{defaultData: any}){
    return(
    <div className="p-5 px-8">
            <Button variant="outline" className="cursor-pointer" onClick={() => window.history.back()}>
                <ArrowLeft className="text-[#16A34A]"/>Back
            </Button>
        <Card className="w-full  mx-auto px-8 mt-5  border-1 !shadow-none">
            <CardHeader className="pb-2 border-l-4 border-[#26A996] border-b-0 border-r-0">
                <CardTitle className=" font-medium mb-3 text-2xl">
                    {defaultData?.name}
                    <div className="text-sm mt-2 text-[#475569]">
                        {defaultData?.product_id}
                    </div>
                    <Badge variant="success" className="text-sm">Active</Badge>
                </CardTitle>
                <div className="space-y-3 text-[#475569]">
                    <div className="space-x-2">
                        <span className="text-[#4A8D34] text-sm me-1">Category:</span>
                        {defaultData?.category?.name}
                    </div>
                    <div className="space-x-2">
                        <span className="text-[#4A8D34] text-sm me-1">Description:</span>
                        {defaultData?.description}
                    </div>
                    <div className="space-x-2">
                        <span className="text-[#4A8D34] text-sm me-1">Is this crop currently in its growing season?:</span>
                        {defaultData?.season_status === "in" ? "Yes" : "No"}
                    </div>
                    <div className="space-x-2">
                        <span className="text-[#4A8D34] text-sm me-1">Season Start Month:</span>
                            {moment(defaultData?.season_start).format("MMM YYYY")}
                    </div>
                    <div className="space-x-2">
                        <span className="text-[#4A8D34] text-sm me-1">Season End Month:</span> 
                         {moment(defaultData?.season_end).format("MMM YYYY")}
                    </div>
                </div>
            </CardHeader>
        </Card>
        {/* <div className="w-full mx-auto mt-10">
            <Card className="rounded-lg overflow-hidden h-[162px] border-1 !shadow-none">
            <div className="h-full grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-dark/50">
                <div className="px-6 flex flex-col justify-between">
                <h3 className="text-sm font-normal mb-1 text-[#475569]">Total Number Of Bags</h3>
                <p className="text-2xl font-bold mt-4">1,200</p>
                </div>
    
                <div className="px-6 flex flex-col justify-between">
                
                <h3 className="text-sm font-normal text-[#475569] mb-1">Total Weight</h3>
                <p className="text-2xl font-bold mt-4">6,000 kg</p>
                </div>
            </div>
            </Card>
        </div> */}
        
        <div className="mt-10">
            <hr className="mb-0"/>
            <ProductMovement product={defaultData} />
        </div>
    </div>
    )
}