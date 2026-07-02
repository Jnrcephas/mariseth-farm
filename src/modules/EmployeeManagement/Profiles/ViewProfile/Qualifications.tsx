import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { handleDownload } from "@/lib/helpers";
import { Download, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ViewDocModal from "../Modals/VIewDocModal";

export default function ViewQualifications({data}:{data: any}){
    const [selected, setSelected] = useState<any>({})
    const [viewModal, setViewModal] = useState(false)

    function handleView(item: any){
        setSelected(item)
        setViewModal(true)
    }
    return(
        <div className="bg-white rounded-lg border p-5">
            <div className="flex flex-col gap-5">
                {data?.qualifications?.length ? 
                <div className=" rounded-lg p-3 py-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                    {data?.qualifications?.map((item: any, idx:number) => (
                        <div key={`q-${idx}`} className="border rounded-lg flex justify-between p-2 ">
                            <div className="flex items-center gap-2">
                                <Image src="/images/pdf.svg" width={20} height={20} alt="pdf"/>
                                <div className="text-sm">{item?.title}</div>
                            </div>
                            <div className="flex justify-between items-center gap-2">
                                <Tooltip>
                                    <TooltipTrigger>
                                        <ImageIcon className="stroke-green-600 cursor-pointer w-5" onClick={() => handleView(item)}/>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>View Document</p>
                                    </TooltipContent>
                                </Tooltip>
                                <div className="text-gray-200">|</div>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Download className="stroke-blue-500 cursor-pointer" size={15} onClick={() => handleDownload(item?.certificate || "", item?.description)}/></TooltipTrigger>
                                    <TooltipContent>
                                        <p>Download Document</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                    ))}
                </div>:<div className="flex justify-center items-center text-xl font-medium py-10">
                    No Documents Uploaded
                    </div>}
            </div>
            {viewModal &&
                <ViewDocModal open={viewModal} setOpen={setViewModal} data={selected}/>
            }
        </div>
    )
}