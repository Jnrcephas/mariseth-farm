import { DialogPoweredByFooter } from "@/components/ui/dialog";
import { TViewFarmModal } from "../../utils/types";
import { XCircle } from "lucide-react";
import { Label, TextLabel } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { colorPalate } from "@/lib/helpers";

export default function ViewMarisethFarm({open, setOpen, data}:TViewFarmModal){
    return(
        <Sheet open={open}>
            <SheetContent className="md:max-w-[550px] md:max-h-[630px] text-[#334155] rounded-lg mt-4">
                <SheetTitle className="mt-5 flex justify-between px-5">
                    <div className="font-medium text-[#0F172A]">View Farm - <span className="text-[#4A8D34]">{data?.farm_id}</span></div>
                    <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)}/>
                </SheetTitle>
                <hr/>
                <div className=" px-5 mb-5 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <TextLabel title="Farm Name" subTitle={data?.name} />
                        <TextLabel title="Farm ID" subTitle={data?.farm_id}/>
                        <TextLabel title="Farm Location (GPS Coordinates if available)" subTitle={data?.location}/>
                        <TextLabel title="Farm Region" subTitle={data?.region?.name}/>
                        <TextLabel title="Farm District" subTitle={data?.district?.name}/>
                        <TextLabel title="Total Farm Size (in acres/hectors)" subTitle={<>{data?.size} <span className="lowercase">{data?.size_metric?.name}</span></>}/>
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
                    <hr/>
                    <div className="flex justify-end">
                        <TextLabel title="Created By" subTitle={`${data?.created_by?.first_name} ${data?.created_by?.last_name}`}/>
                    </div>
                </div>
                <div className="absolute bottom-0 w-full">
                <DialogPoweredByFooter/></div>
            </SheetContent>
        </Sheet>
    )
}