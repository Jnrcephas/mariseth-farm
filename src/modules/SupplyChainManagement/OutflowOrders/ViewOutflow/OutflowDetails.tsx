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
import { Check, Warehouse } from "lucide-react";
import { Button } from "@/components/ui/button";
import PaymentInfo from "./PaymentInfo";
import DeliveryInfo from "./DeliveryInfo";
import RecipientComplaints from "./RecipientComplaints";

export default function OutflowDetails({defaultData, refetch}:{defaultData: any; refetch: () => void;}){

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
        { header: "Warehouse", accessorKey: "warehouse",
            cell: (_row) => {
                const warehouse = _row.row.original?.warehouse?.name
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
                                    data={defaultData?.products || []} 
                                    perPage={100} 
                                    isLoading={false}
                                    count={defaultData?.products?.length || 0}
                                />
                                <hr className="mb-0"/>
                                <div className="flex justify-end  mt-2">
                                    <div className="flex gap-5 mr-[60px]">
                                        <div className="text-sm text-[#4A8D34] font-semibold">
                                            Total:
                                        </div>
                                        <div className="text-sm font-medium text-[#64748B]">
                                            {CEDI} {commaSeparator(defaultData?.total_cost || 0)}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-3">
                                    <div className="flex gap-5 mr-[60px]">
                                        <div className="text-sm text-[#4A8D34] font-semibold">
                                            Expected Amount:
                                        </div>
                                        <div className="text-sm font-medium text-[#64748B]">
                                            {CEDI} {commaSeparator(defaultData?.expected_amount || 0)}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end mt-3">
                                    <div className="flex gap-5 mr-[60px]">
                                        <div className="text-sm text-[#4A8D34] font-semibold">
                                            Actual Amount:
                                        </div>
                                        <div className="text-sm font-medium text-[#64748B]">
                                            {CEDI} {commaSeparator(defaultData?.actual_amount || 0)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {defaultData?.delivery_information?.length ? <div>
                        <Accordion type="single" collapsible className="w-full mt-6" defaultValue="item-2">
                            <AccordionItem value="item-2">
                                <AccordionTrigger className="border px-5 rounded-t-lg text-[#4A8D34] text">Delivery Information</AccordionTrigger>
                                <AccordionContent className="border p-5 border-t-0 rounded-b-lg">
                                    <DeliveryInfo data={defaultData}/>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        
                    </div>:<div></div>}
                    <div className="mt-6">
                        <div className="grid md:grid-cols-12 gap-2">
                            <div className="md:col-span-12">
                                <Accordion type="single" collapsible className="w-full " defaultValue="item-3">
                                    <AccordionItem value="item-3">
                                        <AccordionTrigger className="border px-5 rounded-t-lg text-[#4A8D34] text">Warehouse Stock Verification </AccordionTrigger>
                                        <AccordionContent className="border p-5 border-t-0 rounded-b-lg">
                                            <div className="grid grid-cols-1 mb-3 gap-y-5">
                                                {defaultData?.warehouses?.map((item:any, idx:number) => (
                                                    <div className="flex justify-between" key={idx}>
                                                        <div className="flex items-center gap-2"><Warehouse className="text-[#0284C7]"/> {item?.warehouse?.name}</div>
                                                        <div>
                                                            {item?.status === "pending_verification" ? 
                                                                <Button className="h-7 text-xs">Waiting for Verification</Button>
                                                                :
                                                                <Button className="h-7 text-xs bg-[#DCFCE7] text-[#4A8D34]"><Check/> Stock Verified</Button>
                                                            }
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-4 flex flex-col gap-5">
                    <PaymentInfo defaultData={defaultData} refetch={refetch}/>
                    {defaultData?.recipient_complaints &&
                        <RecipientComplaints defaultData={defaultData}/>
                    }
                </div>
            </div>
           
             
        </div>
    )
}