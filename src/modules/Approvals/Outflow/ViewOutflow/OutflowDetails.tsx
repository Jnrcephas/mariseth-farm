"use client"
import { CEDI } from "@/lib/constants";
import { commaSeparator, formatDateReadable } from "@/lib/helpers";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { TextLabel } from "@/components/ui/label";
import CustomTable from "@/components/CustomTable";
import { ColumnDef } from "@tanstack/react-table";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import DeliveryInfo from "@/modules/SupplyChainManagement/OutflowOrders/ViewOutflow/DeliveryInfo";

export default function OutflowDetails({defaultData}:{defaultData: any; refetch: () => void;}){

    const columns: ColumnDef<any>[] = [
        { header: `Serial (${defaultData?.order_id})`, accessorKey: "serial_number"},
        { header: "Product", accessorKey: "product",
            cell: (_row) => {
                const product = _row.row.original?.product?.name
                return(<div className="capitalize">
                        {product}
                </div>)
            }

        },
        { header: "Warehouse-", accessorKey: "warehouse",
            cell: () => {
                const warehouse = defaultData?.warehouse?.warehouse?.name
                return(<div className="capitalize">
                        {warehouse}
                </div>)
            }

        },
        { header: "Quantity(weight)", accessorKey: "expected_quantity",
            cell: (_row) => {
                const quantity = Number(_row.row.original?.expected_quantity)?.toFixed(0)
                return(<div className="capitalize">
                        {commaSeparator(quantity)}
                </div>)
            }
        },
        { header: "Unit Price", accessorKey: "price_per_unit", 
            cell: (_row) => {
                const unit_price = _row.row.original?.price_per_unit
                return(<div className="capitalize">
                      {CEDI} {commaSeparator(unit_price)}
                </div>)
            }
        },
        { header: "Total", accessorKey: "total_cost", 
            cell: (_row) => {
                const total_cost = _row.row.original?.cost
                return(<div className="capitalize">
                    {CEDI} {commaSeparator(total_cost)}
                </div>)
            }
        }
    ];
    
    return(
        <div>
            <div className="grid md:grid-cols-12 mt-5 gap-2">
                <div className="col-span-8">
                    <div className="grid grid-cols-1 gap-5">
                        <Accordion type="single" collapsible className="w-full " defaultValue="item-1">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="border px-5 rounded-t-lg text-[#4A8D34] text">Order Details</AccordionTrigger>
                                <AccordionContent className="border p-5 border-t-0 rounded-b-lg">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <TextLabel title={"Recipient"} subTitle={`${defaultData?.customer?.name}`} />
                                        <TextLabel title={"Destination"} subTitle={defaultData?.destination} />
                                        <TextLabel title={"Expected Delivery"} subTitle={formatDateReadable(defaultData?.expected_delivery_date)} />
                                        <TextLabel title={"Total Number of Bags"} subTitle={defaultData?.total_quantity} />                                   
                                        <TextLabel title={"Extra Comments"} subTitle={defaultData?.comments} />
                                        <TextLabel title={"Procurement Officer"} subTitle={`${defaultData?.procurement_officer?.first_name} ${defaultData?.procurement_officer?.last_name}`} />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <div className="">
                            <div className="mb-1 font-semibold text-sm text-[#4A8D34]">Order Products </div>
                            <hr className="mb-0"/>
                            <div className="border rounded-lg">
                                <CustomTable
                                    columns={columns} 
                                    data={defaultData?.warehouse?.products || []} 
                                    perPage={100} 
                                    isLoading={false}
                                    count={(defaultData?.warehouse?.products || []).length || 0}
                                />
                                <hr className="mb-0"/>
                                <div className="flex justify-end  py-4">
                                    <div className="flex gap-5 mr-[60px]">
                                        <div className="text-sm text-[#4A8D34] font-semibold">
                                            Total Amount:
                                        </div>
                                        <div className="text-sm font-medium text-[#64748B]">
                                            {CEDI} {commaSeparator(defaultData?.warehouse?.total_cost || 0)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {defaultData?.warehouse?.delivery_information?.length ? <div>
                            <Accordion type="single" collapsible className="w-full mt-6" defaultValue="item-2">
                                <AccordionItem value="item-2">
                                    <AccordionTrigger className="border px-5 rounded-t-lg text-[#4A8D34] text">Delivery Information</AccordionTrigger>
                                    <AccordionContent className="border p-5 border-t-0 rounded-b-lg">
                                        <DeliveryInfo data={defaultData}/>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            
                        </div>:<div></div>}
                    </div>
                </div>
                <div className="col-span-4">
                    <Accordion type="single" collapsible className="w-full" defaultValue="item-2">
                        <AccordionItem value="item-2">
                            <AccordionTrigger className="border px-5 rounded-t-lg text-[#4A8D34] text">Stock Report</AccordionTrigger>
                            <AccordionContent className="border p-5 border-t-0 rounded-b-lg">
                                <Accordion
                                    type="single"
                                    collapsible
                                    className="w-full"
                                    defaultValue="item-1"
                                >
                                    {defaultData?.warehouse?.products?.map((item: any, idx: number) =>(
                                        <AccordionItem value={`item-${idx + 1}`} key={idx}>
                                            <AccordionTrigger className="text-[#677788] capitalize">{item?.product?.name} - {item?.serial_number}</AccordionTrigger>
                                            <AccordionContent className="text-balance">
                                                <hr className="mb-2"/>
                                                <div className="grid grid-cols-1  gap-3">
                                                    <TextLabel title={"Product"} subTitle={item?.product?.name} />
                                                    <hr/>
                                                    <TextLabel title={"Expected Quantity"} subTitle={item?.expected_quantity}/>
                                                    <hr/>
                                                    <TextLabel title={"Available Quantity"} subTitle={item?.available_quantity} />
                                                    <hr/>
                                                    <TextLabel title={"Reason"} subTitle={item?.reason} />
                                                    <hr/>
                                                    <TextLabel title={"Comments"} subTitle={item?.comments} />
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                                <hr className="my-3"/>
                                {defaultData?.warehouse?.images?.length ?
                                <div className="flex justify-center mt-5">
                                    <Carousel className="w-full max-w-xs">
                                        <CarouselContent >
                                            {defaultData?.warehouse?.images?.map((item: any, idx:number) => (
                                            <CarouselItem key={idx} className=" w-full flex items-center justify-center">
                                                <img src={item?.image} alt={`media-${idx}`} className="border rounded-xl max-w-full object-contain"/>    
                                            </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                        <CarouselPrevious className="ms-8"/>
                                        <CarouselNext className="mx-8"/>
                                    </Carousel>
                                </div>:<div></div>}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    
                </div>
            </div>
             
        </div>
    )
}