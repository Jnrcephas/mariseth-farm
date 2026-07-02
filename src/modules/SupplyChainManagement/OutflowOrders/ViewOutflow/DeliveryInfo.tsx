import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { TextLabel } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { boolToYesNo } from "@/lib/helpers";

export default function DeliveryInfo({data}:{data: any}){
    const deliveryInfo = data?.delivery_information ?? data?.warehouse?.delivery_information
    return(
        <div>
            <Tabs defaultValue="1" className="w-full mx-auto">
                <TabsList className="grid w-[400px] grid-cols-2 mx-auto p- h-[36px] bg-[#F1F5F9] border ">
                    {deliveryInfo?.map((_: any, idx: number) =>(
                        <TabsTrigger key={idx} className="h-[28px] cursor-pointer" value={`${idx + 1}`}>Delivery Info {idx + 1}</TabsTrigger>
                    ))}
                </TabsList>
                {deliveryInfo?.map((item: any, idx: number) =>(
                    <TabsContent key={`info-${idx + 1}`} value={`${idx + 1}`}>
                        <div className="grid grid-cols-2 gap-5">
                            <TextLabel title={"Driver Name"} subTitle={item?.driver_name} />
                            <TextLabel title={"Driver License"} subTitle={item?.driver_license_number} />
                            <TextLabel title={"Driver Phone Number"} subTitle={item?.driver_phone_number} />
                            <TextLabel title={"Truck License Plate Number"} subTitle={item?.truck_license_number} />
                            <TextLabel title={"Destination"} subTitle={item?.destination} />
                            <TextLabel title={"Transport Company"} subTitle={item?.company} />
                        </div>
                        <div className="grid grid-cols-1 gap-5 mt-3">
                            <TextLabel title={"Assigned Warehouse(s) for Pickup"} subTitle={
                                <div>
                                    {item?.warehouses?.map((item: any, idx:number) =>(
                                        <Badge variant={"dark"} key={idx}>{item?.name}</Badge>
                                    ))}
                            </div>} />
                        </div>
                        <div className="grid grid-cols-2 gap-5 mt-3">
                            <TextLabel title={"Escort Required"} subTitle={boolToYesNo(item?.escort_required)} />
                            <TextLabel title={"Escort Details"} subTitle={item?.escort_details} />
                        </div>
                        <div className="grid grid-cols-1 gap-5 mt-3">
                            <Carousel className="w-full max-w-xs">
                                <CarouselContent >
                                    {item?.images?.map((item: any, idx:number) => (
                                    <CarouselItem key={idx} className=" w-full flex items-center justify-center">
                                        <img src={item?.image} alt={`media-${idx}`} className="border rounded-xl max-w-full object-contain"/>    
                                    </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="ms-8"/>
                                <CarouselNext className="mx-8"/>
                            </Carousel>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}