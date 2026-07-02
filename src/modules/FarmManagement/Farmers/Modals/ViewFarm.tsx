import { Dialog, DialogContent, DialogPoweredByFooter, DialogTitle } from "@/components/ui/dialog";
import { TViewFarmModal } from "../../utils/types";
import { XCircle } from "lucide-react";
import { TextLabel } from "@/components/ui/label";

export default function ViewFarm({open, setOpen, data}:TViewFarmModal){
    return(
        <Dialog open={open}>
            <DialogContent className="sm:max-w-[650px] p-0 text-[#334155] overflow-y-auto">
                <DialogTitle className="mt-5 flex justify-between px-5">
                    <div className="font-medium text-[#0F172A]">View Farm - <span className="text-[#4A8D34]">EF-110203</span></div>
                    <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)}/>
                </DialogTitle>
                <hr/>
                <div className=" px-5 mb-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <TextLabel title="Farm Name" subTitle={data?.farm_name}/>
                        <TextLabel title="Farmer" subTitle={data?.farmer}/>
                        <TextLabel title="Farmer Type" subTitle={data?.farmer_type}/>
                        <TextLabel title="District" subTitle={data?.district}/>
                        <TextLabel title="Land Ownership" subTitle={data?.land_ownership}/>
                        <TextLabel title="Size" subTitle={data?.size}/>
                        <TextLabel title="Farm Type" subTitle={data?.farm_type}/>
                        <TextLabel title="Farm ID" subTitle={data?.farm_id}/>
                    </div>
                </div>
                <DialogPoweredByFooter/>
            </DialogContent>
        </Dialog>
    )
}