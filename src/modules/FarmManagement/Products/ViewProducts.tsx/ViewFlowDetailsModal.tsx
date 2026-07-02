import {
    DialogPoweredByFooter,
  } from "@/components/ui/dialog"
import { TViewFlowModal} from "../../utils/types";
import { TextLabel } from "@/components/ui/label";
import { XCircle } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"
import { commaSeparator, formatDateReadable } from "@/lib/helpers";


  export default function ViewFlowDetailsModal({open, setOpen, defaultData, flow_type}:TViewFlowModal){
    return(
        <Sheet open={open}>
            <SheetContent className="md:max-w-[550px] md:max-h-[700px] text-[#334155] rounded-lg mt-4">
                <SheetTitle className="mt-5 flex justify-between px-5">
                    <div className="font-medium text-[#0F172A]">View {flow_type}</div>
                    <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)}/>
                </SheetTitle>
                <hr/>
                <div className="mt-1 p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <TextLabel title="View Order" subTitle={defaultData?.order_id || defaultData?.inflow_order?.order_id || defaultData?.outflow_order?.order_id} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>
                        <div>
                            <TextLabel title="Crop ID" subTitle={defaultData?.crop?.product_id} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>
                        <div>
                            <TextLabel title="Crop Name" subTitle={defaultData?.crop?.name} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>
                        <div>
                            <TextLabel title={`Date of ${flow_type}`} subTitle={formatDateReadable(defaultData?.date_created)} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>
                        <div>
                            <TextLabel title="Weight" subTitle={defaultData?.weight} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>
                        <div>
                            <TextLabel title="Quantity" subTitle={defaultData?.quantity} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>
                        <div>
                            <TextLabel title="Seller/Farmer/Trader" subTitle={defaultData?.buyer?.first_name ? `${defaultData?.buyer?.first_name} ${defaultData?.buyer?.last_name}` : `${defaultData?.aggregator?.first_name} ${defaultData?.aggregator?.last_name}`} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>
                        <div>
                            <TextLabel title="Acquisition Method" subTitle={defaultData?.quantity} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>
                        <div>
                            <TextLabel title="Amount GH₵" subTitle={commaSeparator(defaultData?.amount)} variant="primary"/>
                            <hr className="mt-2"/>
                        </div>
                        {/* <div>
                            <TextLabel title="Created By" subTitle={`${defaultData?.created_by?.first_name} ${defaultData?.created_by?.last_name}`} variant="primary"/>
                            <hr className="mt-2"/>
                        </div> */}
                    </div>
                    
                </div>
                <div className="bottom-0 absolute w-full rounded-b-lg">
                    <DialogPoweredByFooter/>
                </div>
            </SheetContent>
            
        </Sheet>
    )
  }