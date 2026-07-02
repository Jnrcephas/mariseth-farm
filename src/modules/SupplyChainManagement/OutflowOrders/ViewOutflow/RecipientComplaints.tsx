"use client"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { TextLabel } from "@/components/ui/label";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function RecipientComplaints({defaultData}:{defaultData: any}){
    
    return(
        <div>
        <Accordion type="single" collapsible className="w-full " defaultValue="item-2">
            <AccordionItem value="item-2">
                <AccordionTrigger className="border px-5 rounded-t-lg text-[#4A8D34] text">Recipient Complaints</AccordionTrigger>
                <AccordionContent className="border p-5 border-t-0 rounded-b-lg">
                    <Accordion
                        // type="multiple"
                        // className="w-full"
                        // defaultValue={["item-1"]}
                        type="single"
                        collapsible
                        className="w-full"
                        defaultValue="item-1"
                    >
                        {defaultData?.recipient_complaints?.complaints?.length ? <>
                        {defaultData?.recipient_complaints?.complaints?.map((item: any, idx: number) =>(
                            <AccordionItem value={`item-${idx + 1}`} key={idx}>
                                <AccordionTrigger className="text-[#677788] capitalize">{item?.product?.name}</AccordionTrigger>
                                <AccordionContent className="text-balance">
                                    <hr className="mb-2"/>
                                    <div className="grid grid-cols-1 gap-5">
                                        <TextLabel title={"Product"} subTitle={item?.product?.name} />
                                        <TextLabel title={"Expected Quantity"} subTitle={item?.expected_quantity} />
                                        <TextLabel title={"No. Problematic Bags"} subTitle={item?.problematic_quantity} />
                                        <TextLabel title={"Reason"} subTitle={item?.reason} />
                                        <TextLabel title={"Comments"} subTitle={item?.comments} />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}</>:<div className="text-center text-[#64748B]">Recipient Complaints Not Available</div>}

                        {defaultData?.recipient_complaints?.images?.length ?
                        <div className="flex gap-5 mt-3 justify-center">
                            <Carousel className="w-full max-w-xs">
                                <CarouselContent >
                                    {defaultData?.recipient_complaints?.images.map((item: any, idx:number) => (
                                    <CarouselItem key={idx} className="w-full flex items-center justify-center">
                                        <img src={item} alt={`media-${idx}`} className="border rounded-xl max-w-full object-contain"/>    
                                    </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="ms-8"/>
                                <CarouselNext className="mx-8"/>
                            </Carousel>
                        </div>:<div></div>}
                    </Accordion>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
        </div>
    )
}