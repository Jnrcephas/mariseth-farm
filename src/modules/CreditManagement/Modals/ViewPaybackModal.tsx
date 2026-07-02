"use client"

import {
    DialogPoweredByFooter,
  } from "@/components/ui/dialog"
import { TextLabel } from "@/components/ui/label";
import { XCircle } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"
import { TModal } from "@/lib/types";
import { formatDateReadable } from "@/lib/helpers";
import { CEDI } from "@/lib/constants";


  export default function ViewPaybackModal({open, setOpen, defaultData}:TModal){

    return(
        <Sheet open={open}>
            <SheetContent className="md:max-w-[550px] md:max-h-[700px] text-[#334155] rounded-lg mt-4">
                <SheetTitle className="mt-5 flex justify-between px-5">
                    <div className="font-medium text-[#0F172A]">View Payback - {defaultData?.id}</div>
                    <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)}/>
                </SheetTitle>
                <hr/>
                <div className=" p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <TextLabel title="Farmer" subTitle={`${defaultData?.credit?.farmer?.first_name} ${defaultData?.credit?.farmer?.last_name}`} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>
                        <div>
                            <TextLabel title="Credit Type" subTitle={defaultData?.credit?.type?.replaceAll("_", " ")} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>
                        <div>
                            <TextLabel title="Inputs Credits" subTitle={defaultData?.credit?.input_credits || "N/A"} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>
                        <div>
                            <TextLabel title="Quantity" subTitle={defaultData?.credit?.quantity} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>
                        <div>
                            <TextLabel title="Issue Date" subTitle={formatDateReadable(defaultData?.credit?.issue_date)} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>
                        <div>
                            <TextLabel title="Due Date" subTitle={formatDateReadable(defaultData?.credit?.due_date)} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>
                        <div>
                            <TextLabel title="Credit Amount" subTitle={`${CEDI} ${defaultData?.credit?.credit_amount}`} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>
                        <div>
                            <TextLabel title="Interest Rate" subTitle={`${Number(defaultData?.credit?.interest_rate || 0).toFixed(0)}%`} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>
                        
                    </div>
                    <div className="mt-5">
                        <div>
                            <TextLabel title="Extra Information/Notes" subTitle={defaultData?.credit?.notes} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>

                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-5">
                        <div>
                            <TextLabel title="Payback Method" subTitle={defaultData?.payback_method} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>
                       
                        <div>
                            <TextLabel title="Payback Amount"  subTitle={`${CEDI} ${defaultData?.amount}`} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>
                        <div>
                            <TextLabel title="Outstanding"  subTitle={`${CEDI} ${defaultData?.outstanding_after}`} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>

                        <div>
                            <TextLabel title="Created By" subTitle={`${defaultData?.created_by?.first_name} ${defaultData?.created_by?.last_name}`} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>
                    </div>
                    
                </div>
                <div className="bottom-0 absolute w-full rounded-b-lg">
                    <DialogPoweredByFooter/>
                </div>
            </SheetContent>
            
        </Sheet>
    )
  }