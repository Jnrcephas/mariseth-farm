"use client"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Mail, PhoneCall, XCircle } from "lucide-react"

export default function SupportModal({
    open, 
    setOpen, 
    }:{
        open: boolean;
        setOpen: (open: boolean) => void;
    }){
   
    return(
        <Dialog open={open}>
            <DialogContent className="sm:max-w-[500px] p-0 text-[#334155] !rounded-b-lg">
                <DialogTitle className="mt-2 flex justify-end px-3">
                    {/* <div className="font-medium text-[#0F172A]">Delete this farm?</div> */}
                    <XCircle className="text-red-500 cursor-pointer" onClick={() => setOpen(false)}/>
                </DialogTitle>
                <div className="mb-10 px-5 text-center">
                    Samuel Larinde-Oludoyi <br/>
                    <div className="mt-2 flex items-center justify-center gap-2 text-blue-600 font-medium text-sm">
                       <PhoneCall/>  +233 55 577 0017
                    </div>
                    <div className="mt-2 flex items-center justify-center gap-2 text-blue-600 font-medium text-sm">
                       <Mail/>  slarinde@marisethfarms.com
                    </div>
                </div>
                {/* <DialogFooter className="flex !justify-between p-5 bg-[#F8FAFC]">
                    <Button type="button" variant={"outline"} onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleDelete} type="button" variant={"destructive"}>
                        <LoadingLabel isLoading={isPending}>
                             Yes, Delete
                        </LoadingLabel>
                    </Button>
                </DialogFooter> */}
            </DialogContent>
        </Dialog>
    )
}