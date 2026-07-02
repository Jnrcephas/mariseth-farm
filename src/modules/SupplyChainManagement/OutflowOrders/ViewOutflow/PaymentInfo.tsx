"use client"
import { CEDI } from "@/lib/constants";
import { commaSeparator, formatText } from "@/lib/helpers";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { TextLabel } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import moment from "moment";
import { useState } from "react";
import RecordPaymentModal from "../Modals/RecordPaymentModal";

export default function PaymentInfo({defaultData, refetch, makePayment=true}:{defaultData: any, refetch?: () => void; makePayment?: boolean}){
        const [paymentModal, setPaymentModal] = useState(false)
    
    return(
        <div>
        <Accordion type="single" collapsible className="w-full " defaultValue="item-2">
            <AccordionItem value="item-2">
                <AccordionTrigger className="border px-5 rounded-t-lg text-[#4A8D34] text">Payments Information</AccordionTrigger>
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
                        {defaultData?.payments?.map((item: any, idx: number) =>(
                            <AccordionItem value={`item-${idx + 1}`} key={idx}>
                                <AccordionTrigger className="text-[#677788] capitalize">{`${CEDI} ${commaSeparator(item?.amount_paid)}`} - {item?.payment_type}</AccordionTrigger>
                                <AccordionContent className="text-balance">
                                    <hr className="mb-2"/>
                                    <div className="grid grid-cols-1 gap-5">
                                        <div className="grid grid-cols-2 gap-5">
                                            <TextLabel title={"Payment Method"} subTitle={`${formatText(item?.payment_method)} ${item?.payment_method === "mobile_money" ? `(${item?.mobile_money_number})` :""}`} />
                                            <TextLabel title={"Paid To"} subTitle={item?.paid_to} />
                                        </div>
                                        <TextLabel title={"Comments"} subTitle={item?.notes} />
                                        <div className="grid grid-cols-2 gap-5">
                                            <TextLabel title={"Amount Received"} subTitle={`${CEDI} ${commaSeparator(item?.amount_paid)}`} />
                                            <TextLabel title={"Amount Reminder"} subTitle={`${CEDI} ${commaSeparator(item?.amount_due)}`} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-5">
                                            <TextLabel title={"Order Total"} subTitle={`${CEDI} ${commaSeparator(defaultData?.total_cost)}`} />
                                            <TextLabel title={"Payment Date"} subTitle={moment(item?.payment_date).format("Do MMMM, YYYY - h:mm a")} />
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                    {makePayment && defaultData?.payments?.length  ? <>
                        <hr className="my-3"/>
                        {(Number(Number(defaultData?.amount_due).toFixed(0)) > 0) && 
                        <div className="flex justify-center">
                            <Button className="h-6 text-xs" onClick={() => setPaymentModal(true)}>Make Payment</Button>
                        </div>}
                        </>:<div className="text-center text-[#64748B]">Payments Not Available</div>
                    }
                </AccordionContent>
            </AccordionItem>
        </Accordion>
        {paymentModal &&
            <RecordPaymentModal
                open={paymentModal} 
                setOpen={setPaymentModal} 
                defaultData={defaultData} 
                refetch={refetch}
            />
        }
        </div>
    )
}