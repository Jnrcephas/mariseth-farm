"use client"

import {
    DialogPoweredByFooter,
  } from "@/components/ui/dialog"
import { TAddFarmModal} from "../../utils/types";
import { TextLabel } from "@/components/ui/label";
import { XCircle } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"


  export default function ViewProductModal({open, setOpen, defaultData}:TAddFarmModal){

    return(
        <Sheet open={open}>
            <SheetContent className="md:max-w-[550px] md:max-h-[700px] text-[#334155] rounded-lg mt-4">
                <SheetTitle className="mt-5 flex justify-between px-5">
                    <div className="font-medium text-[#0F172A]">Vew Livestock - {defaultData?.product_id}</div>
                    <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)}/>
                </SheetTitle>
                <hr/>
                <div className="mt-1 p-5">
                    <div className="grid grid-cols-1 gap-8">
                        <div>
                            <TextLabel title="Livestock Name" subTitle={defaultData?.name} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>
                        <div>
                            <TextLabel title="Category" subTitle={defaultData?.category?.name} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>
                        <div>
                            <TextLabel title="Description" subTitle={defaultData?.description || "N/A"} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>
                        <div>
                            <TextLabel title="Breed" subTitle={defaultData?.breed || "N/A"} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>
                        <div>
                            <TextLabel title="Quantity" subTitle={defaultData?.quantity} variant="primary"/>
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