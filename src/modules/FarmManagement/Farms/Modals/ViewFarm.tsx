import { Dialog, DialogContent, DialogPoweredByFooter, DialogTitle } from "@/components/ui/dialog";
import { TViewFarmModal } from "../../utils/types";
import { XCircle } from "lucide-react";
import { Label, TextLabel } from "@/components/ui/label";
import { colorPalate } from "@/lib/helpers";
import { Badge } from "@/components/ui/badge";

export default function ViewFarm({open, setOpen, data}:TViewFarmModal){
    return(
        <Dialog open={open}>
            <DialogContent className="sm:max-w-[850px] h-[650px] p-0 text-[#334155]">
                <DialogTitle className="mt-5 flex justify-between px-5">
                    <div className="font-medium text-[#0F172A]">View Farm - <span className="text-[#4A8D34]">{data?.farm_id}</span></div>
                    <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)}/>
                </DialogTitle>
                <hr/>
                <div className=" px-5 space-y-5   overflow-y-auto  ">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <TextLabel title="Farm Name" subTitle={data?.name} />
                        <TextLabel title="Farm ID" subTitle={data?.farm_id}/>
                        <TextLabel title="Farmer Name" subTitle={
                            <div>
                                {data?.farmer?.first_name} {data?.farmer?.last_name}
                                <div className="font-normal text-xs">{data?.farmer?.type === "lead" ? "Lead Farmer" : "Smallholder Farmer"}</div>
                            </div>}
                        />
                        <TextLabel title="Farm Location (GPS Coordinates if available)" subTitle={data?.location}/>
                        <TextLabel title="Farm Region" subTitle={data?.region?.name}/>
                        <TextLabel title="Farm District" subTitle={data?.district?.name}/>
                        <TextLabel title="Total Farm Size (in acres/hectors)" subTitle={<>{data?.size} <span className="lowercase">{data?.size_metric?.name}</span></>}/>
                        <TextLabel title="Land Ownership" subTitle={data?.land_ownership}/>
                        <TextLabel title="Other Option" subTitle={data?.other_specification}/>
                    </div>
                    <hr/>
                    <div>
                        <Label className="text-[#4A8D34] text-xs font-bold mb-1">Main Crops Grown</Label>
                        <div className="space-x-1">
                            {data?.crops?.map((item:any, idx: number) => (
                                <Badge key={idx} style={{backgroundColor: colorPalate(item?.product?.color).bgColor, color: colorPalate(item?.product?.color).color}} className="capitalize">
                                    {item?.product?.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <div>
                        <Label className="text-[#4A8D34] text-xs font-bold mb-1">Other Products</Label>
                        {data?.livestock?.map((item:any, idx: number) => (
                            <Badge key={`l-${idx}`} style={{backgroundColor: colorPalate(item?.product?.color).bgColor, color: colorPalate(item?.product?.color).color}} className="capitalize me-2">
                                {item?.product?.name}
                            </Badge>
                        ))}
                    </div>
                    <div className="text-sm font-medium text-[#0F172A] mb-5">AGRICULTURE PRACTICES</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <TextLabel title="Use of Fertilizers" subTitle={data?.use_of_fertilizers} />
                        <TextLabel title="Farming Methods" subTitle={data?.farming_methods} />
                    </div>
                    <hr/>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <TextLabel title="Irrigation" subTitle={data?.irrigation ? "Yes" : 'No'} />
                        <TextLabel title="Access to Market" subTitle={data?.has_access_to_market ? "Yes" : 'No'} />
                    </div>
                </div>
                <DialogPoweredByFooter/>
            </DialogContent>
        </Dialog>
    )
}