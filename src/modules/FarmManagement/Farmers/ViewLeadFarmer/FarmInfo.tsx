import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { TextLabel } from "@/components/ui/label"
import ProductMovement from "./ProductMovement"
import { IFarmInfo } from "../../utils/types"
import { Badge } from "@/components/ui/badge"
import { boolToYesNo, colorPalate, pickRandomValue } from "@/lib/helpers"
import { colorStatusArray } from "@/lib/constants"
import { useFarmManagementFarmerGetFarmerFarms } from "@/apis/adminApiComponents"

export default function LeadFarmerFarmInfo({defaultData}:{defaultData: IFarmInfo}){

     const { data: _data } = useFarmManagementFarmerGetFarmerFarms({
          pathParams: {id: Number(defaultData?.farmer_id),
        }},{enabled: !!defaultData?.farmer_id})

    const data = _data as any || []


    
    return(
        <div className="space-y-5">
            <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                <AccordionItem value="item-1">
                    <AccordionTrigger className="border px-5 rounded-t-lg text-[#4A8D34]">Farm Information</AccordionTrigger>
                    <AccordionContent className="border p-5 border-t-0 rounded-b-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <TextLabel title={"Farm Name"} subTitle={defaultData?.name} variant="dark"/>
                            <TextLabel title={"Farm Location"} subTitle={defaultData?.location} variant="dark"/>
                            <TextLabel title={"Total Land Size (in acres/hectares)"} subTitle={<div>{String(defaultData?.size)}  {<span className="lowercase">{defaultData?.size_metric?.name}</span>}</div>} variant="dark"/>
                            <TextLabel title={"Land Ownership"} subTitle={defaultData?.land_ownership} variant="dark"/>
                            <TextLabel title={"If Other, Please Specify Here"} subTitle={defaultData?.other_specification} variant="dark"/>
                            <TextLabel title={"Main Crops Grown"} subTitle={
                                <>
                                    {defaultData?.crops?.length ? <>
                                        {defaultData?.crops?.map((item:any, idx: number) => (
                                            <Badge key={idx} style={{backgroundColor: colorPalate(item?.product?.color).bgColor, color: colorPalate(item?.product?.color).color}} className="capitalize">
                                                {item?.product?.name}
                                            </Badge>
                                        ))}
                                    </>:
                                    <div>-</div>}
                                </>} variant="dark" />
                            <TextLabel title={"Livestock Kept (if any)"} subTitle={
                                <>
                                 {defaultData?.livestock?.length ? <>
                                    {defaultData?.livestock?.map((item:any, idx: number) => (
                                        <Badge key={idx} variant={pickRandomValue(colorStatusArray) as any} className="capitalize">
                                            {item?.product?.name}
                                        </Badge>
                                    ))}</>:
                                    <div>-</div>}
                                </>
                            } variant="dark"/>
                            {/* <TextLabel title={"Farming Experience (years)"} subTitle={"N/A"} variant="dark"/> */}
                            {/* <TextLabel title={"Name of Lead Farmer/Association"} subTitle={"N/A"} variant="dark"/> */}
                        </div>
                       
                       {data?.results?.length ? 
                            <div className="mt-8"> 
                                <div className="text-[#4A8D34]">Other Farms</div>
                                 <hr className="border-1 border-dashed mt-2 mb-3"/>
                                <Accordion
                                    type="single"
                                    collapsible
                                    className="w-full"
                                    defaultValue="item-1"
                                >
                                    {data?.results?.map((item: any, idx: number) =>(
                                        <AccordionItem value={`item-${idx + 1}`} key={idx}>
                                            <AccordionTrigger className="text-[#677788] capitalize">{item?.name}</AccordionTrigger>
                                            <AccordionContent className="text-balance">
                                                <hr className="mb-2"/>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                    <TextLabel title={"Farm Name"} subTitle={item?.name} variant="dark"/>
                                                    <TextLabel title={"Farm Location"} subTitle={item?.location} variant="dark"/>
                                                    <TextLabel title={"Total Land Size (in acres/hectares)"} subTitle={<div>{String(item?.size)}  {<span className="lowercase">{item?.size_metric?.name}</span>}</div>} variant="dark"/>
                                                    <TextLabel title={"Land Ownership"} subTitle={item?.land_ownership} variant="dark"/>
                                                    <TextLabel title={"If Other, Please Specify Here"} subTitle={item?.other_specification} variant="dark"/>
                                                    <TextLabel title={"Main Crops Grown"} subTitle={
                                                        <>
                                                            {item?.crops?.length ? <>
                                                                {item?.crops?.map((item:any, idx: number) => (
                                                                    <Badge key={idx} style={{backgroundColor: colorPalate(item?.product?.color).bgColor, color: colorPalate(item?.product?.color).color}} className="capitalize">
                                                                        {item?.product?.name}
                                                                    </Badge>
                                                                ))}
                                                            </>:
                                                            <div>-</div>}
                                                        </>} variant="dark" />
                                                    <TextLabel title={"Livestock Kept (if any)"} subTitle={
                                                        <>
                                                        {item?.livestock?.length ? <>
                                                            {item?.livestock?.map((item:any, idx: number) => (
                                                                <Badge key={idx} variant={pickRandomValue(colorStatusArray) as any} className="capitalize">
                                                                    {item?.product?.name}
                                                                </Badge>
                                                            ))}</>:
                                                            <div>-</div>}
                                                        </>
                                                    } variant="dark"/>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                                
                            </div>: <div></div>
                        }
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-2">
                    <AccordionTrigger className="border px-5 rounded-t-lg text-[#4A8D34]">Agricultural Practices</AccordionTrigger>
                    <AccordionContent className="border p-5 border-t-0 rounded-b-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <TextLabel title={"Use of Fertilizers"} subTitle={defaultData?.use_of_fertilizers?.[0] as any} variant="dark"/>
                            <TextLabel title={"Farming Methods"} subTitle={defaultData?.farming_methods?.[0] as any} variant="dark"/>
                            <TextLabel title={"Irrigation"} subTitle={boolToYesNo(defaultData?.irrigation as boolean)} variant="dark"/>
                            <TextLabel title={"Access to Market"} subTitle={boolToYesNo(defaultData?.has_access_to_market as boolean)} variant="dark"/>
                            <TextLabel title={"Do you provide training to other farmers?"} subTitle={boolToYesNo(defaultData?.provide_training as boolean)} variant="dark"/>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-3">
                    <AccordionTrigger className="border px-5 rounded-t-lg text-[#4A8D34]">Support & Assistance</AccordionTrigger>
                    <AccordionContent className="border p-5 border-t-0 rounded-b-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <TextLabel title={"Do you receive any government or NGO support?"} subTitle={boolToYesNo(defaultData?.support_assistance?.has_received_support as boolean)} variant="dark"/>
                            <TextLabel title={"If Yes, Please Specify Type of Support Received Here"} subTitle={defaultData?.support_assistance?.support_received} variant="dark"/>
                            <TextLabel title={"Areas of Needed Assistance"} subTitle={defaultData?.support_assistance?.areas_of_needed_assistance} variant="dark"/>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-4">
                    <AccordionTrigger className="border px-5 rounded-t-lg text-[#4A8D34]">Product Movement</AccordionTrigger>
                    <AccordionContent className="border p-5 border-t-0 rounded-b-lg">
                        <ProductMovement/>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}