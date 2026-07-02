import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { XCircle } from "lucide-react"
import Image from "next/image";

export default function ViewDocModal({
    open, 
    setOpen, 
   data
    }:{
        open: boolean, 
        setOpen: (open: boolean) => void, 
        data: any
    }) {
   
    return(
        <Dialog open={open}>
            <DialogContent className="sm:max-w-[750px]  p-0 text-[#334155] !rounded-b-lg">
                <DialogTitle className="mt-5 flex justify-between px-5">
                    <div className="font-medium text-[#0F172A]">{data?.title}</div>
                    <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)}/>
                </DialogTitle>
                <div className="px-2 text-center overflow-y-auto">
                    <Image src={data?.certificate} 
                    alt="1"
                        loading="lazy"
                        width={600}
                        height={500}
                        className="w-full h-[500px] my-5 contain"
                        title={data?.title}>
                    </Image>
                </div>
               
            </DialogContent>
        </Dialog>
    )
}